import { useEffect, useState } from "react";
import { getCodingActivity, getCodingSummary } from "../../api/fetchApi.js";
import ErrorState from "../miscellaneous/ErrorState.jsx";
import LoadingState from "../miscellaneous/LoadingState.jsx";
import WidgetShell from "../miscellaneous/WidgetShell.jsx";

function CodingOverviewSlide({ summary }) {
    const languages = (summary.languages || []).slice(0, 3);

    return (
        <div className="flex h-full flex-col justify-between">
            <div className="flex flex-col gap-2.5">
                <div className="grid grid-cols-2 gap-2.5">
                    <span className="flex min-w-0 flex-col gap-0.5 rounded-[0.55rem] border border-[#9eaedb]/12 bg-page-bg/48 p-2.5 text-[0.74rem] text-muted">
                        <strong className="text-lg font-bold text-white">{summary.totalMinutes ?? 0}</strong>
                        Minutes Logged
                    </span>
                    <span className="flex min-w-0 flex-col gap-0.5 rounded-[0.55rem] border border-[#9eaedb]/12 bg-page-bg/48 p-2.5 text-[0.74rem] text-muted">
                        <strong className="text-lg font-bold text-white">{summary.dailyAverageText || "n/a"}</strong>
                        Daily Average
                    </span>
                </div>

                <div className="flex flex-col gap-2">
                    {languages.map((language) => (
                        <div className="grid gap-1" key={language.name}>
                            <div className="flex justify-between gap-4 text-xs text-[#d7deed]">
                                <span className="font-medium">{language.name}</span>
                                <small className="text-subtle text-[0.7rem]">{language.text || `${language.percent}%`}</small>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-page-bg/72">
                                <span className="block h-full rounded-[inherit] bg-linear-to-r from-accent-strong to-[#60a5fa] transition-all duration-500" style={{ width: `${language.percent || 0}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-2 border-t border-[#9eaedb]/10">
                <p className="m-0 truncate text-[0.72rem] text-muted">
                    <span className="text-subtle">Activity status:</span> {summary.totalText || "Active cadence"}
                </p>
            </div>
        </div>
    );
}

function CodingSpecificSlide({ summary, activity }) {
    const projects = (summary.projects || []).slice(0, 3);
    const editors = (summary.editors || []).slice(0, 2);

    return (
        <div className="flex h-full flex-col justify-between">
            <div className="flex flex-col gap-2.5">
                <div className="grid grid-cols-2 gap-2.5">
                    <span className="flex min-w-0 flex-col gap-0.5 rounded-[0.55rem] border border-[#9eaedb]/12 bg-page-bg/48 p-2.5 text-[0.74rem] text-muted">
                        <strong className="text-lg font-bold text-white">{projects.length}</strong>
                        Active Projects
                    </span>
                    <span className="flex min-w-0 flex-col gap-0.5 rounded-[0.55rem] border border-[#9eaedb]/12 bg-page-bg/48 p-2.5 text-[0.74rem] text-muted">
                        <strong className="text-lg font-bold text-white">{editors[0]?.name || "VS Code"}</strong>
                        Primary Editor
                    </span>
                </div>

                <div className="flex flex-col gap-1.5">
                    {projects.map((project) => (
                        <div className="flex items-center justify-between gap-3 border-b border-[#9eaedb]/10 pb-1 text-xs text-[#d7deed]" key={project.name}>
                            <span className="truncate font-medium">{project.name}</span>
                            <small className="shrink-0 text-subtle text-[0.7rem]">{project.text || `${project.totalMinutes} min`}</small>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-2 border-t border-[#9eaedb]/10">
                <p className="m-0 truncate text-[0.72rem] text-muted">
                    <span className="text-subtle">Environment:</span> {editors.map((editor) => editor.name).join(", ") || "Active workspace"}
                </p>
            </div>
        </div>
    );
}

function CodingTracker() {
    const [summary, setSummary] = useState(null);
    const [activity, setActivity] = useState(null);
    const [slide, setSlide] = useState(0);
    const [error, setError] = useState(null);
    const [isPaused, setIsPaused] = useState(false);

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
        if (isPaused) return;
        const timer = setInterval(() => {
            setSlide((current) => (current + 1) % 2);
        }, 8000);

        return () => clearInterval(timer);
    }, [isPaused]);

    const indicators = (
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Coding Tracker Slides">
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
            number="W2"
            eyebrow="Code Log"
            title="Coding tracker"
            indicators={indicators}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {error && <ErrorState label="Unable to load coding activity." />}
            {!error && (!summary || !activity) && <LoadingState label="Loading coding activity..." />}
            {!error && summary && activity && (
                <div className="relative grid grid-cols-1 grid-rows-1 flex-1 min-h-0">
                    <div className={`col-start-1 row-start-1 flex flex-col justify-between transition-opacity duration-500 ease-in-out ${slide === 0 ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}>
                        <CodingOverviewSlide summary={summary} />
                    </div>
                    <div className={`col-start-1 row-start-1 flex flex-col justify-between transition-opacity duration-500 ease-in-out ${slide === 1 ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}>
                        <CodingSpecificSlide summary={summary} activity={activity} />
                    </div>
                </div>
            )}
        </WidgetShell>
    );
}

export default CodingTracker;
