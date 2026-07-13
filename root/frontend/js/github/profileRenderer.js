export function renderProfile(container, githubSummary) {

    if (!container || !githubSummary) return;

    container.replaceChildren();

    const { user, repos } = githubSummary;

    const topRepos = [...repos]
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 3);


    // ==========================
    // Wrapper
    // ==========================

    const wrapper = document.createElement("div");
    wrapper.className = "flex h-full flex-col";

    // ==========================
    // Header
    // ==========================

    const heading = document.createElement("h2");
    heading.className = "text-2xl font-bold";
    heading.textContent = "GitHub";

    const username = document.createElement("h3");
    username.className = "text-xl text-cyan-400 font-semibold";
    username.textContent = user.login;

    const bio = document.createElement("p");
    bio.className = "text-sm text-slate-400";
    bio.textContent = user.bio || "No bio available.";

    // ==========================
    // Content
    // ==========================

    const content = document.createElement("div");
    content.className =
        "mt-6 flex flex-1 gap-4 border-t border-slate-800 pt-3";

    // ---------- Stats ----------

    const stats = document.createElement("div");
    stats.className =
        "flex w-28 shrink-0 flex-col gap-2 p-4";

    const statData = [
        {
            label: "Repos",
            value: user.public_repos
        },
        {
            label: "Followers",
            value: user.followers
        },
        {
            label: "Following",
            value: user.following
        }
    ];

    statData.forEach(stat => {

        const item = document.createElement("div");

        const value = document.createElement("p");
        value.className = "text-2xl font-bold leading-none";
        value.textContent = stat.value;

        const label = document.createElement("p");
        label.className = "mt-1 text-xs text-slate-500";
        label.textContent = stat.label;

        item.append(value, label);

        stats.append(item);

    });

    // ---------- Repository Section ----------

    const repoSection = document.createElement("div");
    repoSection.className = "p-3";

    const repoHeading = document.createElement("h3");
    repoHeading.className = "mb-5 text-sm text-cyan-300 font-semibold uppercase tracking-wide";
    repoHeading.textContent = "Repositories";

    const repoList = document.createElement("div");
    repoList.className = "flex flex-col";

    topRepos.forEach(repo => {

        const row = document.createElement("div");

        const name = document.createElement("p");
        name.className = "truncate text-base font-semibold";
        name.textContent = repo.name;

        const meta = document.createElement("p");
        meta.className = "mt-1 text-xs text-slate-500";
        meta.textContent =
            `${repo.language || "Unknown"} • ★ ${repo.stargazers_count}`;

        row.append(name, meta);

        repoList.append(row);

    });

    repoSection.append(
        repoHeading,
        repoList
    );

    content.append(
        stats,
        repoSection
    );

    wrapper.append(
        heading,
        username,
        bio,
        content
    );

    container.append(wrapper);
}