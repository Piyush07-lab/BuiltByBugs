import { useState } from 'react';

const cards = [
  {
    id: 'backend',
    title: 'Backend Core',
    description: 'Node & SQL',
    className: 'md:col-span-2',
    icon: (
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5V19A9 3 0 0 0 21 19V5" />
        <path d="M3 12A9 3 0 0 0 21 12" />
      </svg>
    ),
  },
  {
    id: 'automation',
    title: 'Automation',
    description: 'GitLab CI/CD',
    className: 'md:col-span-1',
    icon: (
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 13.29c0-1.57-.45-3.07-1.3-4.27L17 3.5c-.32-.5-1.1-.5-1.42 0L12 9l-3.58-5.5c-.32-.5-1.1-.5-1.42 0l-3.7 5.52A7.77 7.77 0 0 0 2 13.29c0 4.14 3.19 7.57 7.21 7.71h5.58c4.02-.14 7.21-3.57 7.21-7.71Z" />
        <path d="M12 9v12" />
        <path d="M5.5 9h13" />
      </svg>
    ),
  },
  {
    id: 'ai',
    title: 'AI Integration',
    description: 'Google AI Studio',
    className: 'md:col-span-1',
    icon: (
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
        <path d="M20 3v4" />
        <path d="M22 5h-4" />
        <path d="M4 17v2" />
        <path d="M5 18H3" />
      </svg>
    ),
  },
  {
    id: 'foundation',
    title: 'Foundation',
    description: 'React / Vite / TS',
    className: 'md:col-span-1',
    icon: (
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(30 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(90 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(150 12 12)" />
        <circle cx="12" cy="12" r="1.5" />
      </svg>
    ),
  },
];

const miniCards = [
  {
    id: 'docker',
    title: 'Docker',
    description: 'Containers',
    icon: (
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 13.5c1.5 0 2.5 1 4 1s2.5-1 4-1 2.5 1 4 1 2.5-1 4-1 2.5 1 4 1" />
        <path d="M2 17.5c1.5 0 2.5 1 4 1s2.5-1 4-1 2.5 1 4 1 2.5-1 4-1 2.5 1 4 1" />
        <rect x="4" y="9" width="3" height="3" rx="0.5" />
        <rect x="8" y="9" width="3" height="3" rx="0.5" />
        <rect x="12" y="9" width="3" height="3" rx="0.5" />
        <rect x="8" y="5.5" width="3" height="3" rx="0.5" />
      </svg>
    ),
  },
  {
    id: 'tailwind',
    title: 'Tailwind',
    description: 'Styling',
    icon: (
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 12c.5-2.5 2.5-4 5-3.5 1.5.3 2.5 1.5 3.5 2.5 1.5 1.5 3 2 5.5 1-1 2.5-2.5 4-5 3.5-1.5-.3-2.5-1.5-3.5-2.5-1.5-1.5-3-2-5.5-1z" />
        <path d="M2 16c.5-2.5 2.5-4 5-3.5 1.5.3 2.5 1.5 3.5 2.5 1.5 1.5 3 2 5.5 1-1 2.5-2.5 4-5 3.5-1.5-.3-2.5-1.5-3.5-2.5-1.5-1.5-3-2-5.5-1z" />
      </svg>
    ),
  },
  {
    id: 'git',
    title: 'Git',
    description: 'VCS',
    icon: (
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="6" y1="3" x2="6" y2="15" />
        <circle cx="18" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <path d="M18 9a9 9 0 0 1-9 9" />
      </svg>
    ),
  },
  {
    id: 'terminal',
    title: 'Terminal',
    description: 'CLI & Shell',
    icon: (
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
  },
];

export default function TechStackBento() {
  const [activeCard, setActiveCard] = useState(null);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  const getCardClasses = (id, extra = '') => {
    const isActive = activeCard === id;
    const isDimmed = activeCard !== null && !isActive;
    return `
      group relative flex flex-col justify-between overflow-hidden outline-none
      bg-[rgba(47,77,70,0.04)] backdrop-blur-[10px] border border-white/10
      transition-all duration-300 ease-in-out cursor-default
      focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black
      ${isDimmed ? 'opacity-40 scale-[0.98]' : 'opacity-100 scale-100'}
      ${isActive ? 'shadow-[0_8px_30px_rgba(0,0,0,0.25)] border-white/20' : ''}
      ${extra}
    `;
  };

  return (
    <section className="mt-16 md:mt-28" aria-label="Tech Stack Showcase">
      <div className="max-w-[760px]">
        <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.14em] text-accent">Tech Stack</p>
        <h2 className="mb-8 text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight tracking-[-0.03em] text-white">
          Tools &amp; Technologies
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:auto-rows-[220px]">
        {/* Row 1, Col 1-2: Backend */}
        <div
          tabIndex={0}
          role="region"
          aria-label={`${cards[0].title}: ${cards[0].description}`}
          className={getCardClasses(cards[0].id, `${cards[0].className} rounded-2xl p-6`)}
          onMouseEnter={() => setActiveCard(cards[0].id)}
          onMouseLeave={() => setActiveCard(null)}
          onFocus={() => setActiveCard(cards[0].id)}
          onBlur={() => setActiveCard(null)}
          onMouseMove={handleMouseMove}
        >
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300 ease-out"
            style={{
              opacity: activeCard === cards[0].id ? 1 : 0,
              background: 'radial-gradient(360px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), rgba(10,100,69,0.75), transparent 80%)',
            }}
          />
          <div className="relative z-10 text-white/80 transition-all duration-300 group-hover:text-white group-hover:scale-105 group-focus-visible:scale-105">
            {cards[0].icon}
          </div>
          <div className="relative z-10 transition-transform duration-300 group-hover:-translate-y-1 group-focus-visible:-translate-y-1">
            <h3 className="text-white font-bold text-lg tracking-tight">{cards[0].title}</h3>
            <p className="text-accent text-sm font-medium mt-0.5">{cards[0].description}</p>
          </div>
        </div>

        {/* Row 1, Col 3: Automation */}
        <div
          tabIndex={0}
          role="region"
          aria-label={`${cards[1].title}: ${cards[1].description}`}
          className={getCardClasses(cards[1].id, `${cards[1].className} rounded-2xl p-6`)}
          onMouseEnter={() => setActiveCard(cards[1].id)}
          onMouseLeave={() => setActiveCard(null)}
          onFocus={() => setActiveCard(cards[1].id)}
          onBlur={() => setActiveCard(null)}
          onMouseMove={handleMouseMove}
        >
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300 ease-out"
            style={{
              opacity: activeCard === cards[1].id ? 1 : 0,
              background: 'radial-gradient(280px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), rgba(10,100,69,0.75), transparent 80%)',
            }}
          />
          <div className="relative z-10 text-white/80 transition-all duration-300 group-hover:text-white group-hover:scale-105 group-focus-visible:scale-105">
            {cards[1].icon}
          </div>
          <div className="relative z-10 transition-transform duration-300 group-hover:-translate-y-1 group-focus-visible:-translate-y-1">
            <h3 className="text-white font-bold text-base tracking-tight">{cards[1].title}</h3>
            <p className="text-accent text-sm font-medium mt-0.5">{cards[1].description}</p>
          </div>
        </div>

        {/* Row 2, Col 1: 2x2 Mini Cards (Placed first in Row 2 for natural DOM/Tab Order) */}
        <div className="grid grid-cols-2 grid-rows-2 gap-2.5 h-full">
          {miniCards.map((mini) => (
            <div
              key={mini.id}
              tabIndex={0}
              role="region"
              aria-label={`${mini.title}: ${mini.description}`}
              className={getCardClasses(mini.id, 'rounded-xl p-3 justify-between')}
              onMouseEnter={() => setActiveCard(mini.id)}
              onMouseLeave={() => setActiveCard(null)}
              onFocus={() => setActiveCard(mini.id)}
              onBlur={() => setActiveCard(null)}
              onMouseMove={handleMouseMove}
            >
              <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-300 ease-out"
                style={{
                  opacity: activeCard === mini.id ? 1 : 0,
                  background: 'radial-gradient(160px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), rgba(10,100,69,0.75), transparent 85%)',
                }}
              />
              <div className="relative z-10 text-white/80 transition-all duration-300 group-hover:text-white group-hover:scale-105 group-focus-visible:scale-105">
                {mini.icon}
              </div>
              <div className="relative z-10">
                <h4 className="text-white text-xs font-bold tracking-tight leading-snug">{mini.title}</h4>
                <p className="text-accent text-[10px] font-medium leading-tight">{mini.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2, Col 2: AI Integration */}
        <div
          tabIndex={0}
          role="region"
          aria-label={`${cards[2].title}: ${cards[2].description}`}
          className={getCardClasses(cards[2].id, `${cards[2].className} rounded-2xl p-6`)}
          onMouseEnter={() => setActiveCard(cards[2].id)}
          onMouseLeave={() => setActiveCard(null)}
          onFocus={() => setActiveCard(cards[2].id)}
          onBlur={() => setActiveCard(null)}
          onMouseMove={handleMouseMove}
        >
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300 ease-out"
            style={{
              opacity: activeCard === cards[2].id ? 1 : 0,
              background: 'radial-gradient(280px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), rgba(10,100,69,0.75), transparent 80%)',
            }}
          />
          <div className="relative z-10 text-white/80 transition-all duration-300 group-hover:text-white group-hover:scale-105 group-focus-visible:scale-105">
            {cards[2].icon}
          </div>
          <div className="relative z-10 transition-transform duration-300 group-hover:-translate-y-1 group-focus-visible:-translate-y-1">
            <h3 className="text-white font-bold text-base tracking-tight">{cards[2].title}</h3>
            <p className="text-accent text-sm font-medium mt-0.5">{cards[2].description}</p>
          </div>
        </div>

        {/* Row 2, Col 3: Foundation */}
        <div
          tabIndex={0}
          role="region"
          aria-label={`${cards[3].title}: ${cards[3].description}`}
          className={getCardClasses(cards[3].id, `${cards[3].className} rounded-2xl p-6`)}
          onMouseEnter={() => setActiveCard(cards[3].id)}
          onMouseLeave={() => setActiveCard(null)}
          onFocus={() => setActiveCard(cards[3].id)}
          onBlur={() => setActiveCard(null)}
          onMouseMove={handleMouseMove}
        >
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300 ease-out"
            style={{
              opacity: activeCard === cards[3].id ? 1 : 0,
              background: 'radial-gradient(280px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), rgba(10,100,69,0.75), transparent 80%)',
            }}
          />
          <div className="relative z-10 text-white/80 transition-all duration-300 group-hover:text-white group-hover:scale-105 group-focus-visible:scale-105">
            {cards[3].icon}
          </div>
          <div className="relative z-10 transition-transform duration-300 group-hover:-translate-y-1 group-focus-visible:-translate-y-1">
            <h3 className="text-white font-bold text-base tracking-tight">{cards[3].title}</h3>
            <p className="text-accent text-sm font-medium mt-0.5">{cards[3].description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
