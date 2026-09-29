function CodingSummary({ summary }) {
    const languages = summary.languages || [];
    const projects = summary.projects || [];

    return (
        <section className="rounded-2xl border border-[#9eaedb]/[0.16] bg-[#11172a]/[0.62] p-6">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
                <div>
                    <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.14em] text-[#a7f3d0]">Coding Summary</p>
                    <h2 className="mb-3 text-[clamp(1.45rem,3vw,2rem)] font-bold text-white">{summary.totalText || "WakaTime activity"}</h2>
                    <p className="leading-relaxed text-[#99a4be]">{summary.dailyAverageText ? `Daily average: ${summary.dailyAverageText}` : "Live coding data from WakaTime."}</p>
                </div>
                {summary.cache && (
                    <span className="text-[0.85rem] text-[#78849f]">{summary.cache.hit ? "Cached" : "Fresh"}</span>
                )}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <h3 className="mb-4 text-[1.1rem] font-bold text-white">Languages</h3>
                    <div className="flex flex-col gap-2.5">
                        {languages.slice(0, 6).map((language) => (
                            <div className="grid gap-1.5" key={language.name}>
                                <div className="flex justify-between gap-4 text-[0.86rem] text-[#d7deed]">
                                    <span>{language.name}</span>
                                    <small className="text-[#78849f]">{language.text || `${language.percent}%`}</small>
                                </div>
                                <div className="h-[0.45rem] overflow-hidden rounded-full bg-[#080b16]/[0.72]">
                                    <span className="block h-full rounded-[inherit] bg-gradient-to-r from-[#4ade80] to-[#60a5fa]" style={{ width: `${language.percent || 0}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="mb-4 text-[1.1rem] font-bold text-white">Projects</h3>
                    <div className="flex flex-col gap-2.5">
                        {projects.slice(0, 6).map((project) => (
                            <span className="flex items-center justify-between gap-4 border-b border-[#9eaedb]/10 pb-2.5 text-[#d7deed]" key={project.name}>
                                <span>{project.name}</span>
                                <small className="text-[#78849f]">{project.text || `${project.totalMinutes} min`}</small>
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CodingSummary;
