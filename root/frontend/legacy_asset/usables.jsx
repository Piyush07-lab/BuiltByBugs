import { useEffect, useState } from "react";

export const legacyNavItems = [
    ["Home", "/"],
    ["Library", "/library"],
    ["Projects", "/project"],
];

export const legacyBulletinItems = [
    {
        id: 1,
        tag: "Current Focus",
        title: "Building the Personal Website",
        subtitle: "Frontend Development",
        description:
            "Working on the homepage widgets, modular UI architecture and dynamic content rendering.",
        date: "Today",
    },
    {
        id: 2,
        tag: "Latest Milestone",
        title: "Compiler Pipeline Completed",
        subtitle: "AST Rule Engine",
        description:
            "Finished the parser, analyzers, project model and markdown report generation pipeline.",
        date: "Recently",
    },
    {
        id: 3,
        tag: "In Progress",
        title: "Rule Engine Development",
        subtitle: "Architecture Analysis",
        description:
            "Implementing diagnostics and validation rules for source code analysis using custom AST traversal.",
        date: "Active",
    },
    {
        id: 4,
        tag: "Next Objective",
        title: "Development Dashboard",
        subtitle: "Activity Widgets",
        description:
            "Integrating GitHub statistics, coding tracker and bulletin system into the homepage dashboard.",
        date: "Upcoming",
    },
    {
        id: 5,
        tag: "Long-Term Goal",
        title: "Developer Platform",
        subtitle: "BuiltByBugs",
        description:
            "Expanding the portfolio into a platform featuring live projects, developer tools and AI-assisted services.",
        date: "Roadmap",
    },
];

export const legacyCodingTrackerData = {
    today: {
        project: "BuiltByBugs",
        hours: 4.8,
    },
    streak: {
        current: 12,
    },
    weekly: {
        commits: 42,
        filesChanged: 18,
    },
    languages: [
        { name: "JavaScript", percent: 62 },
        { name: "HTML", percent: 21 },
        { name: "CSS", percent: 11 },
        { name: "Node.js", percent: 6 },
    ],
    lastActive: "14 minutes ago",
    currentProject: "BuiltByBugs",
    activity: [
        { day: "Mon", hours: 2.4, percent: 40 },
        { day: "Tue", hours: 5.1, percent: 85 },
        { day: "Wed", hours: 4.2, percent: 70 },
        { day: "Thu", hours: 6.0, percent: 100 },
        { day: "Fri", hours: 3.7, percent: 62 },
        { day: "Sat", hours: 1.9, percent: 32 },
        { day: "Sun", hours: 4.8, percent: 80 },
    ],
    recentSessions: [
        { project: "BuiltByBugs", duration: "2h 18m" },
        { project: "AST Rule Engine", duration: "1h 42m" },
        { project: "GitHub Widget", duration: "54m" },
    ],
};

export const legacyBuildTags = [
    "JavaScript (ES Modules)",
    "Node.js",
    "Backend APIs",
    "AST Analysis",
    "Rule Engine Design",
    "Automation",
    "System Architecture",
    "REST APIs",
    "Git & GitHub",
];

export const legacyProjects = [
    {
        title: "BuiltByBugs",
        desc: "Personal portfolio showcasing custom frontend, backend APIs and handcrafted UI architecture.",
        tech: "HTML | CSS | JavaScript | Node.js",
        imageSrc: "../../../temporary_/frontend/assets/B3Thumbnail.png",
        status: "Live",
    },
    {
        title: "AST Rule Engine",
        desc: "A custom Abstract Syntax Tree rule engine focused on source-code analysis and transformation.",
        tech: "JavaScript | Node.js | AST",
        imageSrc: "../../../temporary_/frontend/assets/astThumbnail.png",
        status: "In Progress",
        github: "https://github.com/Piyush07-lab/ast",
    },
    {
        title: "Job Portal",
        desc: "Recruitment platform featuring resume evaluation and ATS analysis.",
        tech: "React | Express | MongoDB",
        imageSrc: "../../../temporary_/frontend/assets/thumbnail.png",
        status: "In Progress",
        live: "https://job-portal-eight-roan.vercel.app/",
        github: "https://github.com/PrashantMishra10232/Job_Portal",
    },
    {
        title: "Music Application",
        desc: "Modern music streaming application with a clean listening experience.",
        tech: "React | Node.js",
        status: "Planning",
    },
];

