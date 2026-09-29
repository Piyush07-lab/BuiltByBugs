import './vectorBackground.css';

/**
 * Normalizes pathname to identify the current page category
 * @param {string} pathname
 * @returns {'home' | 'library' | 'project'}
 */
function getPageCategory(pathname) {
  if (pathname === '/library') return 'library';
  if (pathname === '/project') return 'project';
  return 'home';
}

function HomeVectorGraphic() {
  return (
    <svg
      className="vector-svg-root"
      viewBox="0 0 1920 2800"
      preserveAspectRatio="xMidYMin slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <filter id="homeVBGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="homeHexGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.14" />
          <stop offset="60%" stopColor="#3B82F6" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.02" />
        </linearGradient>

        <linearGradient id="homeHexGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.03" />
        </linearGradient>

        <linearGradient id="homeDiamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.06" />
        </linearGradient>
      </defs>

      {/* Ambient Depth Nebulae Spanning Full Scroll Length */}
      <g opacity="0.55">
        <circle
          cx="1500"
          cy="300"
          r="340"
          fill="url(#homeHexGrad1)"
          filter="url(#homeVBGlow)"
        />
        <circle
          cx="300"
          cy="1200"
          r="300"
          fill="url(#homeDiamondGrad)"
          filter="url(#homeVBGlow)"
        />
        <circle
          cx="1600"
          cy="2100"
          r="320"
          fill="url(#homeHexGrad1)"
          filter="url(#homeVBGlow)"
        />
      </g>

      {/* Full-Page Continuous Circuit Pathways and Orthogonal Buses */}
      <g stroke="#06B6D4" strokeOpacity="0.24" strokeWidth="1.2">
        {/* Upper Hero Section */}
        <path d="M 0,220 L 320,540 L 580,540 L 720,680 L 860,680" />
        <path
          d="M 60,160 L 360,460 L 520,460 L 620,560 L 620,720"
          strokeDasharray="6 4"
          strokeOpacity="0.3"
        />
        <path d="M 1300,0 L 1480,180 L 1480,340 L 1620,480 L 1920,480" />
        <path
          d="M 1120,80 L 1260,220 L 1260,420 L 1420,580 L 1580,580"
          strokeOpacity="0.2"
        />
        <circle
          cx="860"
          cy="680"
          r="12"
          fill="none"
          stroke="#06B6D4"
          strokeOpacity="0.35"
          strokeDasharray="3 3"
        />

        {/* Mid Section Trunks (Connecting Story Sections) */}
        <path d="M 860,680 L 860,940 L 680,1120 L 420,1120 L 320,1220" />
        <path
          d="M 1580,580 L 1580,840 L 1720,980 L 1720,1280 L 1560,1440"
          strokeDasharray="8 4"
          strokeOpacity="0.25"
        />
        <path d="M 0,1320 L 220,1540 L 540,1540 L 680,1680 L 980,1680" />

        {/* Lower Section Trunks (Tech Stack & Footer) */}
        <path d="M 980,1680 L 1240,1940 L 1540,1940 L 1680,2080 L 1680,2400" />
        <path
          d="M 320,1220 L 320,1840 L 180,1980 L 180,2450"
          strokeDasharray="6 4"
          strokeOpacity="0.2"
        />
        <path d="M 180,2450 L 380,2650 L 860,2650" />
      </g>

      {/* MOTION 1: Upper-Right Isometric Hexagon Matrix (Hero Section) */}
      <g className="anim-home-hex-main">
        <g transform="translate(1180, 50)">
          <polygon
            points="260,30 364,90 364,210 260,270 156,210 156,90"
            fill="url(#homeHexGrad1)"
            stroke="#06B6D4"
            strokeOpacity="0.38"
            strokeWidth="1.5"
          />
          <polygon
            points="468,150 572,210 572,330 468,390 364,330 364,210"
            fill="url(#homeHexGrad2)"
            stroke="#3B82F6"
            strokeOpacity="0.32"
            strokeWidth="1.5"
          />
          <polygon
            points="260,270 364,330 364,450 260,510 156,450 156,330"
            fill="none"
            stroke="#06B6D4"
            strokeOpacity="0.25"
            strokeWidth="1.2"
            strokeDasharray="6 3"
          />
          <polygon
            points="52,150 156,210 156,330 52,390 -52,330 -52,210"
            fill="url(#homeHexGrad1)"
            stroke="#8B5CF6"
            strokeOpacity="0.22"
            strokeWidth="1.2"
          />
          <polygon
            points="468,390 572,450 572,570 468,630 364,570 364,450"
            fill="url(#homeHexGrad1)"
            stroke="#06B6D4"
            strokeOpacity="0.32"
            strokeWidth="1.5"
          />
          <path
            d="M 260,30 L 260,150 L 364,210 M 260,150 L 156,210"
            stroke="#06B6D4"
            strokeOpacity="0.28"
            strokeWidth="1.2"
            fill="none"
          />
          <path
            d="M 468,150 L 468,270 L 572,330 M 468,270 L 364,330"
            stroke="#3B82F6"
            strokeOpacity="0.28"
            strokeWidth="1.2"
            fill="none"
          />
        </g>
      </g>

      {/* MOTION 1b: Lower-Left Hex Matrix (Content & Footer Section) */}
      <g className="anim-home-hex-sub">
        <g transform="translate(80, 2100)">
          <polygon
            points="180,20 252,62 252,145 180,187 108,145 108,62"
            fill="url(#homeHexGrad1)"
            stroke="#06B6D4"
            strokeOpacity="0.28"
            strokeWidth="1.2"
          />
          <polygon
            points="324,103 396,145 396,228 324,270 252,228 252,145"
            fill="none"
            stroke="#3B82F6"
            strokeOpacity="0.22"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <polygon
            points="180,187 252,228 252,311 180,353 108,311 108,228"
            fill="url(#homeHexGrad2)"
            stroke="#8B5CF6"
            strokeOpacity="0.22"
            strokeWidth="1.2"
          />
        </g>
      </g>

      {/* MOTION 2: Floating Rounded Diamonds (Upper Hero Group) */}
      <g className="anim-home-diamond-group">
        <g transform="translate(1540, 260) rotate(45)">
          <rect
            x="-80"
            y="-80"
            width="160"
            height="160"
            rx="20"
            fill="url(#homeDiamondGrad)"
            stroke="#06B6D4"
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />
          <rect
            x="-60"
            y="-60"
            width="120"
            height="120"
            rx="14"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="1"
            strokeOpacity="0.25"
            strokeDasharray="6 4"
          />
        </g>
        <g transform="translate(1720, 480) rotate(45)">
          <rect
            x="-42"
            y="-42"
            width="84"
            height="84"
            rx="12"
            fill="none"
            stroke="#06B6D4"
            strokeWidth="1.8"
            strokeOpacity="0.45"
          />
          <rect
            x="-24"
            y="-24"
            width="48"
            height="48"
            rx="8"
            fill="url(#homeDiamondGrad)"
            stroke="#8B5CF6"
            strokeWidth="1"
            strokeOpacity="0.3"
          />
        </g>
        <g transform="translate(1020, 780) rotate(45)">
          <rect
            x="-55"
            y="-55"
            width="110"
            height="110"
            rx="16"
            fill="url(#homeDiamondGrad)"
            stroke="#8B5CF6"
            strokeWidth="1.2"
            strokeOpacity="0.3"
          />
        </g>
      </g>

      {/* MOTION 2b: Floating Rounded Diamonds (Mid-to-Lower Scroll Group) */}
      <g className="anim-home-diamond-sub">
        <g transform="translate(320, 1400) rotate(45)">
          <rect
            x="-45"
            y="-45"
            width="90"
            height="90"
            rx="14"
            fill="none"
            stroke="#06B6D4"
            strokeWidth="1.4"
            strokeOpacity="0.35"
          />
          <rect
            x="-25"
            y="-25"
            width="50"
            height="50"
            rx="8"
            fill="url(#homeDiamondGrad)"
            stroke="#8B5CF6"
            strokeWidth="1"
            strokeOpacity="0.25"
          />
        </g>
        <g transform="translate(1620, 1600) rotate(45)">
          <rect
            x="-50"
            y="-50"
            width="100"
            height="100"
            rx="16"
            fill="url(#homeDiamondGrad)"
            stroke="#3B82F6"
            strokeWidth="1.2"
            strokeOpacity="0.3"
          />
        </g>
      </g>

      {/* MOTION 3: Pulsating Cyber Node Terminals Distributed Across Scroll Depth */}
      <g className="anim-home-nodes-pulse" filter="url(#homeVBGlow)">
        {/* Upper Nodes */}
        <circle cx="1440" cy="80" r="3.5" fill="#06B6D4" />
        <circle cx="1544" cy="140" r="3" fill="#3B82F6" />
        <circle cx="1544" cy="260" r="4.5" fill="#10B981" />
        <circle cx="1648" cy="200" r="3.5" fill="#06B6D4" />
        <circle cx="1752" cy="260" r="4" fill="#06B6D4" />
        <circle cx="320" cy="540" r="3.5" fill="#06B6D4" />
        <circle cx="580" cy="540" r="3.5" fill="#10B981" />
        <circle cx="860" cy="680" r="4" fill="#F97316" />
        {/* Mid Nodes */}
        <circle cx="680" cy="1120" r="3.5" fill="#06B6D4" />
        <circle cx="1720" cy="1280" r="4" fill="#10B981" />
        <circle cx="540" cy="1540" r="3.5" fill="#3B82F6" />
        <circle cx="980" cy="1680" r="4" fill="#F97316" />
        {/* Lower Nodes */}
        <circle cx="1540" cy="1940" r="3.5" fill="#06B6D4" />
        <circle cx="1680" cy="2080" r="4" fill="#10B981" />
        <circle cx="380" cy="2650" r="3.5" fill="#06B6D4" />
      </g>
    </svg>
  );
}

