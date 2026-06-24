import { fetchGitContributions } from "./API-fetch.js";

// TODO Phase 3: Retain this renderer for the future GitHub analytics and heatmap experience.
export async function renderGitHubContributions() {
    try {
        const data = await fetchGitContributions();

        const heatmapWidget = document.querySelector(".heatmap-widget");
        heatmapWidget.innerHTML = data.html || "<p>Heatmap unavailable</p>";

        const statsBar = document.getElementById("githubStats");
        if (data.total && data.maxDay) {
            statsBar.innerHTML = `
            <strong>Total Contributions:</strong> ${data.total}<br>
            <strong>Most active day:</strong> ${data.maxDay.date} (${data.maxDay.count} commits)
            `;
        } else {
            statsBar.textContent = "No Contribution stats available.";
        }

    } catch (error) {
        console.error("error rendering github contributions:", error);
        document.getElementById("githubStats").textContent = "Failed to load contributions";
    }
}
