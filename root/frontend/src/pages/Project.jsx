import { useEffect, useState } from "react";
import { getCodingSummary, fetchGitHubSummary, fetchGitContributions } from "../api/fetchApi.js";
import CodingSummary from "../components/coding/CodingSummary.jsx";
import ErrorState from "../components/miscellaneous/ErrorState.jsx";
import GitHubShowcase from "../components/github/GitHubShowcase.jsx";
import ContributionHeatmap from "../components/github/ContributionHeatmap.jsx";
import LoadingState from "../components/miscellaneous/LoadingState.jsx";
import RepositoryGrid from "../components/github/RepositoryGrid.jsx";
import { pages } from "../data/pages.js";

function Project() {
    const page = pages["/project"];

    const [githubSummary, setGithubSummary] = useState(null);
    const [heatmap, setHeatmap] = useState(null);
    const [codingSummary, setCodingSummary] = useState(null);
    const [error, setError] = useState(null);

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

    return (
        <>
            <section className="max-w-190">
                <p className="mb-5 text-md font-extrabold uppercase tracking-[0.14em] text-accent">{page.eyebrow}</p>
                <h1 className="mb-6 max-w-182.5 text-[clamp(2.75rem,7vw,5.7rem)] font-bold leading-[0.98] tracking-[-0.055em] text-emerald-100">{page.title}</h1>
                <p className="mb-8 max-w-162.5 text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75] text-muted">{page.description}</p>
            </section>

            {error && <ErrorState label="Unable to load project data." />}

            {!error && (!githubSummary || !heatmap || !codingSummary) ? (
                <LoadingState label="Loading project data..." />
            ) : (
                !error && (
                    <div className="mt-20 grid gap-5">
                        <GitHubShowcase summary={githubSummary} />
                        <RepositoryGrid repos={githubSummary.repos} />
                        <ContributionHeatmap
                            heatmap={heatmap}
                            profileUrl={githubSummary.user.html_url}
                        />
                        <CodingSummary summary={codingSummary} />
                    </div>
                )
            )}
        </>
    );
}

export default Project;
