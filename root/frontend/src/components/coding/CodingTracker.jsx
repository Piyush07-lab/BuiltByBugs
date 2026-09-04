import { useEffect, useState } from "react";
import { getCodingActivity, getCodingSummary } from "../../api/fetchApi.js";
import ErrorState from "../miscellaneous/ErrorState.jsx";
import LoadingState from "../miscellaneous/LoadingState.jsx";
import WidgetShell from "../miscellaneous/WidgetShell.jsx";

function CodingOverviewSlide({ summary }) {
    const languages = (summary.languages || []).slice(0, 4);

    return (
        <div className="flex min-h-auto md:min-h-60 flex-col gap-4">
            <p className="m-0 text-[1.15rem] font-extrabold text-white">{summary.totalText || "Coding activity"}</p>
            <div className="grid grid-cols-2 gap-3">
                <span className="flex min-w-0 flex-col gap-1 rounded-[0.55rem] border border-[#9eaedb]/12 bg-page-bg/48 p-3 text-[0.76rem] text-muted">
                    <strong className="text-xl font-bold text-white">{summary.totalMinutes ?? 0}</strong>
                    Minutes
                </span>
                <span className="flex min-w-0 flex-col gap-1 rounded-[0.55rem] border border-[#9eaedb]/12 bg-page-bg/48 p-3 text-[0.76rem] text-muted">
                    <strong className="text-xl font-bold text-white">{summary.dailyAverageText || "n/a"}</strong>
                    Daily avg
                </span>
            </div>

            <div className="flex flex-col gap-2.5">
                {languages.map((language) => (
                    <div className="grid gap-1.5" key={language.name}>
                        <div className="flex justify-between gap-4 text-[0.86rem] text-[#d7deed]">
                            <span>{language.name}</span>
                            <small className="text-subtle">{language.text || `${language.percent}%`}</small>
                        </div>
                        <div className="h-[0.45rem] overflow-hidden rounded-full bg-page-bg/72">
                            <span className="block h-full rounded-[inherit] bg-linear-to-r from-accent-strong to-[#60a5fa]" style={{ width: `${language.percent || 0}%` }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function CodingSpecificSlide({ summary }) {
    const projects = (summary.projects || []).slice(0, 3);
    const editors = (summary.editors || []).slice(0, 2);

    return (
        <div className="flex min-h-auto md:min-h-60 flex-col gap-4">
            <p className="m-0 text-[1.15rem] font-extrabold text-white">Specific data</p>

            <div className="flex flex-col gap-2.5">
                {projects.map((project) => (
                    <span className="flex items-center justify-between gap-4 border-b border-[#9eaedb]/10 pb-2.5 text-[#d7deed]" key={project.name}>
                        <span>{project.name}</span>
                        <small className="text-subtle">{project.text || `${project.totalMinutes} min`}</small>
                    </span>
                ))}
            </div>

            <p className="m-0 leading-relaxed text-muted">
                Editor: {editors.map((editor) => editor.name).join(", ") || "Not available"}
            </p>
        </div>
    );
}

function CodingTracker() {
    const [summary, setSummary] = useState(null);
    const [activity, setActivity] = useState(null);
    const [slide, setSlide] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadCoding() {
            try {
                const [summaryData, activityData] = await Promise.all([
                    getCodingSummary(),
                    getCodingActivity()
                ]);

                setSummary(summaryData);
                setActivity(activityData);
            } catch (err) {
                setError(err);
            }
        }

        loadCoding();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setSlide((current) => (current + 1) % 2);
        }, 8000);

        return () => clearInterval(timer);
    }, []);

    return (
        <WidgetShell
            number="W2"
            eyebrow="Code Log"
            title="Coding tracker"
            status={`${slide + 1} / 2`}
        >
            {error && <ErrorState label="Unable to load coding activity." />}
            {!error && (!summary || !activity) && <LoadingState label="Loading coding activity..." />}
            {!error && summary && activity && (
                slide === 0
                    ? <CodingOverviewSlide summary={summary} />
                    : <CodingSpecificSlide summary={summary} activity={activity} />
            )}
        </WidgetShell>
    );
}

export default CodingTracker;
