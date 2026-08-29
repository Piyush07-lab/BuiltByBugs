import { useState, useEffect } from 'react';

const SERVICES = ['Full-Time Job', 'Contract', 'Standalone Projects', 'Web Services'];

export function AutoSwitchHireTag() {
    const [index, setIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;

        const timer = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % SERVICES.length);
        }, 2500);
        return () => clearInterval(timer);
    }, [isPaused]);

    const currentService = SERVICES[index];

    return (
        <div className="flex items-center gap-2">
            <a
                href={`#contact?type=${encodeURIComponent(currentService)}`}
                onMouseEnter={() => {setIsPaused(true)}}
                onMouseLeave={() => {setIsPaused(false)}}
                className="px-2.5 py-1 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 rounded transition-all hover:border-emerald-400"
            >
                {currentService}
            </a>
        </div>
    );
}