import { pages } from "../data/pages.js";
import { AutoSwitchHireTag } from "../components/contact/Services.jsx";
import BulletinWidget from "../components/bulletin/BulletinWidget.jsx";
import CodingTracker from "../components/coding/CodingTracker.jsx";
import GitHubWidget from "../components/github/GithubWidget.jsx";

function Home() {
    const page = pages["/"];
    const autoSwitch = AutoSwitchHireTag()

    return (
        <>
            <section className="max-w-[760px]">
                <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.14em] text-[#a7f3d0]">{page.eyebrow}</p>
                <h1 className="mb-6 max-w-[730px] text-[clamp(2.75rem,7vw,5.7rem)] font-bold leading-[0.98] tracking-[-0.055em] text-white">{page.title}</h1>
                <p className="mb-8 max-w-[650px] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75] text-[#99a4be]">{page.description}</p>
                <p className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.9rem] text-[#d7deed]">
                    <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-[#a7f3d0]">Hire for :</span>
                    <a href="">
                        {autoSwitch}
                    </a>
                </p>
            </section>

            <section className="mt-16 grid grid-cols-1 gap-4 md:mt-28 md:grid-cols-3" aria-label="Portfolio activity widgets">
                <GitHubWidget />
                <CodingTracker />
                <BulletinWidget />
            </section>
        </>
    );
}

export default Home;
