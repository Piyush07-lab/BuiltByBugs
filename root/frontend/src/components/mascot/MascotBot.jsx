import { useState, useEffect, useRef } from "react";
import { useDrawer } from "../drawer";

export default function MascotBot() {
    const { openDrawer } = useDrawer();
    const botRef = useRef(null);
    const animationFrameRef = useRef(null);

    // Eye pupil offset state (range -6 to 6)
    const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [clickCount, setClickCount] = useState(0);
    const [isEasterEgg, setIsEasterEgg] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            animationFrameRef.current = requestAnimationFrame(() => {
                if (!botRef.current) return;
                const rect = botRef.current.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                // Angle & distance vector
                const deltaX = e.clientX - centerX;
                const deltaY = e.clientY - centerY;
                const distance = Math.hypot(deltaX, deltaY);

                // Limit eye travel distance to 6px maximum
                const maxEyeRadius = 6;
                const eyeX = (deltaX / (distance || 1)) * Math.min(Math.abs(deltaX) * 0.05, maxEyeRadius);
                const eyeY = (deltaY / (distance || 1)) * Math.min(Math.abs(deltaY) * 0.05, maxEyeRadius);

                // Clamped subtle head tilt (max 8 degrees)
                const tiltX = Math.max(-8, Math.min(8, -deltaY * 0.02));
                const tiltY = Math.max(-8, Math.min(8, deltaX * 0.02));

                setEyeOffset({ x: eyeX, y: eyeY });
                setTilt({ x: tiltX, y: tiltY });
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    const handleClick = () => {
        const nextClicks = clickCount + 1;
        setClickCount(nextClicks);

        // Easter egg triggered at 5 rapid clicks
        if (nextClicks >= 5) {
            setIsEasterEgg(true);
            setTimeout(() => {
                setIsEasterEgg(false);
                setClickCount(0);
            }, 3000);
        }

        // Trigger chat drawer
        openDrawer("chat");
    };

    return (
        <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-40 select-none scale-75 sm:scale-90 md:scale-100 origin-bottom-right">
            <div className="relative group">
                {/* Ambient Background Glow */}
                <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-accent/15 blur-2xl transition-all duration-500 group-hover:bg-accent/30 group-hover:scale-125" />

                {/* Interactive Bot Trigger */}
                <button
                    ref={botRef}
                    type="button"
                    onClick={handleClick}
                    aria-label="Ask AI Assistant"
                    className="relative flex flex-col items-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-2xl"
                    style={{
                        transform: `perspective(400px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                        transition: "transform 0.1s ease-out",
                    }}
                >
                    {/* SVG Mascot Graphic */}
                    <svg
                        width="140"
                        height="140"
                        viewBox="0 0 140 140"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        className="drop-shadow-xl"
                    >
                        {/* Head Outer Shell */}
                        <rect
                            x="20"
                            y="20"
                            width="100"
                            height="90"
                            rx="28"
                            className="fill-[#161922] stroke-white/10 stroke-2 transition-colors duration-300 group-hover:stroke-accent/40"
                        />

                        {/* Visor Screen */}
                        <rect
                            x="32"
                            y="35"
                            width="76"
                            height="55"
                            rx="16"
                            className="fill-[#0b0c10] stroke-black/50 stroke-1"
                        />

                        {/* Antenna */}
                        <path
                            d="M70 20V8"
                            stroke="#9eaedb"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        />
                        <circle
                            cx="70"
                            cy="7"
                            r="3.5"
                            className={`transition-colors duration-300 ${
                                isEasterEgg ? "fill-amber-400 animate-pulse" : "fill-accent"
                            }`}
                        />

                        {/* Left Eye Socket */}
                        <circle cx="54" cy="62" r="11" fill="#141824" />
                        {/* Left Eye Pupil */}
                        <circle
                            cx={54 + eyeOffset.x}
                            cy={62 + eyeOffset.y}
                            r={isEasterEgg ? "7" : "5.5"}
                            className={`transition-all duration-75 ${
                                isEasterEgg ? "fill-amber-400" : "fill-accent"
                            }`}
                        />

                        {/* Right Eye Socket */}
                        <circle cx="86" cy="62" r="11" fill="#141824" />
                        {/* Right Eye Pupil */}
                        <circle
                            cx={86 + eyeOffset.x}
                            cy={62 + eyeOffset.y}
                            r={isEasterEgg ? "7" : "5.5"}
                            className={`transition-all duration-75 ${
                                isEasterEgg ? "fill-amber-400" : "fill-accent"
                            }`}
                        />

                        {/* Mouth / Status Line */}
                        {isEasterEgg ? (
                            <path
                                d="M60 78 Q70 70 80 78"
                                stroke="#fbbf24"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                fill="none"
                            />
                        ) : (
                            <path
                                d="M62 76 Q70 80 78 76"
                                className="stroke-white/30 group-hover:stroke-accent transition-colors duration-300"
                                strokeWidth="2"
                                strokeLinecap="round"
                                fill="none"
                            />
                        )}
                    </svg>

                    {/* Subtitle Prompt Badge */}
                    <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#161922]/80 px-3 py-1 text-[0.7rem] font-medium tracking-wide text-zinc-400 backdrop-blur-sm transition-colors group-hover:border-accent/40 group-hover:text-white">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
                        {isEasterEgg ? "Overclocked mode!" : "Click to converse"}
                    </span>
                </button>
            </div>
        </div>
    );
}
