import { useEffect, useState } from "react";
import { fetchGitHubSummary } from "../../api/fetchApi.js";
import ErrorState from "../ErrorState.jsx";
import LoadingState from "../LoadingState.jsx";
import WidgetShell from "../WidgetShell.jsx";

function GitHubProfileSlide({ summary }) {
    const { user } = summary;

    return (
        <div className="flex min-h-auto md:min-h-[240px] flex-col gap-4">
            <p className="m-0 text-[1.15rem] font-extrabold text-white">{user.login}</p>
            <p className="m-0 leading-relaxed text-[#99a4be]">{user.bio || "No bio available."}</p>

            <div className="grid grid-cols-3 gap-3">
                <span className="flex min-w-0 flex-col gap-1 rounded-[0.55rem] border border-[#9eaedb]/[0.12] bg-[#080b16]/[0.48] p-3 text-[0.76rem] text-[#99a4be]">
                    <strong className="text-xl font-bold text-white">{user.public_repos ?? 0}</strong>
                    Repos
                </span>
                <span className="flex min-w-0 flex-col gap-1 rounded-[0.55rem] border border-[#9eaedb]/[0.12] bg-[#080b16]/[0.48] p-3 text-[0.76rem] text-[#99a4be]">
                    <strong className="text-xl font-bold text-white">{user.followers ?? 0}</strong>
                    Followers
                </span>
                <span className="flex min-w-0 flex-col gap-1 rounded-[0.55rem] border border-[#9eaedb]/[0.12] bg-[#080b16]/[0.48] p-3 text-[0.76rem] text-[#99a4be]">
                    <strong className="text-xl font-bold text-white">{user.following ?? 0}</strong>
                    Following
                </span>
            </div>

            <a className="w-fit text-[0.9rem] font-extrabold text-[#a7f3d0] no-underline hover:underline" href={user.html_url} target="_blank" rel="noreferrer">
                View GitHub profile
            </a>
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
        <div className="flex min-h-auto md:min-h-[240px] flex-col gap-4">
            <p className="m-0 text-[1.15rem] font-extrabold text-white">Repository stats</p>
            <div className="grid grid-cols-2 gap-3">
                <span className="flex min-w-0 flex-col gap-1 rounded-[0.55rem] border border-[#9eaedb]/[0.12] bg-[#080b16]/[0.48] p-3 text-[0.76rem] text-[#99a4be]">
                    <strong className="text-xl font-bold text-white">{repos.length}</strong>
                    Public
                </span>
                <span className="flex min-w-0 flex-col gap-1 rounded-[0.55rem] border border-[#9eaedb]/[0.12] bg-[#080b16]/[0.48] p-3 text-[0.76rem] text-[#99a4be]">
                    <strong className="text-xl font-bold text-white">{topRepos[0]?.stargazers_count ?? 0}</strong>
                    Top stars
                </span>
            </div>

            <div className="flex flex-col gap-2.5">
                {topRepos.map((repo) => (
                    <a className="flex items-center justify-between gap-4 border-b border-[#9eaedb]/10 pb-2.5 text-[#d7deed] no-underline hover:text-white" href={repo.html_url} target="_blank" rel="noreferrer" key={repo.id || repo.name}>
                        <span>{repo.name}</span>
                        <small className="text-[#78849f]">{repo.language || "Unknown"} / {repo.stargazers_count || 0} stars</small>
                    </a>
                ))}
            </div>

            {latestRepo && (
                <p className="m-0 leading-relaxed text-[#99a4be]">
                    Latest update: {latestRepo.name}
                </p>
            )}
        </div>
    );
}

function GitHubWidget() {
    const [summary, setSummary] = useState(null);
    const [slide, setSlide] = useState(0);
    const [error, setError] = useState(null);

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
        const timer = setInterval(() => {
            setSlide((current) => (current + 1) % 2);
        }, 7000);

        return () => clearInterval(timer);
    }, []);

    return (
        <WidgetShell
            number="W1"
            eyebrow="GitHub"
            title="Live repository signal"
            // status={`${slide + 1} / 2`}
        >
            {error && <ErrorState label="Unable to load GitHub data." />}
            {!error && !summary && <LoadingState label="Loading GitHub..." />}
            {!error && summary && (
                slide === 0
                    ? <GitHubProfileSlide summary={summary} />
                    : <GitHubRepoStatsSlide summary={summary} />
            )}
        </WidgetShell>
    );
}

export default GitHubWidget;
