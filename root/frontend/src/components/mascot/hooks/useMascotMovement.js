import { useState, useEffect, useRef, useCallback } from "react";
import {
    evaluateCatmullRom2D,
    generateFlightWaypoints,
    getHarmonicHover,
    calculateBankingRoll,
    clampToBounds
} from "../utils/splineKinematics";

export function useMascotMovement(botRef, onAction) {
    // ─── CORE COORDINATE & PHYSICS REFS ───
    // Base position (relative to docked origin 0,0)
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const posRef = useRef({ x: 0, y: 0 });
    posRef.current = position;

    // Display coordinates (including hover drift and pull offset)
    const [displayPos, setDisplayPos] = useState({ x: 0, y: 0 });
    const [bankingTilt, setBankingTilt] = useState(0);

    // Draggable interaction refs
    const isDraggingRef = useRef(false);
    const [isDraggingState, setIsDraggingState] = useState(false);
    const dragStartOffset = useRef({ x: 0, y: 0 });
    const clickStartPos = useRef({ x: 0, y: 0 });
    const velocitySamples = useRef([]);

    // Inertia on drag release
    const inertiaRef = useRef({ active: false, vx: 0, vy: 0 });

    // Spline Flight state
    const flightRef = useRef({
        active: false,
        waypoints: null,
        startTime: 0,
        duration: 1200,
        startPos: { x: 0, y: 0 },
        targetPos: { x: 0, y: 0 }
    });

    // Eye states & head tilt
    const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [isCurious, setIsCurious] = useState(false);

    // Idle approach / Wander states
    const idleTimeoutRef = useRef(null);
    const mousePosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    const isApproachingRef = useRef(false);
    const isTouchDeviceRef = useRef(false);

    // Click & drawer pull states
    const [isPulling, setIsPulling] = useState(false);
    const [pullOffset, setPullOffset] = useState(0);

    // RAF Loop identifier
    const animationFrameRef = useRef(null);

    // ─── SCREEN BOUNDS COMPUTATION ───
    const getScreenBounds = useCallback(() => {
        const margin = 24;
        const botSize = 120;
        return {
            minX: -(window.innerWidth - botSize - margin * 2),
            maxX: 0,
            minY: -(window.innerHeight - botSize - margin * 2),
            maxY: 0
        };
    }, []);

    // ─── INITIATE SPLINE FLIGHT ───
    const startSplineFlight = useCallback((targetPos, duration = 1200) => {
        const bounds = getScreenBounds();
        const clampedTarget = clampToBounds(targetPos, bounds);
        const currentPos = posRef.current;

        // Waypoints: [p0, p1 (start), p2 (apex), p3 (target), p4]
        const waypoints = generateFlightWaypoints(currentPos, clampedTarget, bounds);

        flightRef.current = {
            active: true,
            waypoints,
            startTime: performance.now(),
            duration,
            startPos: { ...currentPos },
            targetPos: clampedTarget
        };

        // Cancel any pending inertia
        inertiaRef.current.active = false;
    }, [getScreenBounds]);

    // ─── IDLE LOGIC (Wander or Cursor Approach via Spline) ───
    const checkIdle = useCallback(() => {
        if (isDraggingRef.current || isPulling) return;

        const botRect = botRef.current?.getBoundingClientRect();
        if (!botRect) return;

        const currentScreenX = botRect.left + botRect.width / 2;
        const currentScreenY = botRect.top + botRect.height / 2;

        isApproachingRef.current = true;
        setIsCurious(true);

        const bounds = getScreenBounds();

        if (isTouchDeviceRef.current) {
            // Wander Mode: Smooth swoop within nearby radius
            const wanderRadius = 120;
            const randAngle = Math.random() * Math.PI * 2;
            const targetX = posRef.current.x + Math.cos(randAngle) * wanderRadius;
            const targetY = posRef.current.y + Math.sin(randAngle) * wanderRadius;

            startSplineFlight({ x: targetX, y: targetY }, 1400);
        } else {
            // Cursor Approach Mode: Swoop 55% of the distance towards the pointer
            const targetScreenX = mousePosRef.current.x;
            const targetScreenY = mousePosRef.current.y;

            const deltaX = targetScreenX - currentScreenX;
            const deltaY = targetScreenY - currentScreenY;
            const distance = Math.hypot(deltaX, deltaY);

            if (distance > 140) {
                const moveX = deltaX * 0.55;
                const moveY = deltaY * 0.55;
                const targetPos = {
                    x: posRef.current.x + moveX,
                    y: posRef.current.y + moveY
                };

                startSplineFlight(targetPos, 1300);
            } else {
                isApproachingRef.current = false;
                setIsCurious(false);
            }
        }
    }, [isPulling, botRef, getScreenBounds, startSplineFlight]);

    const resetIdleTimer = useCallback(() => {
        if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);

        // If currently wandering/approaching, return to docked origin smoothly
        if (isApproachingRef.current) {
            isApproachingRef.current = false;
            setIsCurious(false);
            startSplineFlight({ x: 0, y: 0 }, 1000);
        }

        idleTimeoutRef.current = setTimeout(checkIdle, 10000);
    }, [checkIdle, startSplineFlight]);

    // ─── CONTINUOUS RAF KINEMATICS & PHYSICS LOOP ───
    useEffect(() => {
        let lastFrameTime = performance.now();

        const loop = (currentTime) => {
            const deltaTime = Math.min((currentTime - lastFrameTime) / 1000, 0.1);
            lastFrameTime = currentTime;

            let currentPos = { ...posRef.current };
            let currentBank = 0;

            const bounds = getScreenBounds();

            // 1. ACTIVE SPLINE FLIGHT
            if (flightRef.current.active) {
                const { waypoints, startTime, duration } = flightRef.current;
                const elapsed = currentTime - startTime;
                const rawT = Math.min(1, elapsed / duration);

                // Smooth S-curve easing (smootherstep)
                const easedT = rawT * rawT * rawT * (rawT * (rawT * 6 - 15) + 10);

                if (waypoints && waypoints.length >= 4) {
                    // Evaluate Catmull-Rom across middle span [p1 -> p2 -> p3]
                    const evalResult = evaluateCatmullRom2D(
                        waypoints[0],
                        waypoints[1],
                        waypoints[2],
                        waypoints[3],
                        easedT
                    );

                    currentPos = clampToBounds(evalResult.point, bounds);
                    currentBank = calculateBankingRoll(evalResult.tangent, 14);
                }

                if (rawT >= 1) {
                    flightRef.current.active = false;
                    currentPos = clampToBounds(flightRef.current.targetPos, bounds);
                }

                setPosition(currentPos);
            }
            // 2. DRAG RELEASE INERTIA (Damped Soft Stop)
            else if (inertiaRef.current.active) {
                const { vx, vy } = inertiaRef.current;
                currentPos.x += vx;
                currentPos.y += vy;

                // Aerodynamic roll from horizontal momentum
                currentBank = calculateBankingRoll({ x: vx * 12, y: vy * 12 }, 10);

                // Soft friction decay
                const friction = 0.90;
                inertiaRef.current.vx *= friction;
                inertiaRef.current.vy *= friction;

                // Soft stop at edge margins
                if (currentPos.x <= bounds.minX) {
                    currentPos.x = bounds.minX;
                    inertiaRef.current.vx = 0;
                } else if (currentPos.x >= bounds.maxX) {
                    currentPos.x = bounds.maxX;
                    inertiaRef.current.vx = 0;
                }

                if (currentPos.y <= bounds.minY) {
                    currentPos.y = bounds.minY;
                    inertiaRef.current.vy = 0;
                } else if (currentPos.y >= bounds.maxY) {
                    currentPos.y = bounds.maxY;
                    inertiaRef.current.vy = 0;
                }

                // Halt when velocity falls below threshold
                if (Math.hypot(inertiaRef.current.vx, inertiaRef.current.vy) < 0.15) {
                    inertiaRef.current.active = false;
                }

                setPosition(currentPos);
            }

            // 3. MULTI-HARMONIC IDLE HOVER (Lissajous Drone Drift)
            let hoverOffset = { x: 0, y: 0, tilt: 0 };
            if (!isDraggingRef.current && !flightRef.current.active && !inertiaRef.current.active && !isPulling) {
                hoverOffset = getHarmonicHover(currentTime / 1000);
            }

            // Combine final render coordinates
            setDisplayPos({
                x: currentPos.x + hoverOffset.x + pullOffset,
                y: currentPos.y + hoverOffset.y
            });

            // Combine banking roll
            setBankingTilt(currentBank + hoverOffset.tilt);

            animationFrameRef.current = requestAnimationFrame(loop);
        };

        animationFrameRef.current = requestAnimationFrame(loop);

        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [getScreenBounds, isPulling, pullOffset]);

    // ─── POINTER & EYE TRACKING ───
    useEffect(() => {
        const handlePointerMove = (e) => {
            if (e.pointerType === 'touch') {
                isTouchDeviceRef.current = true;
            } else {
                isTouchDeviceRef.current = false;
            }

            mousePosRef.current = { x: e.clientX, y: e.clientY };
            resetIdleTimer();

            if (!botRef.current) return;
            const rect = botRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            const distance = Math.hypot(deltaX, deltaY);

            // Curious expression when cursor moves close
            if (distance < 110 && !isApproachingRef.current && e.pointerType !== 'touch') {
                setIsCurious(true);
            } else if (!isApproachingRef.current) {
                setIsCurious(false);
            }

            // Clamped eye pupil tracking
            const maxEyeRadius = isCurious ? 4 : 6;
            const eyeX = (deltaX / (distance || 1)) * Math.min(Math.abs(deltaX) * 0.05, maxEyeRadius);
            const eyeY = (deltaY / (distance || 1)) * Math.min(Math.abs(deltaY) * 0.05, maxEyeRadius);

            // Head pitch and yaw tilt
            const tiltX = Math.max(-8, Math.min(8, -deltaY * 0.02));
            const tiltY = Math.max(-8, Math.min(8, deltaX * 0.02));

            setEyeOffset({ x: eyeX, y: eyeY });
            setTilt({ x: tiltX, y: tiltY });
        };

        window.addEventListener("pointermove", handlePointerMove, { passive: true });
        resetIdleTimer();

        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
        };
    }, [resetIdleTimer, isCurious, botRef]);

    // ─── DRAG & THROW LOGIC ───
    const handlePointerDown = (e) => {
        e.preventDefault();
        if (isPulling) return;

        // Cancel active flight or inertia
        flightRef.current.active = false;
        inertiaRef.current.active = false;

        isDraggingRef.current = true;
        setIsDraggingState(true);
        clickStartPos.current = { x: e.clientX, y: e.clientY };

        dragStartOffset.current = {
            x: e.clientX - posRef.current.x,
            y: e.clientY - posRef.current.y
        };

        velocitySamples.current = [{
            x: e.clientX,
            y: e.clientY,
            time: performance.now()
        }];

        if (isApproachingRef.current) {
            isApproachingRef.current = false;
            setIsCurious(false);
        }

        document.addEventListener("pointermove", handleDragMove, { passive: false });
        document.addEventListener("pointerup", handlePointerUp);
        document.addEventListener("pointercancel", handlePointerUp);
    };

    const handleDragMove = (e) => {
        if (!isDraggingRef.current) return;

        const bounds = getScreenBounds();
        const rawX = e.clientX - dragStartOffset.current.x;
        const rawY = e.clientY - dragStartOffset.current.y;

        const clamped = clampToBounds({ x: rawX, y: rawY }, bounds);
        setPosition(clamped);

        // Record recent velocity samples (last 4 samples)
        const now = performance.now();
        velocitySamples.current.push({ x: e.clientX, y: e.clientY, time: now });
        if (velocitySamples.current.length > 5) {
            velocitySamples.current.shift();
        }
    };

    const handlePointerUp = (e) => {
        isDraggingRef.current = false;
        setIsDraggingState(false);
        document.removeEventListener("pointermove", handleDragMove);
        document.removeEventListener("pointerup", handlePointerUp);
        document.removeEventListener("pointercancel", handlePointerUp);

        // Calculate release throw velocity
        const samples = velocitySamples.current;
        if (samples.length >= 2) {
            const first = samples[0];
            const last = samples[samples.length - 1];
            const dt = Math.max(1, last.time - first.time);

            // Velocity in pixels per frame (~16.6ms)
            const vx = ((last.x - first.x) / dt) * 16.67;
            const vy = ((last.y - first.y) / dt) * 16.67;
            const speed = Math.hypot(vx, vy);

            if (speed > 1.2) {
                // Launch damped inertia glide
                inertiaRef.current = {
                    active: true,
                    vx: Math.max(-25, Math.min(25, vx)),
                    vy: Math.max(-25, Math.min(25, vy))
                };
            }
        }

        // Click detection
        const distance = Math.hypot(
            e.clientX - clickStartPos.current.x,
            e.clientY - clickStartPos.current.y
        );
        if (distance < 6) {
            handleValidClick();
        }
    };

    // ─── CLICK / DRAWER PULL ANIMATION ───
    const handleValidClick = () => {
        if (isPulling) return;

        // Immediate click notification for Easter eggs
        if (onAction) onAction({ type: 'click' });

        // Pull sequence: slides 60px right, triggers drawer, snaps back
        setIsPulling(true);
        setPullOffset(60);

        setTimeout(() => {
            if (onAction) onAction({ type: 'openDrawer' });

            setTimeout(() => {
                setPullOffset(0);
                setIsPulling(false);
            }, 300);
        }, 300);
    };

    return {
        displayPos,
        bankingTilt,
        isDraggingState,
        isPulling,
        eyeOffset,
        tilt,
        isCurious,
        handlePointerDown
    };
}
