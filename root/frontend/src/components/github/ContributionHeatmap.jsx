function ContributionHeatmap({ heatmap = [], profileUrl }) {
  const sortedDays = [...heatmap].sort((a, b) => new Date(a.date) - new Date(b.date));
  const total = sortedDays.reduce((sum, day) => sum + (day.count || 0), 0);
  const bestDay = sortedDays.reduce((best, day) => {
    if (!best || day.count > best.count) return day;
    return best;
  }, null);

  const getCellColor = (day) => {
    if (!day.count || day.count === 0) return 'rgba(20, 16, 38, 0.8)';
    if (day.count <= 2) return 'rgba(6, 182, 212, 0.35)';
    if (day.count <= 5) return 'rgba(6, 182, 212, 0.65)';
    if (day.count <= 10) return 'rgba(16, 185, 129, 0.75)';
    return '#10B981';
  };

  return (
    <section className="rounded-2xl border border-brand-border bg-brand-card backdrop-blur-md p-4 sm:p-6 shadow-paper-depth">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
        <div>
          <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.14em] text-brand-turquoise">
            Contribution Heatmap
          </p>
          <h2 className="mb-3 text-[clamp(1.45rem,3vw,2rem)] font-bold text-white">
            Past year activity
          </h2>
        </div>
        {profileUrl && (
          <a
            className="w-fit text-[0.9rem] font-extrabold text-brand-turquoise no-underline hover:text-brand-green transition-colors"
            href={profileUrl}
            target="_blank"
            rel="noreferrer"
          >
            View on GitHub →
          </a>
        )}
      </div>

      {/* Heatmap grid — responsive cell sizing */}
      <div className="mt-6 w-full">
        <div
          className="grid w-full grid-flow-col grid-rows-[repeat(7,1fr)]"
          style={{ gap: 'clamp(1px, 0.4vw, 3px)' }}
          aria-label="GitHub contribution heatmap"
        >
          {sortedDays.map((day) => (
            <span
              key={day.date}
              className="aspect-square rounded-[1px] sm:rounded-[2px] transition duration-150 ease-in-out hover:scale-125"
              style={{ backgroundColor: getCellColor(day) }}
              title={`${day.date}: ${day.count} contributions`}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-col items-start justify-between gap-2 border-t border-brand-border-subtle pt-4 text-[0.78rem] sm:text-[0.85rem] text-subtle sm:flex-row sm:gap-4">
        <span>Total contributions: {total}</span>
        <span>Best day: {bestDay?.count ?? 0}</span>
      </div>
    </section>
  );
}

export default ContributionHeatmap;
