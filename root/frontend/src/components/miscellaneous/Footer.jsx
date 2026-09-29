import { useDrawer } from "../drawer";

export default function Footer() {
    const { openDrawer } = useDrawer();

    return (
        <footer className="relative mt-auto w-full border-t border-white/10 bg-black text-zinc-400">
            <div className="mx-auto w-[min(100%-2rem,1120px)] sm:w-[min(100%-3rem,1120px)] py-14 md:py-20">

                {/* Quick Link Navigation Columns */}
                <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 md:gap-12">

                    {/* Column 1: Navigation Tabs */}
                    <div className="flex flex-col gap-3">
                        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white">
                            Navigation
                        </span>
                        <a href="/" className="text-sm transition-colors hover:text-accent">
                            Home
                        </a>
                        <a href="/project" className="text-sm transition-colors hover:text-accent">
                            Projects
                        </a>
                        <a href="/library" className="text-sm transition-colors hover:text-accent">
                            Library
                        </a>
                    </div>

                    {/* Column 2: Interactive Services & Drawers */}
                    <div className="flex flex-col gap-3">
                        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white">
                            Actions
                        </span>
                        <button
                            type="button"
                            onClick={() => openDrawer("chat")}
                            className="text-left text-sm transition-colors hover:text-accent focus:outline-none"
                        >
                            AI Assistant Chat
                        </button>
                        <button
                            type="button"
                            onClick={() => openDrawer("contact")}
                            className="text-left text-sm transition-colors hover:text-accent focus:outline-none"
                        >
                            Contact
                        </button>
                    </div>

                    {/* Column 3: Work & Repositories */}
                    <div className="flex flex-col gap-3">
                        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white">
                            Repositories
                        </span>
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm transition-colors hover:text-accent"
                        >
                            GitHub Source
                        </a>
                        <a
                            href="https://gitlab.com"
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm transition-colors hover:text-accent"
                        >
                            GitLab Pipelines
                        </a>
                    </div>

                    {/* Column 4: System Details */}
                    <div className="flex flex-col gap-3">
                        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white">
                            Platform
                        </span>
                        <span className="text-sm text-zinc-500">React + Vite SPA</span>
                        <span className="text-sm text-zinc-500">Headless UI Core</span>
                        <span className="text-sm text-zinc-500">Tailwind Engine</span>
                    </div>

                </div>

                {/* Bottom Utility Bar */}
                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs tracking-[0.04em] text-zinc-500 sm:flex-row">
                    <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
                    <span>Inventory-led rebuild</span>
                </div>

            </div>
        </footer>
    );
}