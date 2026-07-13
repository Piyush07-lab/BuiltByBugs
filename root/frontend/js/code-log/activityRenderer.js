export function renderActivity(container, trackerData) {

    if (!container || !trackerData) return;

    container.replaceChildren();

    const {
        activity,
        recentSessions,
        currentProject,
        lastActive
    } = trackerData;

    const wrapper = document.createElement("div");
    wrapper.className = "flex h-full flex-col";

    // ==========================
    // Header
    // ==========================

    const header = document.createElement("div");

    const title = document.createElement("h3");
    title.className = "text-xl text-cyan-400 font-semibold";
    title.textContent = "Recent Activity";

    const subtitle = document.createElement("p");
    subtitle.className = "mt-1 text-sm text-slate-400";
    subtitle.textContent = `Last active ${lastActive}`;

    header.append(title, subtitle);

    // ==========================
    // Weekly Activity Graph
    // ==========================

    const graphSection = document.createElement("div");
    graphSection.className =
        "mt-6 flex h-28 items-end justify-between gap-1";

    activity.forEach(day => {

        const bar = document.createElement("div");

        bar.className =
            "flex-1 rounded-t-md bg-sky-500 transition-all hover:bg-sky-400";

        bar.style.height = `${day.percent}%`;

        bar.title =
            `${day.day}: ${day.hours}h`;

        graphSection.append(bar);

    });

    // ==========================
    // Current Project
    // ==========================

    const project = document.createElement("div");

    project.className =
        "mt-6 rounded-lg border border-slate-800 p-4";

    const projectTitle = document.createElement("p");
    projectTitle.className =
        "text-xs uppercase tracking-wide text-slate-500";
    projectTitle.textContent = "Current Project";

    const projectName = document.createElement("p");
    projectName.className =
        "mt-1 font-semibold";
    projectName.textContent = currentProject;

    project.append(
        projectTitle,
        projectName
    );

    // ==========================
    // Recent Sessions
    // ==========================

    const sessionSection = document.createElement("div");
    sessionSection.className = "mt-6 flex-1";

    const heading = document.createElement("p");
    heading.className =
        "mb-2 text-sm font-semibold text-lime-300";
    heading.textContent = "Recent Sessions";

    const list = document.createElement("div");
    list.className = "space-y-2";

    recentSessions.slice(0, 3).forEach(session => {

        const row = document.createElement("div");

        row.className =
            "flex items-center justify-between text-sm";

        const left = document.createElement("span");
        left.textContent = session.project;

        const right = document.createElement("span");
        right.className = "text-slate-500";
        right.textContent = session.duration;

        row.append(left, right);

        list.append(row);

    });

    sessionSection.append(
        heading,
        list
    );

    wrapper.append(
        header,
        graphSection,
        project,
        sessionSection
    );

    container.append(wrapper);

}