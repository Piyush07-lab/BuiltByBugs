import { useEffect, useState } from "react";
import { bulletinItems } from "../../data/bulletin.js";
import WidgetShell from "../miscellaneous/WidgetShell.jsx";

function BulletinWidget() {
    const [index, setIndex] = useState(0);
    const item = bulletinItems[index];

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((current) => (current + 1) % bulletinItems.length);
        }, 7000);

        return () => clearInterval(timer);
    }, []);

    return (
        <WidgetShell
            number="W3"
            eyebrow={item.tag}
            title="Activity bulletin"
            status={`${index + 1} / ${bulletinItems.length}`}
        >
            <div className="flex min-h-auto md:min-h-60 flex-col gap-4">
                <p className="m-0 text-[1.15rem] font-extrabold text-white">{item.title}</p>
                <p className="m-0 font-bold text-accent">{item.subtitle}</p>
                <p className="m-0 leading-relaxed text-muted">{item.description}</p>
                <p className="m-0 mt-auto border-t border-[#9eaedb]/12 pt-4 text-xs uppercase text-subtle">{item.date}</p>
            </div>
        </WidgetShell>
    );
}

export default BulletinWidget;
