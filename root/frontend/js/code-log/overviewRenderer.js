export function renderOverview(container, trackerData) {

    if (!container || !trackerData) return;

    container.replaceChildren();

    const {
        today,
        streak,
        weekly,
        languages
    } = trackerData;

    // ==========================
    // Wrapper
    // ==========================

    const wrapper = document.createElement("div");
    wrapper.className = "flex h-fit flex-col pb-4";

    // ==========================
    // Header
    // ==========================

    const header = document.createElement("div");
    header.className = "mb-2 border-b border-slate-800";

    const title = document.createElement("h3");
    title.className = "text-xl text-cyan-400 font-semibold";
    title.textContent = "Coding Tracker";

    const subtitle = document.createElement("p");
    subtitle.className = "mb-2 text-sm text-slate-400";
    subtitle.textContent = today.project;

    header.append(title, subtitle);

    // ==========================
    // Stats
    // ==========================

    const stats = document.createElement("div");
    stats.className =
        "mt-2 flex justify-between";

    [
        {
            label: "Today",
            value: `${today.hours}h`
        },
        {
            label: "Streak",
            value: `${streak.current}d`
        }

    ].forEach(stat => {

        const column = document.createElement("div");

        const value = document.createElement("p");
        value.className = "text-xl font-bold";
        value.textContent = stat.value;

        const label = document.createElement("p");
        label.className = "text-xs text-slate-500";
        label.textContent = stat.label;

        column.append(value, label);

        stats.append(column);

    });

    // ==========================
    // Languages
    // ==========================

    const languageSection = document.createElement("div");
    languageSection.className = "mt-2 flex-1";

    const heading = document.createElement("h4");
    heading.className = "mb-2 font-semibold text-lime-300";
    heading.textContent = "Languages";

    const list = document.createElement("div");
    list.className = "space-y-1";

    languages.forEach(language => {

        const row = document.createElement("div");

        const top = document.createElement("div");
        top.className =
            "mb-1 flex justify-between text-sm";

        const name = document.createElement("span");
        name.textContent = language.name;

        const percent = document.createElement("span");
        percent.className = "text-slate-400";
        percent.textContent = `${language.percent}%`;

        top.append(name, percent);

        const bar = document.createElement("div");
        bar.className =
            "h-1 rounded bg-slate-800 overflow-hidden";

        const fill = document.createElement("div");
        fill.className =
            "h-full rounded bg-cyan-400";

        fill.style.width = `${language.percent}%`;

        bar.append(fill);

        row.append(top, bar);

        list.append(row);

    });

    languageSection.append(
        heading,
        list
    );

    // ==========================
    // Footer
    // ==========================

    const footer = document.createElement("div");
    footer.className =
        "my-4 flex justify-between border-t border-slate-800 pb-2 text-sm";

    const commits = document.createElement("span");
    commits.className = "text-lime-400";
    commits.textContent =
        `${weekly.commits} commits`;

    const files = document.createElement("span");
    files.className = "text-lime-300";
    files.textContent =
        `${weekly.filesChanged} files`;

    footer.append(commits, files);

    wrapper.append(
        header,
        stats,
        languageSection,
        footer
    );

    container.append(wrapper);

}