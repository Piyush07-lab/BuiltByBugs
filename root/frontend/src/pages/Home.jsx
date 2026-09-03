import { pages } from "../data/pages.js";
import { AutoSwitchHireTag } from "../components/contact/Services.jsx";
import AlternatingStoryRow from "../components/layout/AlternatingStoryRow.jsx";
import CodingTracker from "../components/coding/CodingTracker.jsx";
import BulletinWidget from "../components/bulletin/BulletinWidget.jsx";
import GitHubWidget from "../components/github/GithubWidget.jsx";
import TechStackBento from "../components/tech/TechStackBento.jsx";

function Home() {
    const page = pages["/"];

    return (
        <>
            {/* Hero Section */}
            <section className="max-w-190 mt-12 sm:mt-16 md:mt-[14vh] lg:mt-[16vh]">
                <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.14em] text-accent">{page.eyebrow}</p>
                <h1 className="mb-6 max-w-182.5 text-[clamp(2.75rem,7vw,5.7rem)] font-bold leading-[0.98] tracking-[-0.055em] text-white">{page.title}</h1>
                <p className="mb-8 max-w-162.5 text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75] text-muted">{page.description}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.9rem] text-[#d7deed]">
                    <AutoSwitchHireTag/>
                </div>
            </section>

            {/* Alternating Narrative Sections */}
            <div className="mt-28 space-y-28 md:mt-44 md:space-y-44 lg:mt-56 lg:space-y-56">
                {/* 01: Dev Activity */}
                <AlternatingStoryRow
                    index="01"
                    tag="Discipline & Shipping"
                    title="Continuous Code Cadence"
                    description="Tracking daily programming sessions, weekly volume, and language allocations in real-time."
                    linkText="View full activity log"
                    linkHref="/project"
                    reverse={false}
                >
                    <CodingTracker />
                </AlternatingStoryRow>

                {/* 02: Real-time Notes & Broadcast */}
                <AlternatingStoryRow
                    index="02"
                    tag="Live Signals & Notes"
                    title="Activity Bulletin"
                    description="Rotating logs, technical announcements, and project milestones tracked as they occur."
                    reverse={true}
                >
                    <BulletinWidget />
                </AlternatingStoryRow>

                {/* 03: Source & Releases */}
                <AlternatingStoryRow
                    index="03"
                    tag="Repositories & Signals"
                    title="Transparent Production"
                    description="Active repository states, latest commits, and direct development updates synced live."
                    linkText="Browse GitHub"
                    linkHref="https://github.com/Piyush07-lab"
                    reverse={false}
                >
                    <GitHubWidget />
                </AlternatingStoryRow>
            </div>

            {/* Dedicated Full-Width Tech Stack Showcase */}
            <div className="mt-28 md:mt-44 lg:mt-56">
                <TechStackBento />
            </div>
        </>
    );
}

export default Home;
