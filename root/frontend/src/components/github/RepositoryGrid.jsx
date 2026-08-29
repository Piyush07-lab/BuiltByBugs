function RepositoryGrid({ repos = [] }) {
    const sortedRepos = [...repos].sort(
        (a, b) => new Date(b.pushed_at || 0) - new Date(a.pushed_at || 0)
    );

    return (
        <section className="rounded-2xl border border-[#9eaedb]/[0.16] bg-[#11172a]/[0.62] p-6">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
                <div>
                    <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.14em] text-[#a7f3d0]">Repositories</p>
                    <h2 className="mb-3 text-[clamp(1.45rem,3vw,2rem)] font-bold text-white">Recently updated work</h2>
                </div>
                <span className="text-[0.85rem] text-[#78849f]">{sortedRepos.length} public repos</span>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                {sortedRepos.map((repo) => (
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
        </section>
    );
}

export default RepositoryGrid;
