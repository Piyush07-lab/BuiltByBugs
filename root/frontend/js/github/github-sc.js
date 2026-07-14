import {
    fetchGitSummary,
    fetchGitContributions
} from "../API-fetch.js";
// import { renderHeatmap } from "./heatmapRenderer.js";

let githubSummary = null;
let heatmapData = null;

let repositories = [];
let languageStats = new Map();

export async function startGithubShowcase() {

    const container =
        document.getElementById("githubShowcase");

    if (!container) return;

    try {

        const [summary, heatmap] = await Promise.all([

            fetchGitSummary(),

            fetchGitContributions()

        ]);

        githubSummary = summary;

        heatmapData = heatmap;

        repositories = [...summary.repos]
            .sort(
                (a, b) =>
                    new Date(b.pushed_at) -
                    new Date(a.pushed_at)
            );

        buildLanguageStats();

        renderGithubShowcase(container);

    }

    catch (error) {

        console.error(
            "GitHub Showcase initialization failed:",
            error
        );

        container.textContent =
            "Unable to load GitHub Showcase.";

    }

}

function buildLanguageStats() {

    languageStats.clear();

    repositories.forEach(repo => {

        if (!repo.language)
            return;

        const current =
            languageStats.get(repo.language) || 0;

        languageStats.set(
            repo.language,
            current + 1
        );

    });

}

function renderGithubShowcase(container) {

    container.replaceChildren();

    const wrapper =
        document.createElement("div");

    wrapper.className =
        "flex flex-col gap-8";

    renderProfileSection(wrapper);

    renderRepositorySection(wrapper);

    renderLanguageSection(wrapper);

    renderHeatmapSection(wrapper);

    container.append(wrapper);

}

function renderProfileSection(parent) {

    const { user } = githubSummary;

    const section = document.createElement("section");

    section.className =
        "rounded-xl border border-slate-800 bg-slate-950/40 p-6";

    //--------------------------------------------------
    // Header
    //--------------------------------------------------

    const header = document.createElement("div");

    header.className =
        "flex flex-wrap items-start justify-between gap-6";

    //--------------------------------------------------
    // Left
    //--------------------------------------------------

    const left = document.createElement("div");

    const title = document.createElement("h2");

    title.className =
        "text-3xl font-bold";

    title.textContent = user.login;

    const bio = document.createElement("p");

    bio.className =
        "mt-2 max-w-3xl leading-7 text-slate-400";

    bio.textContent =
        user.bio || "No bio available.";

    const profileLink =
        document.createElement("button");

    profileLink.className =
        "mt-5 rounded-lg border border-cyan-500/30 px-4 py-2 text-sm text-cyan-300 transition hover:border-cyan-400 hover:text-cyan-200";

    profileLink.textContent =
        "View GitHub Profile";

    profileLink.addEventListener("click", () => {

        window.open(
            user.html_url,
            "_blank"
        );

    });

    left.append(
        title,
        bio,
        profileLink
    );

    //--------------------------------------------------
    // Right Stats
    //--------------------------------------------------

    const stats =
        document.createElement("div");

    stats.className =
        "grid grid-cols-2 gap-4 md:grid-cols-4";

    [

        {
            label: "Repositories",
            value: user.public_repos,
            url:
                `${user.html_url}?tab=repositories`
        },

        {
            label: "Followers",
            value: user.followers,
            url:
                `${user.html_url}?tab=followers`
        },

        {
            label: "Following",
            value: user.following,
            url:
                `${user.html_url}?tab=following`
        },

        {
            label: "Joined",
            value:
                new Date(
                    user.created_at
                ).getFullYear(),
            url:
                user.html_url
        }

    ].forEach(item => {

        const card =
            document.createElement("button");

        card.className =
            "rounded-lg border border-slate-800 bg-black/20 p-4 text-left transition-all duration-200 hover:border-cyan-400 hover:bg-slate-900 hover:scale-[1.02]";

        card.addEventListener("click", () => {

            window.open(
                item.url,
                "_blank"
            );

        });

        const value =
            document.createElement("p");

        value.className =
            "text-2xl font-bold";

        value.textContent =
            item.value;

        const label =
            document.createElement("p");

        label.className =
            "mt-1 text-xs uppercase tracking-wide text-slate-500";

        label.textContent =
            item.label;

        card.append(
            value,
            label
        );

        stats.append(card);

    });

    //--------------------------------------------------

    header.append(
        left,
        stats
    );

    section.append(header);

    parent.append(section);

}

