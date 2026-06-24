const { getContributionHeatmap } = require("../utils/github");

async function getGitHubContributions(req, res) {
    try {
        const heatmap = await getContributionHeatmap();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(heatmap, null, 2));
    } catch (error) {
        console.error("GitHub Heatmap error:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Failed to fetch GitHub Contributions."}))
    }
}

module.exports = { getGitHubContributions };