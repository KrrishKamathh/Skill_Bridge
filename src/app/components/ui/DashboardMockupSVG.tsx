export const DashboardMockupSVG = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 680" className="h-[450px] md:h-[600px] w-auto drop-shadow-2xl rounded-2xl" fontFamily="'Outfit', sans-serif">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: "#fdf6e3"}}/>
          <stop offset="100%" style={{stopColor: "#eee8d5"}}/>
        </linearGradient>
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <clipPath id="sidebarClip">
          <rect width="320" height="680" rx="20"/>
        </clipPath>
      </defs>

      {/* Background */}
      <rect width="320" height="680" rx="20" fill="url(#bgGrad)" stroke="#cfc3a0" strokeWidth="1" clipPath="url(#sidebarClip)"/>

      {/* Header */}
      <text x="160" y="36" textAnchor="middle" fontSize="18" fontWeight="900" letterSpacing="1.5" fill="#2d2013" filter="url(#softGlow)">SkillBridge</text>
      <text x="160" y="50" textAnchor="middle" fontSize="8" fontWeight="900" letterSpacing="2" fill="#7a6040">MASTER PLATFORM</text>

      <line x1="24" y1="62" x2="296" y2="62" stroke="#cfc3a0" strokeWidth="0.5" />

      {/* Profile Section Mockup */}
      <circle cx="62" cy="108" r="28" fill="#2d2013" />
      <text x="62" y="115" textAnchor="middle" fontSize="22" fontWeight="900" fill="#fdf6e3">A</text>
      <circle cx="86" cy="88" r="6" fill="#cb4b16" stroke="#fdf6e3" strokeWidth="1.5" />

      <text x="105" y="104" fontSize="13" fontWeight="900" fill="#2d2013" letterSpacing="-0.3">Alex Chen</text>
      <text x="105" y="118" fontSize="9" fontWeight="700" fill="#7a6040">Senior Architect</text>

      {/* Navigation Mockup */}
      <g transform="translate(16, 150)">
        <rect width="288" height="40" rx="12" fill="white" stroke="#cfc3a0" strokeWidth="0.5" />
        <rect width="4" height="20" x="8" y="10" rx="2" fill="#cb4b16" />
        <text x="40" y="25" fontSize="11" fontWeight="900" fill="#2d2013">Overview</text>
        <circle cx="270" cy="20" r="8" fill="#cb4b16" />
        <text x="270" y="23" textAnchor="middle" fontSize="7" fontWeight="900" fill="white">5</text>
      </g>

      <g transform="translate(16, 200)">
        <text x="40" y="25" fontSize="11" fontWeight="700" fill="#7a6040">Curriculum</text>
      </g>
      
      <g transform="translate(16, 240)">
        <text x="40" y="25" fontSize="11" fontWeight="700" fill="#7a6040">Portfolio</text>
      </g>

      <g transform="translate(16, 280)">
        <text x="40" y="25" fontSize="11" fontWeight="700" fill="#7a6040">Velocity</text>
      </g>

      {/* Skill Card Mockup */}
      <g transform="translate(16, 340)">
        <rect width="288" height="140" rx="20" fill="white" stroke="#cfc3a0" strokeWidth="0.5" />
        <text x="20" y="30" fontSize="12" fontWeight="900" fill="#2d2013">Skill Radar</text>
        
        <circle cx="70" cy="85" r="35" fill="none" stroke="#eee8d5" strokeWidth="8" />
        <circle cx="70" cy="85" r="35" fill="none" stroke="#2aa198" strokeWidth="8" strokeDasharray="160 220" strokeDashoffset="40" strokeLinecap="round" transform="rotate(-90 70 85)" />
        <text x="70" y="90" textAnchor="middle" fontSize="14" fontWeight="900" fill="#2d2013">82%</text>

        <g transform="translate(130, 0)">
          <rect x="0" y="55" width="10" height="45" rx="5" fill="#cb4b16" />
          <rect x="25" y="50" width="10" height="50" rx="5" fill="#cb4b16" />
          <rect x="50" y="75" width="10" height="25" rx="5" fill="#cb4b16" />
          <rect x="75" y="60" width="10" height="40" rx="5" fill="#cb4b16" />
        </g>
      </g>

      {/* Velocity Mockup */}
      <g transform="translate(16, 500)">
        <rect width="288" height="60" rx="16" fill="#2d2013" />
        <text x="20" y="25" fontSize="8" fontWeight="900" fill="#eee8d5">VELOCITY PULSE</text>
        <text x="20" y="45" fontSize="16" fontWeight="900" fill="white">14.2 GB/S</text>
        <path d="M160 45 Q175 25 190 45 T220 45 T250 25" fill="none" stroke="#2aa198" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Learning Mockup */}
      <g transform="translate(16, 580)">
        <rect width="288" height="80" rx="20" fill="white" stroke="#cfc3a0" strokeWidth="0.5" />
        <text x="20" y="25" fontSize="8" fontWeight="900" fill="#7a6040">UP NEXT</text>
        <text x="20" y="45" fontSize="13" fontWeight="900" fill="#2d2013">Advanced Framer Motion</text>
        <rect x="20" y="58" width="220" height="6" rx="3" fill="#eee8d5" />
        <rect x="20" y="58" width="160" height="6" rx="3" fill="#cb4b16" />
      </g>
    </svg>
  );
};
