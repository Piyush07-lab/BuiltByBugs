export function MascotChassis({ isEasterEgg }) {
    return (
        <>
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
            <circle 
                cx="60" cy="2" r="3.5" 
                className={isEasterEgg ? "fill-amber-400 animate-pulse" : "fill-cyan-400"} 
                filter="url(#hologlow)" 
            />

            {/* Visor Screen Outer Bezel */}
            <rect x="20" y="24" width="80" height="60" rx="16" fill="#000000" stroke="#0ea5e9" strokeWidth="1" strokeOpacity="0.5" />
            
            {/* Visor Screen Glass */}
            <rect x="22" y="26" width="76" height="56" rx="14" fill="url(#visorGrad)" />

            {/* Holographic Grid Pattern on Visor */}
            <path d="M 22 36 L 98 36 M 22 46 L 98 46 M 22 56 L 98 56 M 22 66 L 98 66 M 22 76 L 98 76" stroke="#22d3ee" strokeWidth="0.5" opacity="0.1" />
            <path d="M 35 26 L 35 82 M 48 26 L 48 82 M 60 26 L 60 82 M 72 26 L 72 82 M 85 26 L 85 82" stroke="#22d3ee" strokeWidth="0.5" opacity="0.1" />
        </>
    );
}
