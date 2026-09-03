export default function AlternatingStoryRow({
    index,
    tag,
    title,
    description,
    linkText,
    linkHref,
    reverse = false,
    children
}) {
    return (
        <section className="relative my-20 md:my-32">
            <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
                
                {/* Text Block: Always first on mobile; toggles order on desktop */}
                <div className={`relative ${reverse ? "md:order-2" : "md:order-1"}`}>
                    <span 
                        aria-hidden="true" 
                        className="pointer-events-none absolute -top-12 -left-4 select-none text-7xl font-black text-white/5 md:-top-16 md:text-8xl"
                    >
                        {index}
                    </span>

                    <div className="relative z-10">
                        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.14em] text-accent">
                            {tag}
                        </p>
                        <h2 className="mb-4 text-2xl font-bold tracking-[-0.03em] text-white md:text-3xl lg:text-4xl">
                            {title}
                        </h2>
                        <p className="mb-6 max-w-md text-sm leading-relaxed text-muted md:text-base">
                            {description}
                        </p>
                        {linkText && (
                            <a
                                href={linkHref}
                                className="group inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-accent"
                            >
                                {linkText}
                                <span className="transition-transform group-hover:translate-x-1">→</span>
                            </a>
                        )}
                    </div>
                </div>

                {/* Widget Container: Rendered beneath text on mobile */}
                <div className={`flex w-full justify-center ${reverse ? "md:order-1" : "md:order-2"}`}>
                    <div className="w-full">
                        {children}
                    </div>
                </div>

            </div>
        </section>
    );
}