export const legacyArticles = [
    {
        id: "ast-engine",
        tag: "Engineering",
        title: "Why I Built My Own AST Engine",
        body:
            "Building an Abstract Syntax Tree engine from scratch taught me far more about parsing, traversal and maintainable software architecture than relying on existing tooling ever could. The modular pipeline is designed for diagnostics, custom rules and future source transformations.",
    },
    {
        id: "deterministic-systems",
        tag: "Architecture",
        title: "Designing Deterministic Systems",
        body:
            "Given the same inputs, a system should always produce the same output. Clear data flow, explicit state transitions and immutable histories make complex applications easier to debug, test and maintain.",
    },
    {
        id: "learning-through-building",
        tag: "Philosophy",
        title: "Learning Through Building",
        body:
            "I learn best by building software instead of collecting tutorials. Each project becomes a record of decisions, trade-offs and lessons that strengthen engineering judgement.",
    },
];

function drawLegacyBackground(canvas, main) {
    const ctx = canvas.getContext("2d");

    if (!ctx || !main) {
        return;
    }

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, "#13091F");
    bg.addColorStop(1, "#050507");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const glow = ctx.createRadialGradient(w * 0.35, h * 0.08, 0, w * 0.35, h * 0.08, 700);
    glow.addColorStop(0, "rgba(255,0,200,.75)");
    glow.addColorStop(0.45, "rgba(170,0,255,.45)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(
        w * (0.95 + Math.random() * 0.2),
        h * (0.45 + Math.random() * 0.2),
        700 + Math.random() * 400,
        Math.PI * 0.9,
        Math.PI * 1.7,
    );
    ctx.stroke();
    ctx.restore();

    ctx.save();
    const cx = w * (0.6 + Math.random() * 0.3);
    const cy = h * (0.45 + Math.random() * 0.35);
    const radius = 350 + Math.random() * 450;
    const glow3 = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    const hue2 = 220 + Math.random() * 120;
    glow3.addColorStop(0, `hsla(${hue2},100%,65%,0.16)`);
    glow3.addColorStop(0.35, `hsla(${hue2},100%,55%,0.08)`);
    glow3.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow3;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();

    const ribbon = {
        y: h * 0.08 + (Math.random() - 0.5) * 80,
        width: 140 + Math.random() * 220,
        thickness: 80 + Math.random() * 120,
        slope: 260 + Math.random() * 180,
        endOffset: 180 + Math.random() * 220,
        opacity: 0.35 + Math.random() * 0.35,
        hue: 315 + Math.random() * 20,
    };

    const x = w * 0.22;
    ctx.beginPath();
    ctx.moveTo(x - ribbon.width, ribbon.y);
    ctx.lineTo(x + ribbon.width, ribbon.y);
    ctx.lineTo(w + ribbon.endOffset, ribbon.y + ribbon.slope);
    ctx.lineTo(w + ribbon.endOffset - ribbon.thickness, ribbon.y + ribbon.slope - ribbon.thickness);
    ctx.closePath();

    const g = ctx.createLinearGradient(x, ribbon.y, w, ribbon.y + ribbon.slope);
    g.addColorStop(0, `hsl(${ribbon.hue},90%,68%)`);
    g.addColorStop(0.5, `hsl(${(ribbon.hue + 35) % 360},90%,62%)`);
    g.addColorStop(1, `hsl(${(ribbon.hue + 75) % 360},75%,60%)`);
    ctx.fillStyle = g;
    ctx.globalAlpha = ribbon.opacity;
    ctx.fill();
    ctx.globalAlpha = 1;

    const vignette = ctx.createRadialGradient(w / 2, h / 2, 400, w / 2, h / 2, h);
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(0,0,0,.65)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);
}

export function LegacyBackgroundCanvas() {
    useEffect(() => {
        const canvas = document.getElementById("legacyBackgroundCanvas");
        const main = canvas?.closest("main");

        if (!canvas || !main) {
            return undefined;
        }

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = main.scrollHeight;
            drawLegacyBackground(canvas, main);
        }

        resize();
        window.addEventListener("resize", resize);

        return () => window.removeEventListener("resize", resize);
    }, []);

    return <canvas id="legacyBackgroundCanvas" className="pointer-events-none absolute inset-0 -z-10" />;
}

