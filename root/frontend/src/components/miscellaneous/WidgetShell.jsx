function WidgetShell({
  number,
  eyebrow,
  title,
  status,
  indicators,
  children,
  className = '',
  ...rest
}) {
  return (
    <article
      className={`relative flex flex-col justify-between min-h-[280px] md:h-98.75 rounded-2xl border border-brand-border bg-brand-card backdrop-blur-md p-6 shadow-paper-depth transition-all duration-300 hover:border-brand-violet/40 overflow-hidden ${className}`}
      {...rest}
    >
      {/* Upper-right subtle geometric accent */}
      <div
        className="pointer-events-none absolute top-0 right-0 w-24 h-24 overflow-hidden opacity-30"
        aria-hidden="true"
      >
        <svg viewBox="0 0 96 96" fill="none" className="w-full h-full">
          <path d="M96 0 L48 0 L96 48 Z" fill="rgba(139, 92, 246, 0.08)" />
          <line x1="96" y1="24" x2="72" y2="0" stroke="#06B6D4" strokeWidth="1" strokeOpacity="0.4" />
          <circle cx="72" cy="24" r="1.5" fill="#06B6D4" opacity="0.6" />
        </svg>
      </div>

      <div className="relative z-10 flex items-center justify-between gap-4">
        <span className="mb-0 block text-xs font-extrabold uppercase tracking-[0.14em] text-brand-violet/70">
          {number}
        </span>
        {(indicators || status) && (
          <div className="flex items-center gap-1.5">{indicators || status}</div>
        )}
      </div>

      <div className="relative z-10 mt-5 mb-4 block">
        {eyebrow && (
          <p className="mb-1 text-[0.7rem] font-extrabold uppercase tracking-[0.12em] text-brand-turquoise">
            {eyebrow}
          </p>
        )}
        <h2 className="text-[1.1rem] font-bold text-white">{title}</h2>
      </div>

      <div className="relative z-10 flex-1 flex flex-col min-h-0">{children}</div>
    </article>
  );
}

export default WidgetShell;
