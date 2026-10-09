import { useEffect, useState } from 'react';
import { bulletinItems } from '../../data/bulletin.js';
import WidgetShell from '../miscellaneous/WidgetShell.jsx';

function BulletinWidget() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const item = bulletinItems[index];

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % bulletinItems.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const getStatusBadge = (bulletin) => {
    if (bulletin.title?.includes('Compiler Pipeline')) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border-metallic-green bg-brand-green/10 px-2 py-0.5 text-[0.65rem] font-bold text-brand-green">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-green shadow-glow-green" />
          Build Success
        </span>
      );
    }
    if (bulletin.title?.includes('Rule Engine')) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-turquoise/40 bg-brand-turquoise/10 px-2 py-0.5 text-[0.65rem] font-bold text-cyan-300 animate-pulse-glow">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-turquoise" />
          Active Execution
        </span>
      );
    }
    if (bulletin.tag?.includes('Next') || bulletin.tag?.includes('Upcoming')) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-violet/30 bg-brand-violet/10 px-2 py-0.5 text-[0.65rem] font-bold text-purple-300">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-violet" />
          Queued / Parsing
        </span>
      );
    }
    return null;
  };

  const indicators = (
    <div
      className="flex items-center gap-1.5"
      role="tablist"
      aria-label="Bulletin Slides"
    >
      {bulletinItems.map((_, idx) => (
        <button
          key={idx}
          type="button"
          role="tab"
          aria-selected={index === idx}
          aria-label={`Bulletin ${idx + 1}`}
          onClick={() => setIndex(idx)}
          className={`h-1.5 rounded-full transition-all duration-300 focus:outline-hidden cursor-pointer ${
            index === idx
              ? 'w-4 bg-brand-turquoise shadow-glow-turquoise'
              : 'w-1.5 bg-white/20 hover:bg-white/40'
          }`}
        />
      ))}
    </div>
  );

  return (
    <WidgetShell
      number="W3"
      title="Activity bulletin"
      eyebrow={item.tag}
      indicators={indicators}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative grid grid-cols-1 grid-rows-1 flex-1 min-h-0">
        {bulletinItems.map((bulletin, idx) => (
          <div
            key={bulletin.id || idx}
            className={`col-start-1 row-start-1 flex h-full flex-col justify-between transition-opacity duration-500 ease-in-out ${
              index === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <p className="m-0 text-[1.1rem] font-extrabold text-white">
                  {bulletin.title}
                </p>
                {getStatusBadge(bulletin)}
              </div>
              <p className="m-0 text-xs font-bold text-brand-turquoise">
                {bulletin.subtitle}
              </p>
              <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted">
                {bulletin.description}
              </p>
            </div>
            <div className="pt-2 border-t border-brand-border-subtle">
              <p className="m-0 text-[0.72rem] uppercase tracking-wider text-subtle">
                {bulletin.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </WidgetShell>
  );
}

export default BulletinWidget;
