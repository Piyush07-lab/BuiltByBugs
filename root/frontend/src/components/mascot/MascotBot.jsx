import { useState, useEffect, useRef, useCallback } from "react";
import { useDrawer } from "../drawer";

export default function MascotBot() {
    const { openDrawer } = useDrawer();
    const botRef = useRef(null);
    const animationFrameRef = useRef(null);
    const idleTimeoutRef = useRef(null);
    
    // Draggable states
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const isDraggingRef = useRef(false);
    const dragStartOffset = useRef({ x: 0, y: 0 });
    const clickStartPos = useRef({ x: 0, y: 0 });
    const [isDraggingState, setIsDraggingState] = useState(false);

    // Eye states
    const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [isCurious, setIsCurious] = useState(false);
    
    // Idle approach states
    const [approachPos, setApproachPos] = useState(null);
    const mousePosRef = useRef({ x: 0, y: 0 });
    const isApproachingRef = useRef(false);

    // Click/Transition states
    const [isSpinning, setIsSpinning] = useState(false);
    const [isEasterEgg, setIsEasterEgg] = useState(false);
    const [clickCount, setClickCount] = useState(0);

    const checkIdle = useCallback(() => {
        if (isDraggingRef.current) return;
        
        // Approach the mouse
        const botRect = botRef.current?.getBoundingClientRect();
        if (!botRect) return;

        const currentX = botRect.left + botRect.width / 2;
        const currentY = botRect.top + botRect.height / 2;
        const targetX = mousePosRef.current.x;
        const targetY = mousePosRef.current.y;
        
        const deltaX = targetX - currentX;
        const deltaY = targetY - currentY;
        const distance = Math.hypot(deltaX, deltaY);

        if (distance > 150) { // Only approach if somewhat far
            isApproachingRef.current = true;
            setIsCurious(true);
            
            // Move 60% of the way towards the cursor
            const moveX = deltaX * 0.6;
            const moveY = deltaY * 0.6;
            
            setApproachPos({
                x: position.x + moveX,
                y: position.y + moveY
            });
        }
    }, [position]);

    const resetIdleTimer = useCallback(() => {
        if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
        
        // If we were approaching, run back to origin (position)
        if (isApproachingRef.current) {
            isApproachingRef.current = false;
            setApproachPos(null);
            setIsCurious(false);
        }

        idleTimeoutRef.current = setTimeout(checkIdle, 10000); // 10 seconds
    }, [checkIdle]);

    useEffect(() => {
        const handleMouseMove = (e) => {
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

                // Curious expression if cursor is close and moving fast, or approaching
                if (distance < 100 && !isApproachingRef.current) {
                    setIsCurious(true);
                } else if (!isApproachingRef.current) {
                    setIsCurious(false);
                }

                // Eye tracking limits (tighter if curious to simulate squint/focus)
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

        window.addEventListener("mousemove", handleMouseMove);
        resetIdleTimer(); // Start timer on mount
        
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [resetIdleTimer, isCurious]);

    // --- DRAG LOGIC ---
    const handlePointerDown = (e) => {
        e.preventDefault(); // Prevent ghost image drag
        if (isSpinning) return;
        
        isDraggingRef.current = true;
        setIsDraggingState(true);
        clickStartPos.current = { x: e.clientX, y: e.clientY };
        
        // Offset between pointer and current bot position state
        dragStartOffset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
        
        // Cancel approach if grabbing during it
        if (isApproachingRef.current) {
            isApproachingRef.current = false;
            setApproachPos(null);
            setIsCurious(false);
        }

        document.addEventListener("pointermove", handlePointerMove);
        document.addEventListener("pointerup", handlePointerUp);
    };

    const handlePointerMove = (e) => {
        if (!isDraggingRef.current) return;
        
        // Calculate new position relative to start
        let newX = e.clientX - dragStartOffset.current.x;
        let newY = e.clientY - dragStartOffset.current.y;
        
        setPosition({ x: newX, y: newY });
    };

    const handlePointerUp = (e) => {
        isDraggingRef.current = false;
        setIsDraggingState(false);
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);

        // Check distance to distinguish click from drag
        const distance = Math.hypot(e.clientX - clickStartPos.current.x, e.clientY - clickStartPos.current.y);
        if (distance < 5) {
            handleClick();
        }
    };

    // --- CLICK LOGIC ---
    const handleClick = () => {
        const nextClicks = clickCount + 1;
        setClickCount(nextClicks);

        if (nextClicks >= 5) {
            setIsEasterEgg(true);
            setTimeout(() => {
                setIsEasterEgg(false);
                setClickCount(0);
            }, 3000);
        }

        // Spin transition
        setIsSpinning(true);
        setTimeout(() => {
            openDrawer("chat");
            setTimeout(() => setIsSpinning(false), 300);
        }, 400); // Wait for spin to complete before opening drawer
    };

    // Current visual position (approach position overrides manual dragged position temporarily)
    const displayPos = approachPos || position;

    return (
        <div 
            className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-40 select-none origin-bottom-right"
            style={{
                // Base transform to place it in the bottom right corner (0,0 is its original fixed spot)
                transform: `translate(${displayPos.x}px, ${displayPos.y}px) scale(${isSpinning ? 0 : 1}) rotate(${isSpinning ? 720 : 0}deg)`,
                transition: isDraggingState ? 'none' : 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                touchAction: 'none' // Important for native dragging on touch devices
            }}
        >
            <div className={`relative group ${isDraggingState ? 'cursor-grabbing' : 'cursor-grab'}`}>
                {/* Ambient Background Glow */}
                <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-blue-500/15 blur-2xl transition-all duration-500 group-hover:bg-cyan-500/30 group-hover:scale-125" />

                {/* Idle Breathing Wrapper */}
                <div 
                    className="relative flex flex-col items-center"
                    style={{
                        animation: isDraggingState ? 'none' : 'botBreathe 4s ease-in-out infinite',
                    }}
                >
                    <button
                        ref={botRef}
                        type="button"
                        onPointerDown={handlePointerDown}
                        aria-label="Ask AI Assistant"
                        className="relative flex flex-col items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161922] rounded-[30px]"
                        style={{
                            transform: `perspective(400px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                            transition: "transform 0.1s ease-out",
                        }}
                    >
                        {/* 3D Layered SVG Mascot Graphic */}
                        <svg
                            width="120"
                            height="120"
                            viewBox="0 0 120 120"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="drop-shadow-2xl pointer-events-none"
                            style={{ filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.5))' }}
                        >
                            <defs>
                                <filter id="hologlow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="6" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                                <linearGradient id="visorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#083344" />
                                    <stop offset="100%" stopColor="#020617" />
                                </linearGradient>
                            </defs>

                            {/* Back layers (Depth) */}
                            <rect x="18" y="22" width="84" height="78" rx="20" fill="#0f172a" />
                            <rect x="14" y="18" width="92" height="84" rx="24" fill="#1e293b" />
                            
                            {/* Main Chassis */}
                            <rect x="10" y="12" width="100" height="90" rx="26" fill="#161922" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.4" />

                            {/* Hologram Side Panels */}
                            <path d="M 5 35 L 10 40 L 10 70 L 5 75 Z" fill="#0284c7" opacity="0.6" filter="url(#hologlow)" />
                            <path d="M 115 35 L 110 40 L 110 70 L 115 75 Z" fill="#0284c7" opacity="0.6" filter="url(#hologlow)" />

                            {/* Antenna */}
                            <path d="M 60 12 L 60 2" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
                            <circle cx="60" cy="2" r="3.5" className={isEasterEgg ? "fill-amber-400 animate-pulse" : "fill-cyan-400"} filter="url(#hologlow)" />

                            {/* Visor Screen Outer Bezel */}
                            <rect x="20" y="24" width="80" height="60" rx="16" fill="#000000" stroke="#0ea5e9" strokeWidth="1" strokeOpacity="0.5" />
                            
                            {/* Visor Screen Glass */}
                            <rect x="22" y="26" width="76" height="56" rx="14" fill="url(#visorGrad)" />

                            {/* Holographic Grid Pattern on Visor */}
                            <path d="M 22 36 L 98 36 M 22 46 L 98 46 M 22 56 L 98 56 M 22 66 L 98 66 M 22 76 L 98 76" stroke="#22d3ee" strokeWidth="0.5" opacity="0.1" />
                            <path d="M 35 26 L 35 82 M 48 26 L 48 82 M 60 26 L 60 82 M 72 26 L 72 82 M 85 26 L 85 82" stroke="#22d3ee" strokeWidth="0.5" opacity="0.1" />

                            {/* Blinking wrapper - applies scaleY for blinking */}
                            <g style={{ animation: 'botBlink 6s infinite' }}>
                                {/* Left Eye */}
                                <circle
                                    cx={42 + eyeOffset.x}
                                    cy={56 + eyeOffset.y}
                                    r={isEasterEgg ? "6" : isCurious ? "7.5" : "5.5"}
                                    className={`transition-all duration-150 ${
                                        isEasterEgg ? "fill-amber-400" : isCurious ? "fill-cyan-300" : "fill-cyan-400"
                                    }`}
                                    filter="url(#hologlow)"
                                />
                                
                                {/* Right Eye */}
                                <circle
                                    cx={78 + eyeOffset.x}
                                    cy={56 + eyeOffset.y}
                                    r={isEasterEgg ? "6" : isCurious ? "7.5" : "5.5"}
                                    className={`transition-all duration-150 ${
                                        isEasterEgg ? "fill-amber-400" : isCurious ? "fill-cyan-300" : "fill-cyan-400"
                                    }`}
                                    filter="url(#hologlow)"
                                />
                                
                                {/* Expression details (curious arches) */}
                                {isCurious && !isEasterEgg && (
                                    <>
                                        <path d={`M 35 ${44 + eyeOffset.y} Q ${42 + eyeOffset.x} ${38 + eyeOffset.y} 49 ${42 + eyeOffset.y}`} stroke="#67e8f9" strokeWidth="2.5" strokeLinecap="round" fill="none" className="transition-all duration-150" filter="url(#hologlow)"/>
                                        <path d={`M 71 ${42 + eyeOffset.y} Q ${78 + eyeOffset.x} ${38 + eyeOffset.y} 85 ${44 + eyeOffset.y}`} stroke="#67e8f9" strokeWidth="2.5" strokeLinecap="round" fill="none" className="transition-all duration-150" filter="url(#hologlow)"/>
                                    </>
                                )}
                            </g>
                            
                            {/* Mouth / Status Line */}
                            {isEasterEgg ? (
                                <path
                                    d="M 48 76 Q 60 68 72 76"
                                    stroke="#fbbf24"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    fill="none"
                                    filter="url(#hologlow)"
                                />
                            ) : (
                                <path
                                    d={isCurious ? "M 55 76 Q 60 80 65 76" : "M 52 72 Q 60 76 68 72"}
                                    className="stroke-cyan-400/50 group-hover:stroke-cyan-300 transition-all duration-300"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    fill="none"
                                    filter="url(#hologlow)"
                                />
                            )}
                        </svg>

                        {/* Subtitle Prompt Badge */}
                        <span className="absolute -bottom-8 whitespace-nowrap inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#161922]/80 px-3 py-1 text-[0.7rem] font-medium tracking-wide text-zinc-400 backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100 group-hover:border-cyan-400/40 group-hover:text-white">
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                            {isEasterEgg ? "Overclocked mode!" : isDraggingState ? "Dragging..." : "Click to converse"}
                        </span>
                    </button>
                </div>
            </div>
            
            <style>{`
                @keyframes botBreathe {
                    0%, 100% { transform: translateY(0px) scale(1); }
                    50% { transform: translateY(-6px) scale(1.02); }
                }
                @keyframes botBlink {
                    0%, 96%, 98%, 100% { transform: scaleY(1); transform-origin: center 56px; }
                    97% { transform: scaleY(0.1); transform-origin: center 56px; }
                }
            `}</style>
        </div>
    );
}
