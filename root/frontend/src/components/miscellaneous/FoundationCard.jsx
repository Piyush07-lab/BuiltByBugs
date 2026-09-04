

export function FoundationCard({ number, title, description }) {
    return (
        <article className="min-h-auto md:min-h-55 rounded-2xl border border-[#9eaedb]/16 bg-linear-to-br from-[#11172a]/78 to-[#0d111f]/52 p-6 shadow-[0_1.5rem_4rem_rgba(0,0,0,0.16)]">
            <span className="mb-8 md:mb-14 block text-xs font-extrabold uppercase tracking-[0.14em] text-subtle">{number}</span>
            <h2 className="mb-2.5 text-[1.1rem] font-bold text-white">{title}</h2>
            <p className="text-[0.9rem] leading-relaxed text-muted">{description}</p>
        </article>
    );
}