function renderRepositorySection(parent) {

    const section = document.createElement("section");

    section.className =
        "rounded-xl border border-slate-800 bg-slate-950/40 p-6";

    //--------------------------------------------------
    // Header
    //--------------------------------------------------

    const heading = document.createElement("div");

    const title = document.createElement("h2");

    title.className =
        "text-2xl font-bold";

    title.textContent = "Repositories";

    const subtitle = document.createElement("p");

    subtitle.className =
        "mt-2 text-slate-400";

    subtitle.textContent =
        `${repositories.length} public repositories`;

    heading.append(
        title,
        subtitle
    );

    //--------------------------------------------------
    // Grid
    //--------------------------------------------------

    const grid = document.createElement("div");

    grid.className =
        "mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3";

    repositories.forEach(repo => {

        const card =
            document.createElement("button");

        card.type = "button";

        card.className =
            "group rounded-xl border border-slate-800 bg-black/20 p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:border-cyan-400 hover:bg-slate-900";

        card.addEventListener("click", () => {

            window.open(
                repo.html_url,
                "_blank"
            );

        });

        //--------------------------------------------------
        // Repository Name
        //--------------------------------------------------

        const name =
            document.createElement("h3");

        name.className =
            "truncate text-xl font-semibold text-white group-hover:text-cyan-300";

        name.textContent =
            repo.name;

        //--------------------------------------------------
        // Description
        //--------------------------------------------------

        const description =
            document.createElement("p");

        description.className =
            "mt-3 line-clamp-3 min-h-[72px] leading-7 text-slate-400";

        description.textContent =
            repo.description ||
            "No description provided.";

        //--------------------------------------------------
        // Topics
        //--------------------------------------------------

        const topics =
            document.createElement("div");

        topics.className =
            "mt-4 flex flex-wrap gap-2";

        (repo.topics || [])
            .slice(0, 4)
            .forEach(topic => {

                const badge =
                    document.createElement("span");

                badge.className =
                    "rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300";

                badge.textContent =
                    topic;

                topics.append(badge);

            });

        //--------------------------------------------------
        // Footer
        //--------------------------------------------------

        const footer =
            document.createElement("div");

        footer.className =
            "mt-6 border-t border-slate-800 pt-4";

        const stats =
            document.createElement("div");

        stats.className =
            "flex flex-wrap items-center gap-4 text-sm text-slate-500";

        [
            [
                "Language",
                repo.language || "Unknown"
            ],

            [
                "★",
                repo.stargazers_count
            ],

            [
                "Forks",
                repo.forks_count
            ],

            [
                "Issues",
                repo.open_issues_count
            ]

        ].forEach(([label, value]) => {

            const item =
                document.createElement("span");

            item.className =
                "rounded-md bg-slate-900 px-2 py-1";

            item.textContent =
                `${label}: ${value}`;

            stats.append(item);

        });

        const updated =
            document.createElement("p");

        updated.className =
            "mt-4 text-xs uppercase tracking-wide text-slate-600";

        updated.textContent =
            `Updated ${new Date(
                repo.pushed_at
            ).toLocaleDateString()}`;

        footer.append(
            stats,
            updated
        );

        card.append(
            name,
            description,
            topics,
            footer
        );

        grid.append(card);

    });

    section.append(
        heading,
        grid
    );

    parent.append(section);

}

