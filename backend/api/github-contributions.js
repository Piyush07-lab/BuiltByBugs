const { getContributionHeatmap } = require("../utils/github");

let cachedData = null;
let lastFetched = 0;
const CACHE_DTL = 1000 * 60 * 60 * 12; // CACHE_DTL - Duration to live = 12hrs

async function getGitHubContributions(req, res) {
    const now = Date.now();

    if (!cachedData || now - lastFetched > CACHE_DTL) {
        try {
            cachedData = await getContributionHeatmap();
            lastFetched = now;
        } catch (err) {
            console.error("GitHub Heatmap Error:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Failed to fetch GitHub contributions."}));
        }
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(cachedData));
}

module.exports = { getGitHubContributions };