function LibraryVectorGraphic() {
  return (
    <svg
      className="vector-svg-root"
      viewBox="0 0 1920 2800"
      preserveAspectRatio="xMidYMin slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <filter id="libVBDropShadow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow
            dx="-6"
            dy="14"
            stdDeviation="16"
            floodColor="#000000"
            floodOpacity="0.6"
          />
        </filter>

        <linearGradient id="libGoldBevel1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        <linearGradient id="libGoldBevel2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="60%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>

        <linearGradient id="libPlaneViolet" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1f1138" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#0c0718" stopOpacity="0.9" />
        </linearGradient>

        <linearGradient id="libPlaneEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#05282c" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#090714" stopOpacity="0.85" />
        </linearGradient>

        <linearGradient id="libFolioBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Ambient Library Backlight Accents */}
      <g opacity="0.4">
        <circle cx="350" cy="400" r="380" fill="#1e102f" fillOpacity="0.3" />
        <circle cx="1500" cy="1100" r="320" fill="#0c202a" fillOpacity="0.25" />
        <circle cx="400" cy="2200" r="350" fill="#1e102f" fillOpacity="0.25" />
      </g>

      {/* MOTION 1: Dimensional Slicing Origami Planes & Radiant Gold Bevels */}
      <g className="anim-lib-origami-plane">
        <g filter="url(#libVBDropShadow)">
          <polygon points="0,0 720,0 240,1180 0,1180" fill="url(#libPlaneViolet)" />
          <line
            className="anim-lib-gold-bevel"
            x1="720"
            y1="0"
            x2="240"
            y2="1180"
            stroke="url(#libGoldBevel1)"
            strokeWidth="2.2"
          />
        </g>

        <g filter="url(#libVBDropShadow)">
          <polygon points="180,0 960,0 480,940 240,1180" fill="url(#libPlaneEmerald)" />
          <line
            className="anim-lib-gold-bevel"
            x1="960"
            y1="0"
            x2="480"
            y2="940"
            stroke="url(#libGoldBevel2)"
            strokeWidth="2.5"
          />
          <line
            x1="480"
            y1="940"
            x2="240"
            y2="1180"
            stroke="url(#libGoldBevel1)"
            strokeWidth="1.8"
            strokeOpacity="0.7"
          />
        </g>

        {/* Mid Section Facet Slice Continuing Down the Page */}
        <g filter="url(#libVBDropShadow)">
          <polygon
            points="240,1180 620,1640 420,2200 0,2200 0,1180"
            fill="url(#libPlaneViolet)"
          />
          <line
            className="anim-lib-gold-bevel"
            x1="240"
            y1="1180"
            x2="620"
            y2="1640"
            stroke="url(#libGoldBevel1)"
            strokeWidth="2"
          />
          <line
            className="anim-lib-gold-bevel"
            x1="620"
            y1="1640"
            x2="420"
            y2="2200"
            stroke="url(#libGoldBevel2)"
            strokeWidth="2.2"
          />
        </g>
      </g>

      {/* MOTION 1b: Secondary Origami Facet Along Right Margin */}
      <g className="anim-lib-origami-sub">
        <g filter="url(#libVBDropShadow)" opacity="0.65">
          <polygon points="1520,0 1920,0 1920,880 1340,420" fill="url(#libPlaneViolet)" />
          <line
            className="anim-lib-gold-bevel"
            x1="1520"
            y1="0"
            x2="1340"
            y2="420"
            stroke="url(#libGoldBevel2)"
            strokeWidth="1.8"
          />
        </g>
        <g filter="url(#libVBDropShadow)" opacity="0.55">
          <polygon
            points="1600,1400 1920,1200 1920,2000 1440,1800"
            fill="url(#libPlaneEmerald)"
          />
          <line
            className="anim-lib-gold-bevel"
            x1="1600"
            y1="1400"
            x2="1440"
            y2="1800"
            stroke="url(#libGoldBevel1)"
            strokeWidth="1.8"
          />
        </g>
      </g>

      {/* MOTION 2: Interlocking Architectural Ribbons (Mid & Lower Page) */}
      <g className="anim-lib-ribbon-sway">
        <g transform="translate(1260, 1150)" filter="url(#libVBDropShadow)">
          <path
            d="M 120,40 L 440,360 L 360,440 L 40,120 Z"
            fill="#141026"
            fillOpacity="0.65"
            stroke="#8B5CF6"
            strokeOpacity="0.25"
            strokeWidth="1.2"
          />
          <path
            d="M 280,100 L 600,420 L 520,500 L 200,180 Z"
            fill="#E2E8F0"
            fillOpacity="0.08"
            stroke="#E2E8F0"
            strokeOpacity="0.25"
            strokeWidth="1.5"
          />
          <path
            d="M 160,340 L 480,20 L 540,80 L 220,400 Z"
            fill="#1A1333"
            fillOpacity="0.5"
            stroke="#D4AF37"
            strokeOpacity="0.3"
            strokeWidth="1.2"
          />
        </g>
      </g>

      {/* MOTION 3: Floating Isometric Knowledge Folios Distributed Vertically */}
      <g className="anim-lib-folio-float">
        {/* Upper Folio 1 */}
        <g transform="translate(1420, 220) rotate(-15) skewX(20)">
          <rect
            x="0"
            y="0"
            width="180"
            height="240"
            rx="8"
            fill="#141026"
            fillOpacity="0.75"
            stroke="url(#libFolioBorder)"
            strokeWidth="1.5"
          />
          <line
            x1="24"
            y1="36"
            x2="100"
            y2="36"
            stroke="#8B5CF6"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.8"
          />
          <line
            x1="24"
            y1="56"
            x2="156"
            y2="56"
            stroke="#06B6D4"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.5"
          />
          <line
            x1="24"
            y1="72"
            x2="136"
            y2="72"
            stroke="#99A4BE"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.35"
          />
          <line
            x1="24"
            y1="120"
            x2="80"
            y2="120"
            stroke="#10B981"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.7"
          />
        </g>

        {/* Mid-Page Folio 2 */}
        <g transform="translate(1540, 1600) rotate(-8) skewX(15)" opacity="0.85">
          <rect
            x="0"
            y="0"
            width="140"
            height="190"
            rx="6"
            fill="#100C22"
            fillOpacity="0.65"
            stroke="#8B5CF6"
            strokeOpacity="0.4"
            strokeWidth="1.2"
          />
          <line
            x1="18"
            y1="28"
            x2="70"
            y2="28"
            stroke="#D4AF37"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.7"
          />
          <line
            x1="18"
            y1="44"
            x2="120"
            y2="44"
            stroke="#99A4BE"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.3"
          />
        </g>

        {/* Left Ambient Folio 3 */}
        <g transform="translate(220, 1850) rotate(12) skewX(-15)" opacity="0.6">
          <rect
            x="0"
            y="0"
            width="160"
            height="210"
            rx="8"
            fill="#160E2A"
            fillOpacity="0.5"
            stroke="#D4AF37"
            strokeOpacity="0.3"
            strokeWidth="1.2"
          />
          <line
            x1="20"
            y1="30"
            x2="80"
            y2="30"
            stroke="#06B6D4"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.5"
          />
          <line
            x1="20"
            y1="48"
            x2="140"
            y2="48"
            stroke="#99A4BE"
            strokeWidth="1.5"
            opacity="0.2"
          />
        </g>
      </g>
    </svg>
  );
}

