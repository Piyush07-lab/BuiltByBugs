document.addEventListener('DOMContentLoaded', () => {
    const mainTwo = document.querySelector('.mainTwo');

    mainTwo.addEventListener('click', () => {
        mainTwo.classList.toggle('expanded');
    });

    document.querySelectorAll('.quick-links a').forEach(link => {
        link.addEventListener('click', e => e.stopPropagation());
    });


// GitHub Api fetch ==============================//

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


});






