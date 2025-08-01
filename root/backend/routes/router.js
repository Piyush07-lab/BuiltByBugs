// Routes
require("dotenv").config({ path: __dirname + "/.env" });

const url = require('url');

const handleHireRequest = require('../api/hireRequest');
const { getGitHubContributions } = require('../api/github-contributions');
const { getUserAndRepos } = require('../api/utils/github');
const {
    getCodingActivity,
    postCodingActivity,
    getCodingSummary
} = require('../api/coding');


//---- github-summary ----//

const CACHE_TTL = 5 * 60 * 1000;

let githubCache = {
    timestamp: null,
    data: null
};

async function handleGitHubSummary(req, res) {
    const now = Date.now();

    if (githubCache.data && now - githubCache.timestamp < CACHE_TTL) {
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify(githubCache.data));
    }

    try {
        const freshData = await getUserAndRepos();
        githubCache = {
            timestamp: now,
            data: freshData
        };

        res.writeHead(200, { "Content-Type": "appliction/json" });
        res.end(JSON.stringify(freshData));
    } catch (err) {
        console.error("[GitHub Summary Error]", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({error: "Failed to fetch GitHub summary"}));
    }
}


function routeRequest(req, res) {
    const parsedUrl = url.parse(req.url)
    const { pathname } = parsedUrl;
    const { method } = req;

    if (pathname === '/api/hireRequest' && method === 'POST') {
        return handleHireRequest(req, res);
    }

    if (pathname === '/api/github/summary' && method === 'GET') {
        return handleGitHubSummary(req, res);
    }

    if (pathname === '/api/coding' && method === 'GET') {
        return getCodingActivity(req, res);
    }

    if (pathname === '/api/coding/summary' && method === 'GET') {
        return getCodingSummary(req, res);
    }

    res.writeHead(404, { 'Content-Type': 'test/plain' });
    res.end("Route not found");
}

module.exports = { routeRequest };

