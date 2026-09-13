import { useState, useEffect, useRef, useCallback } from "react";

export function useMascotMovement(botRef, onAction) {
    const animationFrameRef = useRef(null);
    const idleTimeoutRef = useRef(null);

    // Draggable states
    const [position, setPosition] = useState({ x: 0, y: 0 }); // Origin is 0,0
    const isDraggingRef = useRef(false);
    const dragStartOffset = useRef({ x: 0, y: 0 });
    const clickStartPos = useRef({ x: 0, y: 0 });
    const [isDraggingState, setIsDraggingState] = useState(false);

    // Eye states
    const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [isCurious, setIsCurious] = useState(false);

    // Idle approach / Wander states
    const [approachPos, setApproachPos] = useState(null);
    const mousePosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 }); // Default to center
    const isApproachingRef = useRef(false);
    const isTouchDeviceRef = useRef(false); // To determine Wander vs Cursor Approach

    // Click/Transition states
    const [isPulling, setIsPulling] = useState(false);
    const [pullOffset, setPullOffset] = useState(0);

    // ─── IDLE LOGIC (V1.1 Cursor Approach + Mobile Wander) ───
    const checkIdle = useCallback(() => {
        if (isDraggingRef.current || isPulling) return;

        const botRect = botRef.current?.getBoundingClientRect();
        if (!botRect) return;

        const currentX = botRect.left + botRect.width / 2;
        const currentY = botRect.top + botRect.height / 2;

        isApproachingRef.current = true;
        setIsCurious(true);

        if (isTouchDeviceRef.current) {
            // V1.1 Wander Mode (Mobile)
            // Pick a random coordinate within a radius (e.g., +/- 100px) from current visually clamped position
            const wanderRadius = 100;
            const randX = (Math.random() * 2 - 1) * wanderRadius;
            const randY = (Math.random() * 2 - 1) * wanderRadius;
            
            setApproachPos({
                x: position.x + randX,
                y: position.y + randY
            });
        } else {
            // V1.1 Cursor Approach Mode (Desktop)
            const targetX = mousePosRef.current.x;
            const targetY = mousePosRef.current.y;
            
            const deltaX = targetX - currentX;
            const deltaY = targetY - currentY;
            const distance = Math.hypot(deltaX, deltaY);

            if (distance > 150) {
                // Move 60% of the way towards the cursor
                const moveX = deltaX * 0.6;
                const moveY = deltaY * 0.6;
                
                setApproachPos({
                    x: position.x + moveX,
                    y: position.y + moveY
                });
            } else {
                // If already close, just cancel approach state visually
                isApproachingRef.current = false;
                setIsCurious(false);
            }
        }
    }, [position, isPulling, botRef]);

    const resetIdleTimer = useCallback(() => {
        if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);

        // If we were approaching/wandering, run back to origin (position)
        if (isApproachingRef.current) {
            isApproachingRef.current = false;
            setApproachPos(null);
            setIsCurious(false);
        }

        // Restart timer (10s)
        idleTimeoutRef.current = setTimeout(checkIdle, 10000);
    }, [checkIdle]);

    // ─── POINTER / EYE TRACKING ───
    useEffect(() => {
        const handlePointerMove = (e) => {
            // Detect touch vs mouse
            if (e.pointerType === 'touch') {
                isTouchDeviceRef.current = true;
            } else {
                isTouchDeviceRef.current = false;
            }

            mousePosRef.current = { x: e.clientX, y: e.clientY };
            resetIdleTimer();

            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            animationFrameRef.current = requestAnimationFrame(() => {
                if (!botRef.current) return;
                const rect = botRef.current.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const deltaX = e.clientX - centerX;
                const deltaY = e.clientY - centerY;
                const distance = Math.hypot(deltaX, deltaY);

                // Curious expression if cursor is close and moving fast
                if (distance < 100 && !isApproachingRef.current && e.pointerType !== 'touch') {
                    setIsCurious(true);
                } else if (!isApproachingRef.current) {
                    setIsCurious(false);
                }

                // Eye tracking limits
                const maxEyeRadius = isCurious ? 4 : 6;
                const eyeX = (deltaX / (distance || 1)) * Math.min(Math.abs(deltaX) * 0.05, maxEyeRadius);
                const eyeY = (deltaY / (distance || 1)) * Math.min(Math.abs(deltaY) * 0.05, maxEyeRadius);

                // Subtle head tilt
                const tiltX = Math.max(-8, Math.min(8, -deltaY * 0.02));
                const tiltY = Math.max(-8, Math.min(8, deltaX * 0.02));

                setEyeOffset({ x: eyeX, y: eyeY });
                setTilt({ x: tiltX, y: tiltY });
            });
        };

        window.addEventListener("pointermove", handlePointerMove);
        resetIdleTimer(); // Start timer on mount
        
        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [resetIdleTimer, isCurious, botRef]);

    // ─── DRAG LOGIC ───
    const handlePointerDown = (e) => {
        e.preventDefault(); 
        if (isPulling) return;
        
        isDraggingRef.current = true;
        setIsDraggingState(true);
        clickStartPos.current = { x: e.clientX, y: e.clientY };
        
        dragStartOffset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
        
        if (isApproachingRef.current) {
            isApproachingRef.current = false;
            setApproachPos(null);
            setIsCurious(false);
        }

        document.addEventListener("pointermove", handleDragMove);
        document.addEventListener("pointerup", handlePointerUp);
    };

    const handleDragMove = (e) => {
        if (!isDraggingRef.current) return;
        let newX = e.clientX - dragStartOffset.current.x;
        let newY = e.clientY - dragStartOffset.current.y;
        setPosition({ x: newX, y: newY });
    };

    const handlePointerUp = (e) => {
        isDraggingRef.current = false;
        setIsDraggingState(false);
        document.removeEventListener("pointermove", handleDragMove);
        document.removeEventListener("pointerup", handlePointerUp);

        // Click detection
        const distance = Math.hypot(e.clientX - clickStartPos.current.x, e.clientY - clickStartPos.current.y);
        if (distance < 5) {
            handleValidClick();
        }
    };

    // ─── CLICK / PULL ANIMATION (V1.1) ───
    const handleValidClick = () => {
        if (isPulling) return;
        
        // Notify parent of a valid click IMMEDIATELY (for Easter eggs)
        if (onAction) onAction({ type: 'click' });

        // V1.1 Drawer Pull: Slide the bot slightly to the right to simulate pulling the drawer
        setIsPulling(true);
        setPullOffset(60); // Move 60px to the right visually
        
        setTimeout(() => {
            // Notify parent to OPEN DRAWER after slide completes
            if (onAction) onAction({ type: 'openDrawer' });
            
            // Slide back to normal position after opening
            setTimeout(() => {
                setPullOffset(0);
                setIsPulling(false);
            }, 300);
        }, 300); 
    };

    // Calculate final display position
    let finalPos = { ...position };
    if (approachPos) {
        finalPos = { ...approachPos };
    }
    // Apply pull offset if active
    finalPos.x += pullOffset;

    return {
        displayPos: finalPos,
        isDraggingState,
        isPulling,
        eyeOffset,
        tilt,
        isCurious,
        handlePointerDown
    };
}
