import { useState, useEffect } from 'react';
import { useDrawer } from "../drawer";

const SERVICES = ['Full-Time Job', 'Contract', 'Standalone Projects', 'Web Services'];

export function AutoSwitchHireTag() {
    const [index, setIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const { openDrawer } = useDrawer();

    useEffect(() => {
        if (isPaused) return;

        const timer = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % SERVICES.length);
        }, 2500);
        return () => clearInterval(timer);
    }, [isPaused]);

    const currentService = SERVICES[index];

    const handleClick = (e) => {
        e.preventDefault();
        openDrawer('hire', { service: currentService });
    };

    return (
        <div className="flex items-center gap-2">
            <style>{`
                @keyframes pulseSlide {
                  0% {
                    transform: translateX(-100%);
                  }
                  100% {
                    transform: translateX(200%);
                  }
                }
            `}
            </style>


            <a
                href={`#contact?type=${encodeURIComponent(currentService)}`}
                onClick={handleClick}
                onMouseEnter={() => { setIsPaused(true); }}
                onMouseLeave={() => { setIsPaused(false); }}
                className="group relative px-2.5 py-1 text-xs font-semibold text-emerald-400 bg-emerald-950/20 rounded border border-emerald-900/40 hover:bg-emerald-950/50 transition-all overflow-hidden"
            >
                {currentService}

                <span className="absolute bottom-0 left-0 h-0.5 w-full bg-emerald-500/20" />

                <span className="absolute bottom-0 left-0 h-0.5 w-1/2 bg-linear-to-r from-transparent via-emerald-400 to-transparent" style={{
                    animation: 'pulseSlide 2.5s ease-in-out infinite',
                 }} />
            </a>
        </div>
    );
}