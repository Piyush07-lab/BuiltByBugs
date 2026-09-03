function ContributionHeatmap({ heatmap = [], profileUrl }) {
    const sortedDays = [...heatmap].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );
    const total = sortedDays.reduce((sum, day) => sum + (day.count || 0), 0);
    const bestDay = sortedDays.reduce((best, day) => {
        if (!best || day.count > best.count) return day;
        return best;
    }, null);

    return (
        <section className="rounded-2xl border border-[#9eaedb]/16 bg-[#11172a]/62 p-6">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
                <div>
                    <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.14em] text-accent">Contribution Heatmap</p>
                    <h2 className="mb-3 text-[clamp(1.45rem,3vw,2rem)] font-bold text-white">Past year activity</h2>
                </div>
                {profileUrl && (
                    <a className="w-fit text-[0.9rem] font-extrabold text-accent no-underline hover:underline" href={profileUrl} target="_blank" rel="noreferrer">
                        View on GitHub
                    </a>
                )}
            </div>

            <div className="mt-6 overflow-x-auto overflow-y-hidden">
                <div className="grid w-max grid-flow-col grid-rows-[repeat(7,0.78rem)] gap-[0.2rem]" aria-label="GitHub contribution heatmap">
                    {sortedDays.map((day) => (
                        <span
                            key={day.date}
                            className="h-[0.78rem] w-[0.78rem] rounded-[0.16rem] transition duration-150 ease-in-out hover:scale-125"
                            style={{ backgroundColor: day.color }}
                            title={`${day.date}: ${day.count} contributions`}
                        />
                    ))}
                </div>
            </div>

            <div className="mt-4 flex flex-col items-start justify-between gap-4 border-t border-[#9eaedb]/12 pt-4 text-[0.85rem] text-subtle md:flex-row">
                <span>Total contributions: {total}</span>
                <span>Best day: {bestDay?.count ?? 0}</span>
            </div>
        </section>
    );
}

export default ContributionHeatmap;
