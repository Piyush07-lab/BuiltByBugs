document.addEventListener('DOMContentLoaded', () => {
    const mainTwo = document.querySelector('.mainTwo');

    mainTwo.addEventListener('click', () => {
        mainTwo.classList.toggle('expanded');
    });

    document.querySelectorAll('.quick-links a').forEach(link => {
        link.addEventListener('click', e => e.stopPropagation());
    });
});







const repoList = document.getElementById("repoList");
const githubUsername = "Piyush07-lab";

fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated`)
    .then((res) => res.json())
    .then((repos) => {
        repoList.innerHTML = "";

        repos.slice(0, 5).forEach((repo) => {
            const li = document.createElement("li");
            li.innerHTML = `<a href="${repo.html_url}" target="_blank">📦 ${repo.name}</a><span class="repo-meta">⭐ ${repo.stargazers_count} • 🍴 ${repo.forks_count} • 🛠 ${repo.language || "N/A"}</span>`;
            repoList.appendChild(li);
        });
    })
    .catch((err) => {
        console.error("Failed to load GitHub repos:", err);
        repoList.innerHTML = "<li>Unable to load repos at the moment.</li>";
    })

function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleDateString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
    })
    document.getElementById('clockBox').textContent = timeStr;
}
setInterval(updateClock, 1000);
updateClock();

const clockBox = document.getElementById("clockBox");
const threshold = 150;

window.addEventListener("scroll", () => {
    if (window.scrollY >= threshold) {
        clockBox.classList.add("floating");
    } else {
        clockBox.classList.remove("floating");
    }
});

// console.log(`Script is runnung!`);
