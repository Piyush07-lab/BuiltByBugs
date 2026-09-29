export function FoundationCard({ number, title, description }) {
  return (
    <article className="min-h-auto md:min-h-55 rounded-2xl border border-brand-border bg-brand-card backdrop-blur-md p-6 shadow-paper-depth transition-all duration-300 hover:border-brand-violet/40">
      <span className="mb-8 md:mb-14 block text-xs font-extrabold uppercase tracking-[0.14em] text-brand-violet/70">
        {number}
      </span>
      <h2 className="mb-2.5 text-[1.1rem] font-bold text-white">{title}</h2>
      <p className="text-[0.9rem] leading-relaxed text-muted">{description}</p>
    </article>
  );
}
