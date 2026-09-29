import { useEffect, useState, useCallback } from "react";
import { getCodingSummary, fetchGitHubSummary, fetchGitContributions } from "../api/fetchApi.js";
import CodingSummary from "../components/coding/CodingSummary.jsx";
import ErrorState from "../components/miscellaneous/ErrorState.jsx";
import GitHubShowcase from "../components/github/GitHubShowcase.jsx";
import ContributionHeatmap from "../components/github/ContributionHeatmap.jsx";
import LoadingState from "../components/miscellaneous/LoadingState.jsx";
import RepositoryGrid from "../components/github/RepositoryGrid.jsx";
import { pages } from "../data/pages.js";

const TABS = [
    { id: "github", label: "GitHub" },
    { id: "activity", label: "Activity" },
    { id: "code", label: "Code Log" },
];

function getInitialTab() {
    const hash = window.location.hash.replace("#", "");
    if (TABS.some((t) => t.id === hash)) return hash;
    return "github";
}

function Project() {
    const page = pages["/project"];

    const [githubSummary, setGithubSummary] = useState(null);
    const [heatmap, setHeatmap] = useState(null);
    const [codingSummary, setCodingSummary] = useState(null);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState(getInitialTab);

    const switchTab = useCallback((tabId) => {
        setActiveTab(tabId);
        window.history.replaceState(null, "", `#${tabId}`);
    }, []);

    // Sync hash changes (e.g. browser back/forward)
    useEffect(() => {
        const onHashChange = () => {
            const hash = window.location.hash.replace("#", "");
            if (TABS.some((t) => t.id === hash)) setActiveTab(hash);
        };
        window.addEventListener("hashchange", onHashChange);
        return () => window.removeEventListener("hashchange", onHashChange);
    }, []);

    useEffect(() => {
        async function loadProjectData() {
            try {
                const [githubData, heatmapData, codingData] = await Promise.all([
                    fetchGitHubSummary(),
                    fetchGitContributions(),
                    getCodingSummary()
                ]);

                setGithubSummary(githubData);
                setHeatmap(heatmapData);
                setCodingSummary(codingData);
            } catch (err) {
                setError(err);
            }
        }

        loadProjectData();
    }, []);

    const isLoaded = githubSummary && heatmap && codingSummary;

    return (
        <>
            <section className="max-w-190">
                <p className="mb-5 text-md font-extrabold uppercase tracking-[0.14em] text-accent">{page.eyebrow}</p>
                <h1 className="mb-6 max-w-182.5 text-[clamp(2.75rem,7vw,5.7rem)] font-bold leading-[0.98] tracking-[-0.055em] text-emerald-100">{page.title}</h1>
                <p className="mb-8 max-w-162.5 text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75] text-muted">{page.description}</p>
            </section>

            {error && <ErrorState label="Unable to load project data." />}

            {!error && !isLoaded ? (
                <LoadingState label="Loading project data..." />
            ) : (
                !error && (
                    <>
                        {/* ── Mobile Tab Bar ── */}
                        <nav
                            className="md:hidden sticky z-20 -mx-4 px-4 py-3 border-b border-[#9eaedb]/10 bg-[#080b16]/90 backdrop-blur-md"
                            style={{ top: '84px' }}
                            aria-label="Project sections"
                        >
                            <div className="flex gap-1">
                                {TABS.map((tab) => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        role="tab"
                                        aria-selected={activeTab === tab.id}
                                        onClick={() => switchTab(tab.id)}
                                        className={`flex-1 rounded-lg py-2 text-center text-[0.8rem] font-semibold transition-all duration-200 cursor-pointer ${
                                            activeTab === tab.id
                                                ? "bg-accent/12 text-white border border-accent/20"
                                                : "text-muted border border-transparent hover:bg-white/5 hover:text-white"
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </nav>

                        {/* ── Desktop: Linear stack (unchanged) ── */}
                        <div className="mt-20 hidden md:grid gap-5">
                            <GitHubShowcase summary={githubSummary} />
                            <RepositoryGrid repos={githubSummary.repos} />
                            <ContributionHeatmap
                                heatmap={heatmap}
                                profileUrl={githubSummary.user.html_url}
                            />
                            <CodingSummary summary={codingSummary} />
                        </div>

                        {/* ── Mobile: Tab content ── */}
                        <div className="mt-6 md:hidden">
                            {activeTab === "github" && (
                                <div className="grid gap-4 animate-[fadeIn_300ms_ease-out]">
                                    <GitHubShowcase summary={githubSummary} />
                                    <RepositoryGrid repos={githubSummary.repos} limit={4} />
                                </div>
                            )}

                            {activeTab === "activity" && (
                                <div className="animate-[fadeIn_300ms_ease-out]">
                                    <ContributionHeatmap
                                        heatmap={heatmap}
                                        profileUrl={githubSummary.user.html_url}
                                    />
                                </div>
                            )}

                            {activeTab === "code" && (
                                <div className="animate-[fadeIn_300ms_ease-out]">
                                    <CodingSummary summary={codingSummary} />
                                </div>
                            )}
                        </div>
                    </>
                )
            )}
        </>
    );
}

export default Project;