function ProjectVectorGraphic() {
  return (
    <svg
      className="vector-svg-root"
      viewBox="0 0 1920 2800"
      preserveAspectRatio="xMidYMin slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <filter id="projVBPaperShadow" x="-10%" y="-10%" width="120%" height="150%">
          <feDropShadow
            dx="0"
            dy="-8"
            stdDeviation="14"
            floodColor="#000000"
            floodOpacity="0.55"
          />
        </filter>

        <filter id="projVBPlexusGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="projDeepBase" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#140D26" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#0A0614" stopOpacity="0.95" />
        </linearGradient>

        <linearGradient id="projMidBase" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#111B38" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#090E1F" stopOpacity="0.9" />
        </linearGradient>

        <linearGradient id="projMistBase" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.16" />
          <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.06" />
        </linearGradient>

        <linearGradient id="projCrestLineStroke" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.25" />
          <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.55" />
          <stop offset="80%" stopColor="#10B981" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {/* Ambient Background Nebulae */}
      <g opacity="0.5">
        <circle
          cx="1600"
          cy="250"
          r="320"
          fill="#082333"
          fillOpacity="0.4"
          filter="url(#projVBPlexusGlow)"
        />
        <circle
          cx="400"
          cy="1200"
          r="280"
          fill="#1b1030"
          fillOpacity="0.3"
          filter="url(#projVBPlexusGlow)"
        />
        <circle
          cx="1500"
          cy="2100"
          r="300"
          fill="#091829"
          fillOpacity="0.35"
          filter="url(#projVBPlexusGlow)"
        />
      </g>

      {/* Continuous Topographical Contour Elevation Lines */}
      <g fill="none" strokeOpacity="0.16" strokeWidth="1.2">
        <path
          d="M 0,560 C 410,660 750,460 1170,600 C 1510,710 1750,620 1920,580"
          stroke="#8B5CF6"
        />
        <path
          d="M 0,490 C 360,580 800,400 1240,530 C 1580,630 1790,540 1920,500"
          stroke="#06B6D4"
          strokeDasharray="8 6"
        />
        <path
          d="M 0,1350 C 420,1450 820,1280 1240,1380 C 1600,1460 1820,1380 1920,1340"
          stroke="#3B82F6"
        />
        <path
          d="M 0,1420 C 380,1520 780,1360 1180,1460 C 1540,1540 1780,1460 1920,1420"
          stroke="#10B981"
          strokeDasharray="6 6"
        />
      </g>

      {/* MOTION 1: Topographical Wave Strata (Positioned at Base of Page) */}
      <g className="anim-proj-strata-deep">
        <g filter="url(#projVBPaperShadow)">
          <path
            d="M 0,2280 C 380,2380 720,2180 1140,2320 C 1480,2430 1720,2340 1920,2300 L 1920,2800 L 0,2800 Z"
            fill="url(#projDeepBase)"
          />
        </g>
      </g>

      {/* MOTION 1b: Mid Wave Strata with Counter-Oscillation */}
      <g className="anim-proj-strata-mid">
        <g filter="url(#projVBPaperShadow)">
          <path
            d="M 0,2380 C 320,2290 760,2480 1220,2410 C 1560,2350 1780,2460 1920,2430 L 1920,2800 L 0,2800 Z"
            fill="url(#projMidBase)"
          />
          <path
            d="M 0,2380 C 320,2290 760,2480 1220,2410 C 1560,2350 1780,2460 1920,2430"
            stroke="url(#projCrestLineStroke)"
            strokeWidth="2"
            fill="none"
          />
        </g>
        <path
          d="M 0,2480 C 420,2550 880,2420 1340,2500 C 1640,2550 1820,2520 1920,2500 L 1920,2800 L 0,2800 Z"
          fill="url(#projMistBase)"
        />
      </g>

      {/* MOTION 2: Celestial Constellation Plexus Network Across Hero & Mid */}
      <g className="anim-proj-plexus-web">
        <g strokeWidth="1.2" opacity="0.6">
          {/* Upper Cluster */}
          <line
            x1="1220"
            y1="120"
            x2="1360"
            y2="80"
            stroke="#06B6D4"
            strokeOpacity="0.4"
          />
          <line
            x1="1360"
            y1="80"
            x2="1520"
            y2="140"
            stroke="#06B6D4"
            strokeOpacity="0.4"
          />
          <line
            x1="1520"
            y1="140"
            x2="1680"
            y2="70"
            stroke="#3B82F6"
            strokeOpacity="0.35"
          />
          <line
            x1="1360"
            y1="80"
            x2="1440"
            y2="240"
            stroke="#8B5CF6"
            strokeOpacity="0.35"
          />
          <line
            x1="1520"
            y1="140"
            x2="1440"
            y2="240"
            stroke="#06B6D4"
            strokeOpacity="0.4"
          />
          <line
            x1="1520"
            y1="140"
            x2="1620"
            y2="260"
            stroke="#3B82F6"
            strokeOpacity="0.4"
          />
          <line
            x1="1680"
            y1="70"
            x2="1620"
            y2="260"
            stroke="#06B6D4"
            strokeOpacity="0.35"
          />
          <line
            x1="1680"
            y1="70"
            x2="1820"
            y2="180"
            stroke="#3B82F6"
            strokeOpacity="0.3"
          />
          <line
            x1="1620"
            y1="260"
            x2="1820"
            y2="180"
            stroke="#8B5CF6"
            strokeOpacity="0.3"
          />
          <line
            x1="1440"
            y1="240"
            x2="1560"
            y2="380"
            stroke="#06B6D4"
            strokeOpacity="0.4"
          />
          <line
            x1="1620"
            y1="260"
            x2="1560"
            y2="380"
            stroke="#8B5CF6"
            strokeOpacity="0.35"
          />
          <line
            x1="1620"
            y1="260"
            x2="1740"
            y2="420"
            stroke="#10B981"
            strokeOpacity="0.35"
          />
          <line
            x1="1820"
            y1="180"
            x2="1740"
            y2="420"
            stroke="#3B82F6"
            strokeOpacity="0.3"
          />
          <line
            x1="1560"
            y1="380"
            x2="1740"
            y2="420"
            stroke="#06B6D4"
            strokeOpacity="0.35"
          />
          <line
            x1="1560"
            y1="380"
            x2="1420"
            y2="480"
            stroke="#8B5CF6"
            strokeOpacity="0.3"
          />
          <line
            x1="1740"
            y1="420"
            x2="1860"
            y2="520"
            stroke="#06B6D4"
            strokeOpacity="0.3"
          />
          <line
            x1="1420"
            y1="480"
            x2="1600"
            y2="560"
            stroke="#3B82F6"
            strokeOpacity="0.3"
          />
          <line
            x1="1740"
            y1="420"
            x2="1600"
            y2="560"
            stroke="#06B6D4"
            strokeOpacity="0.35"
          />
          <line
            x1="1600"
            y1="560"
            x2="1860"
            y2="520"
            stroke="#8B5CF6"
            strokeOpacity="0.25"
          />

          {/* Mid Section Extended Links */}
          <line
            x1="1600"
            y1="560"
            x2="1500"
            y2="780"
            stroke="#06B6D4"
            strokeOpacity="0.3"
          />
          <line
            x1="1500"
            y1="780"
            x2="1680"
            y2="920"
            stroke="#3B82F6"
            strokeOpacity="0.3"
          />
          <line
            x1="1680"
            y1="920"
            x2="1540"
            y2="1080"
            stroke="#8B5CF6"
            strokeOpacity="0.25"
          />
        </g>

        {/* MOTION 3: Twinkling Starry Pulsar Nodes Across Page */}
        <g className="anim-proj-pulsar-node" filter="url(#projVBPlexusGlow)">
          <circle cx="1220" cy="120" r="3" fill="#06B6D4" />
          <circle cx="1360" cy="80" r="4" fill="#3B82F6" />
          <circle cx="1520" cy="140" r="4.5" fill="#06B6D4" />
          <circle cx="1680" cy="70" r="3.5" fill="#8B5CF6" />
          <circle cx="1440" cy="240" r="4" fill="#10B981" />
          <circle cx="1620" cy="260" r="5" fill="#06B6D4" />
          <circle cx="1820" cy="180" r="3.5" fill="#3B82F6" />
          <circle cx="1560" cy="380" r="4.5" fill="#8B5CF6" />
          <circle cx="1740" cy="420" r="4" fill="#10B981" />
          <circle cx="1420" cy="480" r="3.5" fill="#06B6D4" />
          <circle cx="1600" cy="560" r="4.5" fill="#06B6D4" />
          <circle cx="1860" cy="520" r="3" fill="#3B82F6" />
          {/* Mid Nodes */}
          <circle cx="1500" cy="780" r="3.5" fill="#10B981" />
          <circle cx="1680" cy="920" r="4" fill="#06B6D4" />
          <circle cx="1540" cy="1080" r="3.5" fill="#8B5CF6" />
        </g>
      </g>
    </svg>
  );
}

/**
 * VectorBackground Component
 * Switches between page-specific vector graphics with unique motions per page
 * Absolutely positioned to scroll naturally with the site
 */
function VectorBackground({ pathname }) {
  const currentCategory = getPageCategory(pathname);

  return (
    <div className="vector-bg-container" aria-hidden="true">
      {/* Home Page Vector Layer */}
      <div
        className={`vector-bg-layer ${currentCategory === 'home' ? 'active' : 'inactive'}`}
      >
        <HomeVectorGraphic />
      </div>

      {/* Library Page Vector Layer */}
      <div
        className={`vector-bg-layer ${currentCategory === 'library' ? 'active' : 'inactive'}`}
      >
        <LibraryVectorGraphic />
      </div>

      {/* Project Page Vector Layer */}
      <div
        className={`vector-bg-layer ${currentCategory === 'project' ? 'active' : 'inactive'}`}
      >
        <ProjectVectorGraphic />
      </div>
    </div>
  );
}

export default VectorBackground;
