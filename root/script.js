

 //======== LeetCode Api fetch ========//

    // fetch("http://localhost:5000/api/leetcode")
    //  .then((res) => {
    //     if (!res.ok) throw new Error("Failed to fetch");
    //     return res.json();
    //  })
    //  .then((data) => {
    //     console.log("LeetCode API response:", data);
    //     document.getElementById("leetcodeChartContainer").textContent = JSON.stringify(data, null, 2);
    //  })
    //  .catch ((err) => {
    //     document.getElementById("leetcodeChartContainer").textContent = "Error fetching data";
    //     console.error("LeetCode Fetch Error:", err);
    //  });

 // ======== GitHub Api fetch =======//

    fetch("http://localhost:5000/api/github-contributions")
        .then((res) => {
            if (!res.ok) throw new Error("GitHub API failed");
            return res.json();
        })
        .then((data) => {
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

    fetch('http://localhost:5000/api/github/summary')
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










