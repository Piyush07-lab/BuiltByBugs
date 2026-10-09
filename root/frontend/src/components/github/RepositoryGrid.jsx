import { useState } from 'react';

function RepositoryGrid({ repos = [], limit }) {
  const sortedRepos = [...repos].sort(
    (a, b) => new Date(b.pushed_at || 0) - new Date(a.pushed_at || 0)
  );

  const hasLimit = typeof limit === 'number' && limit < sortedRepos.length;
  const [expanded, setExpanded] = useState(false);
  const visibleRepos = hasLimit && !expanded ? sortedRepos.slice(0, limit) : sortedRepos;

  return (
    <section className="rounded-2xl border border-brand-border bg-brand-card backdrop-blur-md p-4 sm:p-6 shadow-paper-depth">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
        <div>
          <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.14em] text-brand-turquoise">
            Repositories
          </p>
          <h2 className="mb-3 text-[clamp(1.45rem,3vw,2rem)] font-bold text-white">
            Recently updated work
          </h2>
        </div>
        <span className="text-[0.85rem] text-subtle">
          {sortedRepos.length} public repos
        </span>
      </div>

      {/* Desktop: Full card grid with interlocking frames & metallic trim */}
      <div className="mt-6 hidden md:grid grid-cols-3 gap-4">
        {visibleRepos.map((repo) => {
          const isFeatured =
            repo.name.toLowerCase().includes('builtbybugs') ||
            repo.name.toLowerCase().includes('dee');

          return (
            <a
              className={`flex min-h-[230px] flex-col rounded-xl p-4 text-inherit no-underline transition duration-200 ease-in-out hover:-translate-y-1 hover:shadow-glow-turquoise/40 focus-visible:-translate-y-1 ${
                isFeatured
                  ? 'border-metallic-green bg-brand-card-solid/90 shadow-paper-depth'
                  : 'border border-brand-border bg-brand-bg/60 hover:border-brand-turquoise/60 shadow-paper-depth'
              }`}
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              key={repo.id || repo.name}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="text-[1.1rem] font-bold text-white [overflow-wrap:anywhere]">
                  {repo.name}
                </h3>
                {isFeatured && (
                  <span className="shrink-0 rounded-full border border-brand-green/40 bg-brand-green/10 px-2 py-0.5 text-[0.65rem] font-bold text-brand-green">
                    FEATURED
                  </span>
                )}
              </div>

              <p className="mb-3 flex-1 text-[0.9rem] leading-relaxed text-muted">
                {repo.description || 'No description provided.'}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {(repo.topics || []).slice(0, 4).map((topic) => (
                  <span
                    className="rounded-[0.4rem] border border-brand-violet/30 bg-brand-violet/10 px-2 py-0.5 text-[0.7rem] text-purple-200"
                    key={topic}
                  >
                    {topic}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-[0.4rem] border border-brand-turquoise/25 bg-brand-turquoise/10 px-2 py-1 text-[0.72rem] text-cyan-200">
                  {repo.language || 'Unknown'}
                </span>
                <span className="rounded-[0.4rem] border border-brand-border-subtle bg-brand-bg/80 px-2 py-1 text-[0.72rem] text-zinc-300">
                  ★ {repo.stargazers_count || 0}
                </span>
                <span className="rounded-[0.4rem] border border-brand-border-subtle bg-brand-bg/80 px-2 py-1 text-[0.72rem] text-zinc-300">
                  ⑂ {repo.forks_count || 0}
                </span>
              </div>
            </a>
          );
        })}
      </div>

      {/* Mobile: Compact single-line rows */}
      <div className="mt-4 flex flex-col gap-0 md:hidden">
        {visibleRepos.map((repo) => {
          const isFeatured =
            repo.name.toLowerCase().includes('builtbybugs') ||
            repo.name.toLowerCase().includes('dee');

          return (
            <a
              className={`flex items-center justify-between gap-3 border-b border-brand-border-subtle py-3 text-inherit no-underline transition-colors duration-150 hover:bg-white/[0.03] -mx-2 px-2 rounded-lg ${
                isFeatured ? 'bg-brand-green/[0.03]' : ''
              }`}
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              key={repo.id || repo.name}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[0.85rem] font-semibold text-white truncate">
                  {repo.name}
                </span>
                {repo.language && (
                  <span className="shrink-0 rounded-[0.3rem] border border-brand-turquoise/20 bg-brand-turquoise/10 px-1.5 py-0.5 text-[0.65rem] text-cyan-300">
                    {repo.language}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0 text-[0.7rem] text-subtle">
                <span className="text-brand-gold">★ {repo.stargazers_count || 0}</span>
                <span aria-hidden="true" className="text-brand-turquoise">
                  →
                </span>
              </div>
            </a>
          );
        })}
      </div>

      {/* Expand toggle */}
      {hasLimit && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-brand-border-subtle bg-brand-bg/60 px-4 py-2 text-[0.8rem] font-medium text-muted transition-colors hover:border-brand-turquoise/40 hover:text-white cursor-pointer"
          >
            {expanded ? 'Show less' : `Show all ${sortedRepos.length} repos`}
            <span
              className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            >
              ↓
            </span>
          </button>
        </div>
      )}
    </section>
  );
}

export default RepositoryGrid;
