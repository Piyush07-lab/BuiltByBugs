// Script file here
// document.querySelector(`.mainTwo`).addEventListener(`click`, function() {
//     this.classList.toggle(`expanded`);
// });

document.getElementById("middleToggle").addEventListener("click", () => {
    document.getElementById("middleToggle").classList.toggle("expanded");
});

const mainTwo = document.getElementById("middleToggle");
const toggleBar = document.getElementById("toggleBar");

toggleBar.addEventListener("click", () => {
    mainTwo.classList.toggle("expanded");
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

// console.log(`Script is runnung!`);