export function LegacyHeader({ onHire, pathname }) {
    const currentPath =
        pathname || (typeof window !== "undefined" ? window.location.pathname : "/");

    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                <a href="/" className="inline-flex items-center">
                    <img src="/api/assets/logo" alt="BuiltByBugs" className="block h-11 w-auto" />
                </a>

                <nav aria-label="Primary navigation">
                    <ul className="hidden gap-8 text-sm md:flex">
                        {legacyNavItems.map(([label, href]) => (
                            <li key={href}>
                                <a
                                    href={href}
                                    className={`nav-link transition-colors hover:text-cyan-400 ${
                                        currentPath === href || (href === "/" && currentPath === "/index.html")
                                            ? "text-cyan-400"
                                            : ""
                                    }`}
                                >
                                    {label}
                                </a>
                            </li>
                        ))}
                        <li>
                            <a
                                href="#contact"
                                onClick={(event) => {
                                    event.preventDefault();
                                    window.dispatchEvent(new Event("open-contact"));
                                }}
                                className="nav-link transition-colors hover:text-cyan-400"
                            >
                                Contact
                            </a>
                        </li>
                    </ul>
                </nav>

                <button
                    onClick={onHire}
                    className="rounded-lg border border-slate-700 px-5 py-2 text-sm transition hover:border-cyan-400 hover:text-cyan-400"
                >
                    Hire Me
                </button>
            </div>
        </header>
    );
}

