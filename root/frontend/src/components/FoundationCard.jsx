

export function FoundationCard({ number, title, description }) {
    return (
        <article className="min-h-auto md:min-h-[220px] rounded-2xl border border-[#9eaedb]/[0.16] bg-gradient-to-br from-[#11172a]/[0.78] to-[#0d111f]/[0.52] p-6 shadow-[0_1.5rem_4rem_rgba(0,0,0,0.16)]">
            <span className="mb-8 md:mb-14 block text-xs font-extrabold uppercase tracking-[0.14em] text-[#78849f]">{number}</span>
            <h2 className="mb-2.5 text-[1.1rem] font-bold text-white">{title}</h2>
            <p className="text-[0.9rem] leading-relaxed text-[#99a4be]">{description}</p>
        </article>
    );
}