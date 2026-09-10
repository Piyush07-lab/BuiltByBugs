function WidgetShell({ number, eyebrow, title, status, indicators, children, className = "", ...rest }) {
    return (
        <article 
            className={`flex flex-col justify-between min-h-auto md:h-98.75 rounded-2xl border border-[#9eaedb]/16 bg-linear-to-br from-[#11172a]/78 to-[#0d111f]/52 p-6 shadow-[0_1.5rem_4rem_rgba(0,0,0,0.16)] overflow-hidden ${className}`}
            {...rest}
        >
            <div className="flex items-center justify-between gap-4">
                <span className="mb-0 block text-xs font-extrabold uppercase tracking-[0.14em] text-subtle">{number}</span>
                {(indicators || status) && (
                    <div className="flex items-center gap-1.5">
                        {indicators || status}
                    </div>
                )}
            </div>

            <div className="mt-5 mb-4 block">
                {eyebrow && <p className="mb-1 text-[0.7rem] font-extrabold uppercase tracking-[0.12em] text-accent">{eyebrow}</p>}
                <h2 className="text-[1.1rem] font-bold text-white">{title}</h2>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
                {children}
            </div>
        </article>
    );
}

export default WidgetShell;