export function LegacyContactModal({
    type,
    onClose,
    onSubmitContact = async () => ({ success: true }),
    onSubmitHire = async () => ({ success: true }),
}) {
    const hire = type === "hire";
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    async function submit(event) {
        event.preventDefault();
        setBusy(true);
        setError("");

        const form = event.currentTarget;
        const data = Object.fromEntries(new FormData(form));

        try {
            const result = hire
                ? await onSubmitHire(data.name, data.email, data.message)
                : await onSubmitContact(data.email, data.message);

            if (result?.success === false) {
                throw new Error(result.error || "Request failed");
            }

            form.reset();
            onClose();
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
            role="dialog"
            aria-modal="true"
            onMouseDown={(event) => event.target === event.currentTarget && onClose()}
        >
            <div className="w-full max-w-lg rounded-xl border border-slate-700 bg-slate-950 p-7 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold">{hire ? "Start a project" : "Get in touch"}</h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-2xl hover:bg-slate-800"
                        aria-label="Close"
                    >
                        x
                    </button>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    {hire && (
                        <label className="block text-sm text-slate-400">
                            Name
                            <input
                                name="name"
                                required
                                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
                            />
                        </label>
                    )}

                    <label className="block text-sm text-slate-400">
                        Email
                        <input
                            name="email"
                            type="email"
                            required
                            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
                        />
                    </label>

                    <label className="block text-sm text-slate-400">
                        Message
                        <textarea
                            name="message"
                            required
                            rows="4"
                            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
                        />
                    </label>

                    {error && <p className="text-sm text-rose-400">{error}</p>}

                    <button
                        disabled={busy}
                        className="rounded-lg bg-cyan-500 px-5 py-3 font-medium text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
                    >
                        {busy ? "Sending..." : hire ? "Send Request" : "Send"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export function LegacyActivitySection({
    bulletin = legacyBulletinItems,
    codingTracker = legacyCodingTrackerData,
}) {
    const bulletinPreview = bulletin?.slice?.(0, 4) || [];
    const trackerRows = codingTracker?.weekly
        ? [
              ["This week", `${codingTracker.weekly.commits} commits`],
              ["Files changed", codingTracker.weekly.filesChanged],
              ["Current streak", `${codingTracker.streak.current} days`],
              ["Today", `${codingTracker.today.hours} hours`],
          ]
        : [];

    return (
        <section className="mx-auto max-w-7xl px-6 py-20" data-reveal>
            <div className="flex flex-wrap justify-center gap-8">
                <div className="h-[360px] w-[360px] rounded-xl border border-slate-800 bg-blued p-6">
                    <h2 className="text-2xl font-bold">Development Activity</h2>
                    <p className="mt-2 text-slate-400">
                        Current progress across coding platforms and ongoing work.
                    </p>
                    <div className="mt-6 space-y-3 text-sm text-slate-400">
                        {bulletinPreview.map((item, index) => (
                            <p key={item.id || index} className="border-l-2 border-cyan-400 pl-3">
                                {item.title || item.text || "Building in public"}
                            </p>
                        ))}
                    </div>
                </div>

                <div className="h-[360px] w-[360px] rounded-xl border border-slate-800 bg-blued p-6">
                    <h3 className="text-xl font-semibold">GitHub</h3>
                    <p className="mt-2 text-slate-400">
                        Contribution data is loaded from the portfolio API.
                    </p>
                    <div className="mt-8 grid grid-cols-7 gap-2">
                        {Array.from({ length: 35 }, (_, index) => (
                            <span
                                key={index}
                                className={`h-4 rounded-sm ${
                                    index % 5 === 0
                                        ? "bg-cyan-400"
                                        : index % 3 === 0
                                          ? "bg-cyan-900"
                                          : "bg-slate-800"
                                }`}
                            />
                        ))}
                    </div>
                </div>

                <div className="h-[360px] w-[360px] rounded-xl border border-slate-800 bg-blued p-6">
                    <h3 className="text-xl font-semibold">Coding Tracker</h3>
                    <p className="mt-2 text-slate-400">Recent sessions and consistent practice.</p>
                    <div className="mt-7 space-y-3">
                        {trackerRows.map(([label, value]) => (
                            <div key={label} className="flex items-center justify-between text-sm">
                                <span className="text-slate-400">{label}</span>
                                <span className="text-cyan-400">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export function LegacyFooter({ onContact }) {
    return (
        <footer className="border-slate-800 bg-black" data-reveal>
            <div className="mx-auto max-w-7xl px-6 py-14">
                <div className="grid items-start gap-12 md:grid-cols-[1fr_auto_auto]">
                    <div>
                        <h3 className="text-lg font-semibold">
                            OCDbug<span className="align-top text-[10px]">TM</span>
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">Personal site by OCDbug.</p>
                    </div>

                    <div>
                        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-500">
                            Navigation
                        </p>
                        <div className="flex gap-6 text-sm text-slate-400">
                            {legacyNavItems.map(([label, href]) => (
                                <a href={href} key={href} className="transition hover:text-cyan-400">
                                    {label}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-500">
                            Contact
                        </p>
                        <button
                            onClick={onContact}
                            className="text-sm text-slate-400 transition hover:text-cyan-400"
                        >
                            Start a conversation -&gt;
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export function LegacyHomePage({ onContact }) {
    return (
        <>
            <main className="relative flex-1">
                <LegacyBackgroundCanvas />

                <section className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-24" data-reveal>
                    <div className="space-y-6">
                        <span className="inline-block rounded-full border border-cyan-500/40 px-4 py-1 text-sm text-cyan-300">
                            Available for Work
                        </span>
                        <h1 className="text-5xl font-bold leading-tight md:text-6xl">
                            Hi, I'm <span className="text-cyan-400">Piyush</span>
                        </h1>
                        <p className="max-w-2xl text-lg leading-8 text-slate-400">
                            I create, design and program software. Currently focused on backend
                            development, automation and building useful developer tools.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a
                                href="/project"
                                className="rounded-lg bg-cyan-500 px-6 py-3 font-medium text-slate-950 hover:bg-cyan-400"
                            >
                                View Projects
                            </a>
                            <button
                                onClick={onContact}
                                className="rounded-lg border border-slate-700 px-6 py-3 hover:border-cyan-400 hover:text-cyan-400"
                            >
                                Contact Me
                            </button>
                        </div>
                    </div>
                </section>

                <LegacyActivitySection />

                <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-24" data-reveal>
                    <h2 className="text-2xl font-bold text-cyan-400">What I Build</h2>
                    <p className="max-w-3xl leading-8 text-slate-400">
                        I enjoy designing software from first principles. My interests lie in backend
                        systems, developer tooling, compiler techniques, automation and maintainable
                        architectures.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        {legacyBuildTags.map((tag) => (
                            <span
                                className="rounded-full border border-lime-400 px-4 py-2 text-sm"
                                key={tag}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </section>
            </main>

            <LegacyFooter onContact={onContact} />
        </>
    );
}

export function LegacyProjectPage({ onContact, projects = legacyProjects }) {
    return (
        <>
            <main className="relative flex-1">
                <LegacyBackgroundCanvas />

                <section className="mx-auto max-w-7xl px-6 py-24" data-reveal>
                    <h1 className="text-5xl font-bold tracking-tight">Projects</h1>
                    <p className="mt-6 max-w-3xl leading-8 text-slate-400">
                        Selected work spanning frontend experiences, backend systems and developer tooling.
                    </p>

                    <div className="mt-14 flex flex-wrap justify-center gap-8">
                        {projects.map((project) => (
                            <article
                                key={project.title}
                                className="flex h-[420px] w-[360px] flex-col rounded-xl border border-slate-800 bg-blued p-6"
                                data-reveal
                            >
                                <div className="mb-6 flex h-40 items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-700 text-slate-500">
                                    {project.imageSrc ? (
                                        <img
                                            src={project.imageSrc}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        "Thumbnail"
                                    )}
                                </div>

                                <span className="mb-4 inline-block w-fit rounded-full border border-cyan-500/30 px-3 py-1 text-xs text-cyan-300">
                                    {project.status}
                                </span>

                                <h2 className="text-2xl font-bold">{project.title}</h2>
                                <p className="mt-3 flex-1 leading-7 text-slate-400">{project.desc}</p>
                                <div className="mt-5 text-sm text-slate-500">{project.tech}</div>

                                <div className="mt-6 flex gap-4">
                                    {project.live && (
                                        <a
                                            href={project.live}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="rounded-lg bg-cyan-500 px-4 py-2 font-medium text-slate-950 hover:bg-cyan-400"
                                        >
                                            Live Preview
                                        </a>
                                    )}
                                    {project.github && (
                                        <a
                                            href={project.github}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="rounded-lg border border-slate-700 px-4 py-2 hover:border-cyan-400 hover:text-cyan-400"
                                        >
                                            GitHub
                                        </a>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="mt-24 rounded-xl border border-slate-800 bg-blued p-8">
                        <h2 className="text-3xl font-bold">Repository Showcase</h2>
                        <p className="mt-2 text-slate-400">
                            Live repositories, contribution statistics and project metadata will appear here.
                        </p>
                    </div>
                </section>
            </main>

            <LegacyFooter onContact={onContact} />
        </>
    );
}

export function LegacyLibraryPage({ onContact, articles = legacyArticles }) {
    return (
        <>
            <main className="relative flex-1">
                <LegacyBackgroundCanvas />

                <section className="mx-auto max-w-6xl px-6 py-24">
                    <h1 className="text-5xl font-bold tracking-tight">Library</h1>

                    <div className="mt-16 space-y-16">
                        {articles.map((article) => (
                            <article
                                id={article.id}
                                key={article.id}
                                className="rounded-xl border border-slate-800 bg-slate-900/30 p-10"
                                data-reveal
                            >
                                <span className="inline-block rounded-full border border-cyan-500/30 px-3 py-1 text-xs text-cyan-300">
                                    {article.tag}
                                </span>
                                <h2 className="mt-5 text-3xl font-bold">{article.title}</h2>
                                <p className="mt-8 max-w-4xl leading-8 text-slate-400">{article.body}</p>
                            </article>
                        ))}
                    </div>
                </section>
            </main>

            <LegacyFooter onContact={onContact} />
        </>
    );
}

export function LegacyPortfolioShell({
    pathname,
    onSubmitContact,
    onSubmitHire,
}) {
    const [modal, setModal] = useState(null);
    const currentPath =
        pathname || (typeof window !== "undefined" ? window.location.pathname : "/");

    useEffect(() => {
        const openContact = () => setModal("contact");
        window.addEventListener("open-contact", openContact);

        return () => window.removeEventListener("open-contact", openContact);
    }, []);

    const page = currentPath.includes("library") ? (
        <LegacyLibraryPage onContact={() => setModal("contact")} />
    ) : currentPath.includes("project") ? (
        <LegacyProjectPage onContact={() => setModal("contact")} />
    ) : (
        <LegacyHomePage onContact={() => setModal("contact")} />
    );

    return (
        <div className="flex min-h-screen flex-col">
            <LegacyHeader pathname={currentPath} onHire={() => setModal("hire")} />
            {page}
            {modal && (
                <LegacyContactModal
                    type={modal}
                    onClose={() => setModal(null)}
                    onSubmitContact={onSubmitContact}
                    onSubmitHire={onSubmitHire}
                />
            )}
        </div>
    );
}

export default LegacyPortfolioShell;
