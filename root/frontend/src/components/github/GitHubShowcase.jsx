function GitHubShowcase({ summary }) {
    const { user, repos = [] } = summary;
    const joinedYear = user.created_at
        ? new Date(user.created_at).getFullYear()
        : "n/a";

    return (
        <section className="rounded-2xl border border-[#9eaedb]/16 bg-[#11172a]/62 p-6">
            <div>
                <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.14em] text-accent">GitHub Showcase</p>
                <h2 className="mb-3 text-[clamp(1.45rem,3vw,2rem)] font-bold text-white">{user.login}</h2>
                <p className="leading-relaxed text-muted">{user.bio || "No bio available."}</p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
                <a className="flex min-w-0 flex-col gap-1 rounded-[0.55rem] border border-[#9eaedb]/12 bg-page-bg/48 p-3 text-[0.76rem] text-muted no-underline transition duration-150 ease-in-out hover:border-accent/50" href={`${user.html_url}?tab=repositories`} target="_blank" rel="noreferrer">
                    <strong className="text-xl font-bold text-white">{repos.length}</strong>
                    <span>Repositories</span>
                </a>
                <a className="flex min-w-0 flex-col gap-1 rounded-[0.55rem] border border-[#9eaedb]/12 bg-page-bg/48 p-3 text-[0.76rem] text-muted no-underline transition duration-150 ease-in-out hover:border-accent/50" href={`${user.html_url}?tab=followers`} target="_blank" rel="noreferrer">
                    <strong className="text-xl font-bold text-white">{user.followers ?? 0}</strong>
                    <span>Followers</span>
                </a>
                <a className="flex min-w-0 flex-col gap-1 rounded-[0.55rem] border border-[#9eaedb]/12 bg-page-bg/48 p-3 text-[0.76rem] text-muted no-underline transition duration-150 ease-in-out hover:border-accent/50" href={`${user.html_url}?tab=following`} target="_blank" rel="noreferrer">
                    <strong className="text-xl font-bold text-white">{user.following ?? 0}</strong>
                    <span>Following</span>
                </a>
                <a className="flex min-w-0 flex-col gap-1 rounded-[0.55rem] border border-[#9eaedb]/12 bg-page-bg/48 p-3 text-[0.76rem] text-muted no-underline transition duration-150 ease-in-out hover:border-accent/50" href={user.html_url} target="_blank" rel="noreferrer">
                    <strong className="text-xl font-bold text-white">{joinedYear}</strong>
                    <span>Joined</span>
                </a>
            </div>
        </section>
    );
}

export default GitHubShowcase;
