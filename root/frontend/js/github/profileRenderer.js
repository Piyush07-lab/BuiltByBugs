export function renderProfile(container, githubSummary) {

    if (!container || !githubSummary) return;

    container.replaceChildren();

    const { user, repos } = githubSummary;

    const topRepos = [...repos]
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 3);

    // Main wrapper
    const wrapper = document.createElement("div");
    wrapper.className = "flex h-full flex-col";

    // ==========================
    // Profile Header
    // ==========================

    const header = document.createElement("div");
    header.className = "flex items-center gap-4";

    const avatar = document.createElement("img");
    avatar.src = user.avatar_url;
    avatar.alt = `${user.login} avatar`;
    avatar.className = "h-16 w-16 rounded-full border border-slate-700";

    const profileInfo = document.createElement("div");
    profileInfo.className = "flex flex-col";

    const username = document.createElement("h3");
    username.className = "text-xl font-bold";
    username.textContent = user.login;

    const bio = document.createElement("p");
    bio.className = "text-sm text-slate-400";
    bio.textContent = user.bio || "No bio available.";

    profileInfo.append(username, bio);
    header.append(avatar, profileInfo);

    // ==========================
    // Stats
    // ==========================

    const stats = document.createElement("div");
    stats.className =
        "mt-6 grid grid-cols-3 gap-3 text-center";

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

        const card = document.createElement("div");
        card.className =
            "rounded-lg border border-slate-800 bg-slate-950 p-3";

        const value = document.createElement("p");
        value.className = "text-lg font-bold";
        value.textContent = stat.value;

        const label = document.createElement("p");
        label.className = "text-xs text-slate-500";
        label.textContent = stat.label;

        card.append(value, label);

        stats.append(card);

    });

    // ==========================
    // Top Repositories
    // ==========================

    const repoSection = document.createElement("div");
    repoSection.className = "mt-6 flex-1";

    const repoHeading = document.createElement("h4");
    repoHeading.className = "mb-3 font-semibold";
    repoHeading.textContent = "Top Repositories";

    const repoList = document.createElement("div");
    repoList.className = "space-y-2";

    topRepos.forEach(repo => {

        const row = document.createElement("div");
        row.className =
            "rounded-lg border border-slate-800 bg-slate-950 p-3";

        const name = document.createElement("p");
        name.className = "font-medium";
        name.textContent = repo.name;

        const meta = document.createElement("p");
        meta.className = "text-xs text-slate-500";
        meta.textContent =
            `${repo.language || "Unknown"} • ★ ${repo.stargazers_count}`;

        row.append(name, meta);

        repoList.append(row);

    });

    repoSection.append(repoHeading, repoList);

    wrapper.append(
        header,
        stats,
        repoSection
    );

    container.append(wrapper);

}