require('dotenv').config();
const http = require('http');
const url = require('url');
const { getUserAndRepos, getContributionHeatmap } = require('./utils/github');
const getLeetCodeStats = require("./api/leetcode");
const { getCodingActivity, postCodingActivity, getCodingSummary } = require("./api/coding");

const PORT = 5000;
const CACHE_TTL = 5 * 60 * 1000;

let githubCache = {
    timestamp: null,
    data: null
};

let cachedContributions = null;
let lastFetchedContributions = 0;
const CONTRIBUTION_CACHE_DURATION = 1000 * 60 * 60 * 12;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        return res.end('Hello frpom backend');
    }

    if (parsedUrl.pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        return res.end('Hello from backend');
    }

    if (parsedUrl.pathname === '/favicon.ico') {
        res.writeHead(204);
        return res.end();
    }



    /* ================= GitHub Api ====================== */

    if (url === "/api/github-contributions" && method === "GET") {
        const now = Date.now();

        if (
            !cachedContributions || now - lastFetchedContributions > CONTRIBUTION_CACHE_DURATION
        ) {
            getContributionHeatmap()
            .then((data) => {
                cachedContributions = data;
                lastFetchedContributions = now;
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(data));
            })
            .catch((err) => {
                res.writeHead(500, { "Content-type": "application/json" });
                res.end(JSON.stringify({ error: "Failed to fetch GitHub contributoions" }));
            });
        } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(cachedContributions));
        }

    }


    if (
        req.method === 'GET' &&
        (parsedUrl.pathname === '/api/github/summary' || parsedUrl.pathname === '/api/github/summary/')
    ) {
        const now = Date.now();
        if (githubCache.data && (now - githubCache.timestamp) < CACHE_TTL) {
            console.log("Serving Github Summary from cache ");
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify(githubCache.data));

        }

        getUserAndRepos()
            .then(({ user, repos }) => {

                console.log("Debug: Repo response type:", typeof repos);
                console.log("Debug: Repos raw content:", repos);

                if (!Array.isArray(repos)) throw new Error("Github repo response is not an array");

                const summary = {
                    profile: {
                        name: user.name,
                        bio: user.bio,
                        location: user.location,
                        public_repos: user.public_repos,
                        followers: user.followers,
                        following: user.following
                    },
                    repos: repos.slice(0, 5).map(repo => ({
                        name: repo.name,
                        url: repo.html_url,
                        stars: repo.stargazers_count,
                        forks: repo.forks_count,
                        language: repo.language || "N/A"
                    }))
                };

                githubCache.data = summary;
                githubCache.timestamp = Date.now();

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(summary));
            })
            .catch(err => {
                console.error("GitHub summary fetch failed", err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Github summary fetch failed!", details: err.message }));
            });

        return;

    }

    /* ============== Coding Activity Api ================ */

    if (url === "/api/coding-activity" && method === "GET") {
        getCodingActivity(req, res);
    }

    if (url === "/api/coding-activity" && method === "POST") {
        postCodingActivity(req, res);
    }

    if (url === "/api/coding-activity/summary" && method === "GET") {
        getCodingSummary(req, res);
    }


    /* ============= LeetCode Api ============ */

    if (url === "/api/leetcode" && method === "GET") {
        const username = "PiyushMishra07";

        getLeetCodeStats(username, (err, result) => {
            if (err) {
                res.writeHead(500);
                res.end(JSON.stringify({ erron: "Failed to fetch LeetCode stats." }));
            } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(result));
            }
        });
    }




    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: "Not found" }));
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})


