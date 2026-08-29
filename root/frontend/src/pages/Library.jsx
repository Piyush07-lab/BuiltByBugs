import { pages } from "../data/pages.js";

function Library() {
    const page = pages["/library"];

    return (
        <>
            <section className="max-w-[760px]">
                <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.14em] text-[#a7f3d0]">{page.eyebrow}</p>
                <h1 className="mb-6 max-w-[730px] text-[clamp(2.75rem,7vw,5.7rem)] font-bold leading-[0.98] tracking-[-0.055em] text-white">{page.title}</h1>
                <p className="mb-8 max-w-[650px] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75] text-[#99a4be]">{page.description}</p>
            </section>

            <section className="mt-16 grid grid-cols-1 gap-4 md:mt-28 md:grid-cols-3">
                <article className="min-h-auto md:min-h-[220px] rounded-2xl border border-[#9eaedb]/[0.16] bg-gradient-to-br from-[#11172a]/[0.78] to-[#0d111f]/[0.52] p-6 shadow-[0_1.5rem_4rem_rgba(0,0,0,0.16)]">
                    <h2 className="mb-2.5 text-[1.1rem] font-bold text-white">Articles</h2>
                    <p className="text-[0.9rem] leading-relaxed text-[#99a4be]">Technical notes and writeups will go here.</p>
                </article>

                <article className="min-h-auto md:min-h-[220px] rounded-2xl border border-[#9eaedb]/[0.16] bg-gradient-to-br from-[#11172a]/[0.78] to-[#0d111f]/[0.52] p-6 shadow-[0_1.5rem_4rem_rgba(0,0,0,0.16)]">
                    <h2 className="mb-2.5 text-[1.1rem] font-bold text-white">Analytics</h2>
                    <p className="text-[0.9rem] leading-relaxed text-[#99a4be]">GitHub, coding, and project stats can be shown here.</p>
                </article>

                <article className="min-h-auto md:min-h-[220px] rounded-2xl border border-[#9eaedb]/[0.16] bg-gradient-to-br from-[#11172a]/[0.78] to-[#0d111f]/[0.52] p-6 shadow-[0_1.5rem_4rem_rgba(0,0,0,0.16)]">
                    <h2 className="mb-2.5 text-[1.1rem] font-bold text-white">Documents</h2>
                    <p className="text-[0.9rem] leading-relaxed text-[#99a4be]">Resume, reports, case studies, and references.</p>
                </article>
            </section>
        </>
    );
}

export default Library;
