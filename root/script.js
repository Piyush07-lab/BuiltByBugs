

 //======== LeetCode Api fetch ========//

    // fetch("/api/leetcode")
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
            console.log("GitHub contribution data:", data);

            const container = document.getElementById('githubHeatmap');

            container.innerHTML = "";

            const pre = document.createElement('pre');
            pre.textContent = JSON.stringify(data, null, 2);
            container.appendChild(pre);
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

            const statsBox = document.getElementById('githubStats');
            if (statsBox && profile) {
                statsBox.innerHTML = `
                    <h3>GitHub Stats</h3>
                    <p><strong>Name:</strong> ${profile.name}</p>
                    <p><strong>Public Repos:</strong> ${profile.public_repos}</p>
                    <p><strong>Followers:</strong> ${profile.followers}</p>
                    <p><strong>Following:</strong> ${profile.following}</p>
                    <p><strong>Location:</strong> ${profile.location || "N/A"}</p>
                    <p><strong>Bio:</strong> ${profile.bio || "No bio available."}</p>
                `;
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










