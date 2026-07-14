const REVEAL_SELECTOR = "[data-reveal]";

const MOTION = {
    duration: 260,
    distance: 18,
    easing: "cubic-bezier(.2,.8,.2,1)"
};

const prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let revealObserver = null;

export function initMotion() {

    if (prefersReducedMotion) return;

    initRevealObserver();

}

function initRevealObserver() {

    revealObserver = new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                reveal(entry.target);

                revealObserver.unobserve(entry.target);

            });

        },

        {
            threshold: .12,
            rootMargin: "0px 0px -80px 0px"
        }

    );

    document.querySelectorAll(REVEAL_SELECTOR)
        .forEach(element => {

            prepare(element);

            revealObserver.observe(element);

        });

}

/* ==========================================================
   Lazy Loading Engine
========================================================== */

const lazyObserver = new IntersectionObserver(

    async entries => {

        for (const entry of entries) {

            if (!entry.isIntersecting) continue;

            const element = entry.target;

            const loader = lazyRegistry.get(element);

            if (!loader) continue;

            lazyObserver.unobserve(element);

            showSkeleton(element);

            try {

                const widget = await loader();

                widget.render();

                await fadeIn(element);
                
            } catch (error) {

                console.error("Lazy loader failed:", error);

            }

        }

    },

    {
        rootMargin: "150px"
    }

);

const lazyRegistry = new Map();

export function registerLazy(element, loader) {

    if (!element) return;

    lazyRegistry.set(element, loader);

    lazyObserver.observe(element);

}

export function showSkeleton(container) {

    container.replaceChildren();

    const wrapper = document.createElement("div");

    wrapper.className =
        `${prefersReducedMotion ? "" : "animate-pulse"} flex h-full flex-col`;

    for (let i = 0; i < 5; i++) {

        const line = document.createElement("div");

        line.className =
            "mb-4 h-5 rounded bg-slate-800";

        line.style.width =
            `${55 + Math.random() * 35}%`;

        wrapper.append(line);

    }

    const body = document.createElement("div");

    body.className =
        "mt-auto h-32 rounded-xl bg-slate-900";

    wrapper.append(body);

    container.append(wrapper);

}

function prepare(element) {

    // element.animate(
    //     [
    //         {
    //             opacity: 0,
    //             transform: `translateY(${MOTION.distance}px)`
    //         }
    //     ],
    //     {
    //         duration: 1,
    //         fill: "forwards"
    //     }
    // );

    element.style.opacity = "0";
    element.style.transform = `translateY(${MOTION.distance}px)`;

}

function reveal(element) {

    element.animate(

        [
            {
                opacity: 0,
                transform: `translateY(${MOTION.distance}px)`
            },

            {
                opacity: 1,
                transform: "translateY(0)"
            }

        ],

        {
            duration: MOTION.duration,
            easing: MOTION.easing,
            fill: "forwards"
        }

    );

}

export function fadeIn(element) {

    if (prefersReducedMotion)
        return Promise.resolve();

    return element.animate(
        [
            { opacity: 0 },
            { opacity: 1 }
        ],
        {
            duration: MOTION.duration,
            easing: MOTION.easing,
            fill: "forwards"
        }
    ).finished;

}

export function fadeOut(element) {

    if (prefersReducedMotion) return Promise.resolve();

    return element.animate(

        [
            { opacity: 1 },
            { opacity: 0 }
        ],

        {
            duration: 180,
            easing: MOTION.easing,
            fill: "forwards"
        }

    ).finished;

}