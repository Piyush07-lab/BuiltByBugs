import { useState } from "react";

function RepositoryGrid({ repos = [], limit }) {
    const sortedRepos = [...repos].sort(
        (a, b) => new Date(b.pushed_at || 0) - new Date(a.pushed_at || 0)
    );

    const hasLimit = typeof limit === "number" && limit < sortedRepos.length;
    const [expanded, setExpanded] = useState(false);
    const visibleRepos = hasLimit && !expanded ? sortedRepos.slice(0, limit) : sortedRepos;

    return (
        <section className="rounded-2xl border border-[#9eaedb]/[0.16] bg-[#11172a]/[0.62] p-4 sm:p-6">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
                <div>
                    <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.14em] text-[#a7f3d0]">Repositories</p>
                    <h2 className="mb-3 text-[clamp(1.45rem,3vw,2rem)] font-bold text-white">Recently updated work</h2>
                </div>
                <span className="text-[0.85rem] text-[#78849f]">{sortedRepos.length} public repos</span>
            </div>

            {/* Desktop: Full card grid */}
            <div className="mt-6 hidden md:grid grid-cols-3 gap-4">
                {visibleRepos.map((repo) => (
                    <a className="flex min-h-[230px] flex-col rounded-xl border border-[#9eaedb]/[0.12] bg-[#080b16]/[0.42] p-4 text-inherit no-underline transition duration-150 ease-in-out hover:-translate-y-0.5 hover:border-[#a7f3d0]/50 focus-visible:-translate-y-0.5 focus-visible:border-[#a7f3d0]/50" href={repo.html_url} target="_blank" rel="noreferrer" key={repo.id || repo.name}>
                        <h3 className="mb-2 text-[1.1rem] font-bold text-white [overflow-wrap:anywhere]">{repo.name}</h3>
                        <p className="mb-3 flex-1 text-[0.9rem] leading-relaxed text-[#99a4be]">{repo.description || "No description provided."}</p>

                        <div className="flex flex-wrap gap-2">
                            {(repo.topics || []).slice(0, 4).map((topic) => (
                                <span className="rounded-[0.4rem] bg-[#a7f3d0]/[0.08] px-2 py-1 text-[0.74rem] text-[#d7deed]" key={topic}>{topic}</span>
                            ))}
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <span className="rounded-[0.4rem] bg-[#a7f3d0]/[0.08] px-2 py-1 text-[0.74rem] text-[#d7deed]">{repo.language || "Unknown"}</span>
                            <span className="rounded-[0.4rem] bg-[#a7f3d0]/[0.08] px-2 py-1 text-[0.74rem] text-[#d7deed]">{repo.stargazers_count || 0} stars</span>
                            <span className="rounded-[0.4rem] bg-[#a7f3d0]/[0.08] px-2 py-1 text-[0.74rem] text-[#d7deed]">{repo.forks_count || 0} forks</span>
                        </div>
                    </a>
                ))}
            </div>

            {/* Mobile: Compact single-line rows */}
            <div className="mt-4 flex flex-col gap-0 md:hidden">
                {visibleRepos.map((repo) => (
                    <a
                        className="flex items-center justify-between gap-3 border-b border-[#9eaedb]/10 py-3 text-inherit no-underline transition-colors duration-150 hover:bg-white/[0.03] -mx-2 px-2 rounded-lg"
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        key={repo.id || repo.name}
                    >
                        <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-[0.85rem] font-semibold text-white truncate">{repo.name}</span>
                            {repo.language && (
                                <span className="shrink-0 rounded-[0.3rem] bg-[#a7f3d0]/[0.08] px-1.5 py-0.5 text-[0.65rem] text-[#99a4be]">{repo.language}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0 text-[0.7rem] text-[#78849f]">
                            <span>★ {repo.stargazers_count || 0}</span>
                            <span aria-hidden="true">→</span>
                        </div>
                    </a>
                ))}
            </div>

            {/* Expand toggle */}
            {hasLimit && (
                <div className="mt-4 flex justify-center">
                    <button
                        type="button"
                        onClick={() => setExpanded(!expanded)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#9eaedb]/12 bg-[#080b16]/40 px-4 py-2 text-[0.8rem] font-medium text-muted transition-colors hover:border-accent/30 hover:text-white cursor-pointer"
                    >
                        {expanded ? "Show less" : `Show all ${sortedRepos.length} repos`}
                        <span className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}>↓</span>
                    </button>
                </div>
            )}
        </section>
    );
}

export default RepositoryGrid;
