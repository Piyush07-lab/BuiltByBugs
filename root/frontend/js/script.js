
//======== LeetCode Api fetch ========//

// fetch("http://localhost:5500/api/leetcode")
//  .then((res) => {
//     if (!res.ok) throw new Error("Failed to fetch");
//     return res.json();
//  })
//  .then((data) => {
//     if (!data.success) throw new Error(data.error || "Unknown error");

//     console.log("LeetCode API response:", data);
//     document.getElementById("leetcodeChartContainer").textContent = JSON.stringify(data, null, 2);
//  })
//  .catch ((err) => {
//     document.getElementById("leetcodeChartContainer").textContent = "Error fetching data";
//     console.error("LeetCode Fetch Error:", err);
//  });

// ======== GitHub Api fetch =======//

const gridModal = document.getElementById('heatmapModal');
const modalGrid = document.querySelector('.full-heatmap-grid');

let fullData = [];

fetch("http://localhost:5500/api/github-contributions")
    .then((res) => {
        if (!res.ok) throw new Error("GitHub API failed");
        return res.json();
    })
    .then((data) => {

        fullData = data;

        const recentData = data.slice(-35);
        const container = document.getElementById('githubHeatmap');
        const statsBar = document.getElementById('githubStats');

        container.innerHTML = "";

        let total = 0;
        let maxDay = { date: null, count: 0 };

        recentData.forEach(day => {
            const cell = document.createElement('div');
            cell.className = "heatmap-cell";
            cell.style.backgroundColor = day.color || "#ebedf0";
            cell.title = `${day.count} contributions on ${day.date}`;
            container.appendChild(cell);
        })

        statsBar.innerHTML = `
            <strong>Total Contributions:</strong> ${total}<br>
            <strong>Most active day:</strong> ${maxDay.date} (${maxDay.count} commits)
            `;


    })
    .catch((err) => {

        console.error("GitHub chart fetch error:", err);
        const container = document.getElementById('githubHeatmap');
        container.textContent = "Failed to load GitHub contributions.";

    });

document.querySelector('.heatmap-grid').addEventListener('click', () => {
    gridModal.classList.add('show');
    modalGrid.innerHTML = "";

    fullData.forEach(day => {
        const cell = document.createElement('div');
        cell.className = "heatmap-cell";
        cell.style.backgroundColor = day.color || "#ebedf0";
        cell.title = `${day.count} contributions on ${day.date}`;
        modalGrid.appendChild(cell);
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") gridModal.classList.remove('show');
});

fetch('http://localhost:5500/api/github/summary')
    .then(res => res.json())
    .then(data => {
        const { profile, repos } = data;

        const repoList = document.getElementById('repoList');
        if (repoList && Array.isArray(repos)) {
            repoList.innerHTML = "";
            repos.forEach(repo => {
                const li = document.createElement("li");
                li.innerHTML = `
                   <a href="${repo.url}" target="_blank">📦 ${repo.name}</a>
                   <span class="repo-meta">⭐ ${repo.stars} • 🍴 ${repo.forks} • 🛠 ${repo.language || "N/A"}</span>
                   `;
                repoList.appendChild(li);
            });
        }

    })
    .catch(err => {
        console.error("GitHub summary fetch failed:", err);
        const repoList = document.getElementById('repoList');
        if (repoList) {
            repoList.innerHTML = "<li>Unable to load repos at the moment.</li>";
        }
        const statsBox = document.getElementById('githubStats');
        if (statsBox) {
            statsBox.innerHTML = "<p>Unable to load GitHub stats.</p>";
        }
    });

