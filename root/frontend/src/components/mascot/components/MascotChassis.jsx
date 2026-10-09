import { ARM_CONFIGS } from '../utils/armKinematics';

export function MascotChassis({
  isEasterEgg,
  armStates = { left: 1, right: 1 },
  leftArmTransform,
  rightArmTransform,
}) {
  const lTrans =
    leftArmTransform || ARM_CONFIGS[armStates.left]?.left || ARM_CONFIGS[1].left;
  const rTrans =
    rightArmTransform || ARM_CONFIGS[armStates.right]?.right || ARM_CONFIGS[1].right;

  return (
    <>
      <defs>
        {/* Soft glowing filter for LED screen features */}
        <filter id="hologlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Ambient Hover Ground Shadow */}
        <radialGradient id="shadowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#64748b" stopOpacity="0.4" />
          <stop offset="55%" stopColor="#94a3b8" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#94a3b8" stopOpacity="0" />
        </radialGradient>

        {/* Main Head Shell Gradient (light from top-left) */}
        <linearGradient id="headShellGrad" x1="25%" y1="0%" x2="75%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#f8fafc" />
          <stop offset="75%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>

        {/* Head Shell Top Highlight Sheen */}
        <linearGradient id="headHighlightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Ear Pods Left Gradient */}
        <linearGradient id="earPodGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>

        {/* Ear Pods Right Gradient */}
        <linearGradient id="earPodGradRight" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>

        {/* Top Cap / Antenna Nodule */}
        <linearGradient id="topCapGrad" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>

        {/* Neck Cylinder Gradient */}
        <linearGradient id="neckGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="50%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>

        {/* Torso Body Main Gradient */}
        <linearGradient id="torsoGrad" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#f8fafc" />
          <stop offset="70%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>

        {/* Lower Torso Abdomen Gradient (Modular Belly below seam) */}
        <linearGradient id="lowerTorsoGrad" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>

        {/* Left Arm Gradient */}
        <linearGradient id="leftArmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>

        {/* Right Arm Gradient */}
        <linearGradient id="rightArmGrad" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>

        {/* Visor Screen Glass Gradient */}
        <linearGradient id="visorGlassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="25%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#090d16" />
        </linearGradient>

        {/* Eye LED Glow Gradients */}
        <radialGradient id="eyeLedCyan" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a5f3fc" />
          <stop offset="40%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0891b2" />
        </radialGradient>
        <radialGradient id="eyeLedAmber" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>
      </defs>

      {/* 1. Ground Hover Shadow */}
      <ellipse cx="60" cy="111" rx="14" ry="2.2" fill="url(#shadowGrad)" />

      {/* 2. Floating Arms with 3D Joint Kinematics around Shoulder O */}
      {/* Left Arm (Joint origin O at 31, 60) */}
      <g
        style={{
          transformOrigin: '31px 60px',
          transform: `rotateZ(${lTrans.rotZ}deg) rotateX(${lTrans.rotX}deg) rotateY(${lTrans.rotY}deg)`,
          transition: 'transform 0.14s cubic-bezier(0.2, 0.8, 0.4, 1)',
          transformStyle: 'preserve-3d',
        }}
      >
        <path
          d="M 33 58 C 29 58, 25 61, 24 66 C 22 73, 22 80, 25 86 C 26 89, 30 90, 32 87 C 35 82, 37 75, 37 68 C 37 63, 36 58, 33 58 Z"
          fill="url(#leftArmGrad)"
          stroke="#cbd5e1"
          strokeWidth="0.8"
        />
      </g>

      {/* Right Arm (Joint origin O at 89, 60) */}
      <g
        style={{
          transformOrigin: '89px 60px',
          transform: `rotateZ(${rTrans.rotZ}deg) rotateX(${rTrans.rotX}deg) rotateY(${rTrans.rotY}deg)`,
          transition: 'transform 0.14s cubic-bezier(0.2, 0.8, 0.4, 1)',
          transformStyle: 'preserve-3d',
        }}
      >
        <path
          d="M 87 58 C 91 58, 95 61, 96 66 C 98 73, 98 80, 95 86 C 94 89, 90 90, 88 87 C 85 82, 83 75, 83 68 C 83 63, 84 58, 87 58 Z"
          fill="url(#rightArmGrad)"
          stroke="#cbd5e1"
          strokeWidth="0.8"
        />
      </g>

      {/* 3. Arm Contact Ambient Shadows on Torso Flanks (fades as arm raises) */}
      <ellipse
        cx="37"
        cy="74"
        rx="3.5"
        ry="11"
        fill="#0f172a"
        opacity={armStates.left === 1 ? 0.08 : 0}
        style={{ transition: 'opacity 0.15s ease' }}
      />
      <ellipse
        cx="83"
        cy="74"
        rx="3.5"
        ry="11"
        fill="#0f172a"
        opacity={armStates.right === 1 ? 0.08 : 0}
        style={{ transition: 'opacity 0.15s ease' }}
      />

      {/* 4. Torso (Body Chassis) */}
      {/* Main Torso Egg Shell */}
      <path
        d="M 48 54 C 39 54, 34 62, 34 72 C 34 85, 45 99, 60 99 C 75 99, 86 85, 86 72 C 86 62, 81 54, 72 54 Z"
        fill="url(#torsoGrad)"
        stroke="#cbd5e1"
        strokeWidth="1.2"
      />

      {/* Lower Torso Belly Panel */}
      <path
        d="M 34.5 76 C 39.5 78, 44 79, 48 79 L 48 85 L 72 85 L 72 79 C 76 79, 80.5 78, 85.5 76 C 86 85, 75 99, 60 99 C 45 99, 34 85, 34.5 76 Z"
        fill="url(#lowerTorsoGrad)"
      />

      {/* Panel Seam Line (Groove across lower body) */}
      <path
        d="M 34.5 76 C 39.5 78, 44 79, 48 79 L 48 85 L 72 85 L 72 79 C 76 79, 80.5 78, 85.5 76"
        fill="none"
        stroke={isEasterEgg ? '#f59e0b' : '#94a3b8'}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={isEasterEgg ? 'transition-colors duration-300' : ''}
      />
      {/* 3D Panel Seam Light Bevel */}
      <path
        d="M 34.5 77.2 C 39.5 79.2, 44 80.2, 47.5 80.2 L 47.5 86.2 L 72.5 86.2 L 72.5 80.2 C 76 80.2, 80.5 79.2, 85.5 77.2"
        fill="none"
        stroke="#ffffff"
        strokeWidth="0.7"
        strokeOpacity="0.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Glossy Curved Chest Highlight (Upper-Left Shoulder) */}
      <path
        d="M 42 61 C 39.5 66, 40 71.5, 42 75 C 43.5 76, 45.5 75, 45 73.5 C 43.5 70, 43 65.5, 45.5 62 C 46 60.5, 43.5 59.5, 42 61 Z"
        fill="#ffffff"
        opacity="0.85"
      />

      {/* 5. Neck Joint Collar */}
      <rect x="49" y="50" width="22" height="8" rx="4" fill="url(#neckGrad)" />
      <ellipse cx="60" cy="51" rx="14" ry="2" fill="#0f172a" opacity="0.3" />

      {/* 6. Ear Pods (Side Capsules) */}
      {/* Left Ear */}
      <rect
        x="23"
        y="24"
        width="8"
        height="17"
        rx="4"
        fill="url(#earPodGradLeft)"
        stroke="#cbd5e1"
        strokeWidth="0.8"
      />
      <path d="M 29 25 L 29 40" stroke="#94a3b8" strokeWidth="1" opacity="0.4" />

      {/* Right Ear */}
      <rect
        x="89"
        y="24"
        width="8"
        height="17"
        rx="4"
        fill="url(#earPodGradRight)"
        stroke="#cbd5e1"
        strokeWidth="0.8"
      />
      <path d="M 91 25 L 91 40" stroke="#94a3b8" strokeWidth="1" opacity="0.4" />

      {/* 7. Top Cap / Antenna Nodule */}
      <rect
        x="50"
        y="8"
        width="20"
        height="7"
        rx="3.5"
        fill="url(#topCapGrad)"
        stroke="#cbd5e1"
        strokeWidth="0.8"
      />
      {isEasterEgg && (
        <ellipse
          cx="60"
          cy="8.5"
          rx="5"
          ry="2.5"
          className="fill-amber-400 animate-pulse"
          filter="url(#hologlow)"
        />
      )}

      {/* 8. Head Outer Shell */}
      <rect
        x="27"
        y="12"
        width="66"
        height="39"
        rx="19.5"
        fill="url(#headShellGrad)"
        stroke="#cbd5e1"
        strokeWidth="1.2"
      />

      {/* Head Top Specular Highlight */}
      <path
        d="M 37 15 C 45 13.5, 75 13.5, 83 15 C 80 14, 60 13.5, 37 15 Z"
        fill="#ffffff"
        opacity="0.9"
      />

      {/* 9. Visor Outer Recess Bezel */}
      <rect
        x="33"
        y="17.5"
        width="54"
        height="28"
        rx="13"
        fill="#0f172a"
        stroke="#334155"
        strokeWidth="0.8"
      />

      {/* 10. Visor Screen Glass */}
      <rect
        x="34.5"
        y="19"
        width="51"
        height="25"
        rx="11.5"
        fill="url(#visorGlassGrad)"
      />

      {/* Glass Top Sheen Reflection */}
      <path
        d="M 38 21 Q 60 25 82 21"
        stroke="#ffffff"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.12"
        fill="none"
      />

      {/* Easter Egg Visor Grid Overlay */}
      {isEasterEgg && (
        <g stroke="#f59e0b" strokeWidth="0.5" opacity="0.15">
          <path d="M 35 25 L 85 25 M 35 31 L 85 31 M 35 37 L 85 37" />
          <path d="M 44 19 L 44 44 M 52 19 L 52 44 M 60 19 L 60 44 M 68 19 L 68 44 M 76 19 L 76 44" />
        </g>
      )}
    </>
  );
}
