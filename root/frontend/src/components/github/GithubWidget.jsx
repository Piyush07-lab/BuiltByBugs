import { useEffect, useState } from "react";
import { fetchGitHubSummary } from "../../api/fetchApi.js";
import ErrorState from "../miscellaneous/ErrorState.jsx";
import LoadingState from "../miscellaneous/LoadingState.jsx";
import WidgetShell from "../miscellaneous/WidgetShell.jsx";

function GitHubProfileSlide({ summary }) {
    const { user } = summary;

    return (
        <div className="flex h-full flex-col justify-between">
            <div className="flex flex-col gap-3">
                <div>
                    <p className="m-0 text-[1.1rem] font-extrabold text-white">{user.login}</p>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{user.bio || "No bio available."}</p>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                    <span className="flex min-w-0 flex-col gap-0.5 rounded-[0.55rem] border border-[#9eaedb]/12 bg-page-bg/48 p-2.5 text-[0.74rem] text-muted">
                        <strong className="text-lg font-bold text-white">{user.public_repos ?? 0}</strong>
                        Repos
                    </span>
                    <span className="flex min-w-0 flex-col gap-0.5 rounded-[0.55rem] border border-[#9eaedb]/12 bg-page-bg/48 p-2.5 text-[0.74rem] text-muted">
                        <strong className="text-lg font-bold text-white">{user.followers ?? 0}</strong>
                        Followers
                    </span>
                    <span className="flex min-w-0 flex-col gap-0.5 rounded-[0.55rem] border border-[#9eaedb]/12 bg-page-bg/48 p-2.5 text-[0.74rem] text-muted">
                        <strong className="text-lg font-bold text-white">{user.following ?? 0}</strong>
                        Following
                    </span>
                </div>
            </div>

            <div className="pt-2">
                <a className="inline-flex items-center gap-1.5 text-xs font-extrabold text-accent no-underline hover:underline" href={user.html_url} target="_blank" rel="noreferrer">
                    <span>View GitHub profile</span>
                    <span aria-hidden="true">→</span>
                </a>
            </div>
        </div>
    );
}

function GitHubRepoStatsSlide({ summary }) {
    const repos = [...(summary.repos || [])];
    const topRepos = repos
        .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
        .slice(0, 3);

    const latestRepo = repos
        .sort((a, b) => new Date(b.pushed_at || 0) - new Date(a.pushed_at || 0))[0];

    return (
        <div className="flex h-full flex-col justify-between">
            <div className="flex flex-col gap-2.5">
                <div className="grid grid-cols-2 gap-2.5">
                    <span className="flex min-w-0 flex-col gap-0.5 rounded-[0.55rem] border border-[#9eaedb]/12 bg-page-bg/48 p-2.5 text-[0.74rem] text-muted">
                        <strong className="text-lg font-bold text-white">{repos.length}</strong>
                        Public Repos
                    </span>
                    <span className="flex min-w-0 flex-col gap-0.5 rounded-[0.55rem] border border-[#9eaedb]/12 bg-page-bg/48 p-2.5 text-[0.74rem] text-muted">
                        <strong className="text-lg font-bold text-white">{topRepos[0]?.stargazers_count ?? 0}</strong>
                        Top Stars
                    </span>
                </div>

                <div className="flex flex-col gap-1.5">
                    {topRepos.map((repo) => (
                        <a className="flex items-center justify-between gap-3 border-b border-[#9eaedb]/10 pb-1 text-xs text-[#d7deed] no-underline hover:text-white transition-colors" href={repo.html_url} target="_blank" rel="noreferrer" key={repo.id || repo.name}>
                            <span className="truncate font-medium">{repo.name}</span>
                            <small className="shrink-0 text-subtle text-[0.7rem]">{repo.language || "Unknown"} · ★{repo.stargazers_count || 0}</small>
                        </a>
                    ))}
                </div>
            </div>

            {latestRepo && (
                <div className="pt-2 border-t border-[#9eaedb]/10">
                    <p className="m-0 truncate text-[0.72rem] text-muted">
                        <span className="text-subtle">Latest update:</span> {latestRepo.name}
                    </p>
                </div>
            )}
        </div>
    );
}

function GitHubWidget() {
    const [summary, setSummary] = useState(null);
    const [slide, setSlide] = useState(0);
    const [error, setError] = useState(null);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        async function loadGithub() {
            try {
                const summaryData = await fetchGitHubSummary();
                setSummary(summaryData);
            } catch (err) {
                setError(err);
            }
        }

        loadGithub();
    }, []);

    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => {
            setSlide((current) => (current + 1) % 2);
        }, 7000);

        return () => clearInterval(timer);
    }, [isPaused]);

    const indicators = (
        <div className="flex items-center gap-1.5" role="tablist" aria-label="GitHub Widget Slides">
            {[0, 1].map((idx) => (
                <button
                    key={idx}
                    type="button"
                    role="tab"
                    aria-selected={slide === idx}
                    aria-label={`Slide ${idx + 1}`}
                    onClick={() => setSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 focus:outline-hidden cursor-pointer ${
                        slide === idx
                            ? "w-4 bg-accent"
                            : "w-1.5 bg-white/20 hover:bg-white/40"
                    }`}
                />
            ))}
        </div>
    );

    return (
        <WidgetShell
            number="W1"
            eyebrow="GitHub"
            title="Live repository signal"
            indicators={indicators}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {error && <ErrorState label="Unable to load GitHub data." />}
            {!error && !summary && <LoadingState label="Loading GitHub..." />}
            {!error && summary && (
                <div className="relative grid grid-cols-1 grid-rows-1 flex-1 min-h-0">
                    <div className={`col-start-1 row-start-1 flex flex-col justify-between transition-opacity duration-500 ease-in-out ${slide === 0 ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}>
                        <GitHubProfileSlide summary={summary} />
                    </div>
                    <div className={`col-start-1 row-start-1 flex flex-col justify-between transition-opacity duration-500 ease-in-out ${slide === 1 ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}>
                        <GitHubRepoStatsSlide summary={summary} />
                    </div>
                </div>
            )}
        </WidgetShell>
    );
}

export default GitHubWidget;