function renderLanguageSection(parent) {

    const section = document.createElement("section");

    section.className =
        "rounded-xl border border-slate-800 bg-slate-950/40 p-6";

    //--------------------------------------------------
    // Header
    //--------------------------------------------------

    const title = document.createElement("h2");

    title.className =
        "text-2xl font-bold";

    title.textContent =
        "Language Distribution";

    const subtitle = document.createElement("p");

    subtitle.className =
        "mt-2 text-slate-400";

    subtitle.textContent =
        "Repositories grouped by primary language.";

    section.append(
        title,
        subtitle
    );

    //--------------------------------------------------
    // Calculate totals
    //--------------------------------------------------

    const total =
        repositories.length || 1;

    const sorted =
        [...languageStats.entries()]
            .sort((a, b) => b[1] - a[1]);

    const wrapper =
        document.createElement("div");

    wrapper.className =
        "mt-8 space-y-5";

    sorted.forEach(([language, count]) => {

        const percent =
            ((count / total) * 100).toFixed(0);

        const row =
            document.createElement("div");

        const top =
            document.createElement("div");

        top.className =
            "mb-2 flex items-center justify-between";

        const left =
            document.createElement("button");

        left.className =
            "font-medium text-cyan-300 transition hover:text-cyan-200";

        left.textContent =
            language;

        left.addEventListener("click", () => {

            window.open(

                `https://github.com/search?q=user:${githubSummary.user.login}+language:${encodeURIComponent(language)}`,

                "_blank"

            );

        });

        const right =
            document.createElement("span");

        right.className =
            "text-sm text-slate-500";

        right.textContent =
            `${count} repos`;

        top.append(
            left,
            right
        );

        const bar =
            document.createElement("div");

        bar.className =
            "h-2 overflow-hidden rounded-full bg-slate-900";

        const fill =
            document.createElement("div");

        fill.className =
            "h-full rounded-full bg-cyan-400";

        fill.style.width =
            `${percent}%`;

        bar.append(fill);

        row.append(
            top,
            bar
        );

        wrapper.append(row);

    });

    section.append(wrapper);

    parent.append(section);

}

function renderHeatmapSection(parent) {

    const section = document.createElement("section");

    section.className =
        "rounded-xl border border-slate-800 bg-slate-950/40 p-6";

    //--------------------------------------------------
    // Header
    //--------------------------------------------------

    const title = document.createElement("h2");

    title.className =
        "text-2xl font-bold";

    title.textContent =
        "Contribution Activity";

    const subtitle = document.createElement("p");

    subtitle.className =
        "mt-2 text-slate-400";

    subtitle.textContent =
        "Past year's contribution history.";

    section.append(
        title,
        subtitle
    );

    //--------------------------------------------------
    // Scroll Container
    //--------------------------------------------------

    const scroll =
        document.createElement("div");

    scroll.className =
        "mt-8 overflow-x-auto overflow-y-hidden";

    scroll.style.scrollbarWidth = "none";

    //--------------------------------------------------
    // Grid
    //--------------------------------------------------

    const grid =
        document.createElement("div");

    grid.className =
        "grid grid-flow-col grid-rows-7 gap-[3px] w-max";

    const recent =
        [...heatmapData]
            .sort(
                (a, b) =>
                    new Date(a.date) -
                    new Date(b.date)
            );

    let total = 0;

    let best = null;

    recent.forEach(day => {

        total += day.count;

        if (!best || day.count > best.count)
            best = day;

        const square =
            document.createElement("div");

        square.className =
            "h-3 w-3 rounded-[2px] transition-all duration-150 hover:scale-125";

        square.style.backgroundColor =
            day.color;

        square.title =
            `${day.date}
${day.count} contribution${day.count === 1 ? "" : "s"}`;

        square.addEventListener("click", () => {

            window.open(
                githubSummary.user.html_url,
                "_blank"
            );

        });

        grid.append(square);

    });

    scroll.append(grid);

    section.append(scroll);

    //--------------------------------------------------
    // Footer
    //--------------------------------------------------

    const footer =
        document.createElement("div");

    footer.className =
        "mt-8 flex flex-wrap items-center justify-between border-t border-slate-800 pt-4";

    const totalElement =
        document.createElement("span");

    totalElement.className =
        "text-slate-400";

    totalElement.textContent =
        `Total Contributions : ${total}`;

    const bestElement =
        document.createElement("span");

    bestElement.className =
        "text-slate-400";

    bestElement.textContent =
        `Best Day : ${best?.count ?? 0}`;

    const github =
        document.createElement("button");

    github.className =
        "rounded-lg border border-cyan-500/30 px-4 py-2 text-cyan-300 transition hover:border-cyan-400";

    github.textContent =
        "View on GitHub";

    github.addEventListener("click", () => {

        window.open(
            githubSummary.user.html_url,
            "_blank"
        );

    });

    footer.append(
        totalElement,
        bestElement,
        github
    );

    section.append(footer);

    parent.append(section);

}