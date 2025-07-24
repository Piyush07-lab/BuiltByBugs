let loaded = false;

function getGitHubAuthHeaders() {
    if (!loaded) {
        require("dotenv").config();
        loaded = true;
    }

    const token = process.env.GITHUB_TOKEN;

    if (!token) {
        throw new Error("❌ GITHUB_TOKEN not found.");
    }

    return {
        "Authorization": `Bearer ${token}`,
        "User-Agent": "OCDbug-Agent",
        "Content-Type": "application/json"
    };
}

module.exports = {
    getGitHubAuthHeaders
};