import React, { useState } from 'react';
import { Transition } from '@headlessui/react';

const cards = [
  {
    id: 'backend',
    title: 'Backend Core',
    description: 'Node & SQL',
    className: 'md:col-span-2',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white opacity-80 group-hover:opacity-100 transition-opacity">
        <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
        <path d="M3 5V19A9 3 0 0 0 21 19V5"></path>
        <path d="M3 12A9 3 0 0 0 21 12"></path>
      </svg>
    ),
  },
  {
    id: 'automation',
    title: 'Automation',
    description: 'GitLab CI/CD',
    className: 'md:col-span-1',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white opacity-80 group-hover:opacity-100 transition-opacity">
        <path d="M22 13.29c0-1.57-.45-3.07-1.3-4.27L17 3.5c-.32-.5-1.1-.5-1.42 0L12 9l-3.58-5.5c-.32-.5-1.1-.5-1.42 0l-3.7 5.52A7.77 7.77 0 0 0 2 13.29c0 4.14 3.19 7.57 7.21 7.71h5.58c4.02-.14 7.21-3.57 7.21-7.71Z"></path>
        <path d="M12 9v12"></path>
        <path d="M5.5 9h13"></path>
      </svg>
    ),
  },
  {
    id: 'ai',
    title: 'AI Integration',
    description: 'Google AI Studio',
    className: 'md:col-span-1 md:col-start-2',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white opacity-80 group-hover:opacity-100 transition-opacity">
        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
        <path d="M20 3v4"></path>
        <path d="M22 5h-4"></path>
        <path d="M4 17v2"></path>
        <path d="M5 18H3"></path>
      </svg>
    ),
  },
  {
    id: 'foundation',
    title: 'Foundation',
    description: 'React / Vite / TS',
    className: 'md:col-span-1',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white opacity-80 group-hover:opacity-100 transition-opacity">
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(30 12 12)"></ellipse>
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(90 12 12)"></ellipse>
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(150 12 12)"></ellipse>
        <circle cx="12" cy="12" r="1.5"></circle>
      </svg>
    ),
  },
];

export default function TechStackBento() {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section className="mt-16 md:mt-28" aria-label="Tech Stack Showcase">
      <div className="max-w-[760px]">
        <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.14em] text-[#a7f3d0]">Tech Stack</p>
        <h2 className="mb-8 text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight tracking-[-0.03em] text-white">Tools &amp; Technologies</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[220px]">
        {cards.map((card) => {
          const isHovered = hoveredCard === card.id;
          const isDimmed = hoveredCard !== null && hoveredCard !== card.id;

          return (
            <div
              key={card.id}
              className={`
                group relative flex flex-col justify-center items-center overflow-hidden
                bg-[rgba(47,77,70,0.14)] backdrop-blur-[10px] 
                border border-white/10 rounded-2xl p-6
                transition-all duration-300 ease-in-out cursor-default
                ${card.className}
                ${isDimmed ? 'opacity-40 scale-[0.98]' : 'opacity-100 scale-100'}
                ${isHovered ? 'shadow-[0_8px_30px_rgb(0,0,0,0.2)] bg-[rgba(13,95,62,0.7)]' : ''}
              `}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div 
                className={`
                  transition-transform duration-300 ease-in-out
                  ${isHovered ? '-translate-y-4 scale-110' : 'translate-y-0 scale-100'}
                `}
              >
                {card.icon}
              </div>

              <Transition
                as="div"
                show={isHovered}
                enter="transition-all duration-300 ease-out"
                enterFrom="opacity-0 translate-y-4"
                enterTo="opacity-100 translate-y-0"
                leave="transition-all duration-200 ease-in"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-2"
                className="absolute bottom-6 text-center"
              >
                <h3 className="text-white font-bold tracking-tight">{card.title}</h3>
                <p className="text-[#a7f3d0] text-sm font-medium mt-1">{card.description}</p>
              </Transition>
            </div>
          );
        })}
      </div>
    </section>
  );
}
