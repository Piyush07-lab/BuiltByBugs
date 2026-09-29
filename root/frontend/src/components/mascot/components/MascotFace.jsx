export function MascotFace({ eyeOffset, isCurious, isEasterEgg }) {
  const leftEyeCx = 48 + eyeOffset.x;
  const leftEyeCy = 29.5 + eyeOffset.y;
  const rightEyeCx = 72 + eyeOffset.x;
  const rightEyeCy = 29.5 + eyeOffset.y;

  const eyeFill = isEasterEgg
    ? 'url(#eyeLedAmber)'
    : isCurious
      ? '#06b6d4'
      : 'url(#eyeLedCyan)';

  return (
    <>
      {/* Blinking wrapper - applies scaleY for blinking centered on eye level */}
      <g style={{ animation: 'botBlink 6s infinite' }}>
        {/* Left Eye (Smiling Dome / Crescent) */}
        {isCurious ? (
          <ellipse
            cx={leftEyeCx}
            cy={leftEyeCy}
            rx="4.8"
            ry="5.4"
            fill={eyeFill}
            filter="url(#hologlow)"
            className="transition-all duration-150"
          />
        ) : (
          <path
            d={`M ${leftEyeCx - 4.8} ${leftEyeCy + 2.5} C ${leftEyeCx - 4.8} ${leftEyeCy - 2.8}, ${leftEyeCx + 4.8} ${leftEyeCy - 2.8}, ${leftEyeCx + 4.8} ${leftEyeCy + 2.5} Z`}
            fill={eyeFill}
            filter="url(#hologlow)"
            className="transition-all duration-150"
          />
        )}

        {/* Right Eye (Smiling Dome / Crescent) */}
        {isCurious ? (
          <ellipse
            cx={rightEyeCx}
            cy={rightEyeCy}
            rx="4.8"
            ry="5.4"
            fill={eyeFill}
            filter="url(#hologlow)"
            className="transition-all duration-150"
          />
        ) : (
          <path
            d={`M ${rightEyeCx - 4.8} ${rightEyeCy + 2.5} C ${rightEyeCx - 4.8} ${rightEyeCy - 2.8}, ${rightEyeCx + 4.8} ${rightEyeCy - 2.8}, ${rightEyeCx + 4.8} ${rightEyeCy + 2.5} Z`}
            fill={eyeFill}
            filter="url(#hologlow)"
            className="transition-all duration-150"
          />
        )}

        {/* Expression details (curious arches) */}
        {isCurious && !isEasterEgg && (
          <>
            <path
              d={`M 43 ${23 + eyeOffset.y} Q ${48 + eyeOffset.x} ${20 + eyeOffset.y} 53 ${22 + eyeOffset.y}`}
              stroke="#06b6d4"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-150"
              filter="url(#hologlow)"
            />
            <path
              d={`M 67 ${22 + eyeOffset.y} Q ${72 + eyeOffset.x} ${20 + eyeOffset.y} 77 ${23 + eyeOffset.y}`}
              stroke="#06b6d4"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-150"
              filter="url(#hologlow)"
            />
          </>
        )}
      </g>

      {/* Mouth / Smile */}
      {isEasterEgg ? (
        <path
          d="M 55 35.5 C 55 40.5, 65 40.5, 65 35.5 Z"
          fill="#fbbf24"
          filter="url(#hologlow)"
          className="transition-all duration-300"
        />
      ) : isCurious ? (
        <ellipse
          cx="60"
          cy="37.5"
          rx="2.6"
          ry="3.2"
          fill="#06b6d4"
          filter="url(#hologlow)"
          className="transition-all duration-300"
        />
      ) : (
        <path
          d="M 57 36 C 57 39.5, 63 39.5, 63 36 Z"
          fill="#06b6d4"
          filter="url(#hologlow)"
          className="transition-all duration-300 group-hover:fill-cyan-300"
        />
      )}
    </>
  );
}
