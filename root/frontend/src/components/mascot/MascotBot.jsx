import { useRef } from "react";
import { useDrawer } from "../drawer";
import { useMascotEasterEgg } from "./hooks/useMascotEasterEgg";
import { useMascotMovement } from "./hooks/useMascotMovement";
import { MascotChassis } from "./components/MascotChassis";
import { MascotFace } from "./components/MascotFace";

export default function MascotBot() {
    const { openDrawer } = useDrawer();
    const botRef = useRef(null);

    // Easter egg logic
    const { isEasterEgg, handleEasterEggClick } = useMascotEasterEgg();

    // Action dispatcher from movement hook
    const handleMascotAction = (action) => {
        if (action.type === 'click') {
            handleEasterEggClick();
        } else if (action.type === 'openDrawer') {
            openDrawer("chat");
        }
    };

    // Movement, Dragging, Eye Tracking, and Pull Animation logic
    const {
        displayPos,
        isDraggingState,
        isPulling,
        eyeOffset,
        tilt,
        isCurious,
        handlePointerDown
    } = useMascotMovement(botRef, handleMascotAction);

    return (
        <div 
            className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-40 select-none origin-bottom-right"
            style={{
                transform: `translate(${displayPos.x}px, ${displayPos.y}px)`,
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
                            <MascotChassis isEasterEgg={isEasterEgg} />
                            <MascotFace 
                                eyeOffset={eyeOffset} 
                                isCurious={isCurious} 
                                isEasterEgg={isEasterEgg} 
                            />
                        </svg>

                        {/* Subtitle Prompt Badge */}
                        <span className="absolute -bottom-8 whitespace-nowrap inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#161922]/80 px-3 py-1 text-[0.7rem] font-medium tracking-wide text-zinc-400 backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100 group-hover:border-cyan-400/40 group-hover:text-white">
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                            {isEasterEgg ? "Overclocked mode!" : isDraggingState ? "Dragging..." : isPulling ? "Opening..." : "Click to converse"}
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
