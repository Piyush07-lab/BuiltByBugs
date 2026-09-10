import { useEffect, useState } from "react";
import { bulletinItems } from "../../data/bulletin.js";
import WidgetShell from "../miscellaneous/WidgetShell.jsx";

function BulletinWidget() {
    const [index, setIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const item = bulletinItems[index];

    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => {
            setIndex((current) => (current + 1) % bulletinItems.length);
        }, 7000);

        return () => clearInterval(timer);
    }, [isPaused]);

    const indicators = (
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Bulletin Slides">
            {bulletinItems.map((_, idx) => (
                <button
                    key={idx}
                    type="button"
                    role="tab"
                    aria-selected={index === idx}
                    aria-label={`Bulletin ${idx + 1}`}
                    onClick={() => setIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 focus:outline-hidden cursor-pointer ${
                        index === idx
                            ? "w-4 bg-accent"
                            : "w-1.5 bg-white/20 hover:bg-white/40"
                    }`}
                />
            ))}
        </div>
    );

    return (
        <WidgetShell
            number="W3"
            eyebrow={item.tag}
            title="Activity bulletin"
            indicators={indicators}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="relative grid grid-cols-1 grid-rows-1 flex-1 min-h-0">
                {bulletinItems.map((bulletin, idx) => (
                    <div
                        key={bulletin.id || idx}
                        className={`col-start-1 row-start-1 flex h-full flex-col justify-between transition-opacity duration-500 ease-in-out ${
                            index === idx ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                        }`}
                    >
                        <div className="flex flex-col gap-2">
                            <p className="m-0 text-[1.1rem] font-extrabold text-white">{bulletin.title}</p>
                            <p className="m-0 text-xs font-bold text-accent">{bulletin.subtitle}</p>
                            <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted">{bulletin.description}</p>
                        </div>
                        <div className="pt-2 border-t border-[#9eaedb]/10">
                            <p className="m-0 text-[0.72rem] uppercase tracking-wider text-subtle">{bulletin.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </WidgetShell>
    );
}

export default BulletinWidget;
