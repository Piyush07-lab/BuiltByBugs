export function MascotFace({ eyeOffset, isCurious, isEasterEgg }) {
    const eyeRadius = isEasterEgg ? "6" : isCurious ? "7.5" : "5.5";
    const eyeClass = `transition-all duration-150 ${
        isEasterEgg ? "fill-amber-400" : isCurious ? "fill-cyan-300" : "fill-cyan-400"
    }`;

    return (
        <>
            {/* Blinking wrapper - applies scaleY for blinking */}
            <g style={{ animation: 'botBlink 6s infinite' }}>
                {/* Left Eye */}
                <circle
                    cx={42 + eyeOffset.x}
                    cy={56 + eyeOffset.y}
                    r={eyeRadius}
                    className={eyeClass}
                    filter="url(#hologlow)"
                />
                
                {/* Right Eye */}
                <circle
                    cx={78 + eyeOffset.x}
                    cy={56 + eyeOffset.y}
                    r={eyeRadius}
                    className={eyeClass}
                    filter="url(#hologlow)"
                />
                
                {/* Expression details (curious arches) */}
                {isCurious && !isEasterEgg && (
                    <>
                        <path 
                            d={`M 35 ${44 + eyeOffset.y} Q ${42 + eyeOffset.x} ${38 + eyeOffset.y} 49 ${42 + eyeOffset.y}`} 
                            stroke="#67e8f9" strokeWidth="2.5" strokeLinecap="round" fill="none" 
                            className="transition-all duration-150" filter="url(#hologlow)"
                        />
                        <path 
                            d={`M 71 ${42 + eyeOffset.y} Q ${78 + eyeOffset.x} ${38 + eyeOffset.y} 85 ${44 + eyeOffset.y}`} 
                            stroke="#67e8f9" strokeWidth="2.5" strokeLinecap="round" fill="none" 
                            className="transition-all duration-150" filter="url(#hologlow)"
                        />
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
        </>
    );
}
