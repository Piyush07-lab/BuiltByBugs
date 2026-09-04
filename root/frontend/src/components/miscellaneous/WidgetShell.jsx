function WidgetShell({ number, eyebrow, title, status, children }) {
    return (
        <article className="flex flex-col min-h-auto md:min-h-55 rounded-2xl border border-[#9eaedb]/16 bg-linear-to-br from-[#11172a]/78 to-[#0d111f]/52 p-6 shadow-[0_1.5rem_4rem_rgba(0,0,0,0.16)]">
            <div className="flex items-start justify-between gap-4">
                <span className="mb-0 block text-xs font-extrabold uppercase tracking-[0.14em] text-subtle">{number}</span>
                {/* {status && <span className="rounded-[0.4rem] border border-[#a7f3d0]/[0.16] px-2 py-1 text-[0.72rem] text-[#99a4be]">{status}</span>} */}
            </div>

            <div className="mt-8 block">
                {eyebrow && <p className="mb-1.5 text-[0.7rem] font-extrabold uppercase tracking-[0.12em] text-accent">{eyebrow}</p>}
                <h2 className="text-[1.1rem] font-bold text-white">{title}</h2>
            </div>

            <div className="flex-1">
                {children}
            </div>
        </article>
    );
}

export default WidgetShell;
