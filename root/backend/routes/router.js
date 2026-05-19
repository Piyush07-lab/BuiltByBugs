// Routes
require("dotenv").config({ path: __dirname + "/.env" });

const url = require('url');

const handleHireRequest = require('../api/hireRequest.js');
const { getGitHubContributions } = require('../api/github-contributions.js');
const { getUserAndRepos } = require('../utils/github.js');
// const handleLeetCodeRefresh = require('../api/leetcodeRefresh.js');
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

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(freshData));
    } catch (err) {
        console.error("[GitHub Summary Error]", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({error: "Failed to fetch GitHub summary"}));
    }
}


function routeRequest(req, res) {
    const parsedUrl = new URL(
        req.url,
        `http://${req.headers.host}`
    );
    const { pathname } = parsedUrl;

    console.log({
        url:req.url,
        pathname,
        method:req.method
    });
    
    
    const { method } = req;

    if (pathname === '/api/hireRequest' && method === 'POST') {
        return handleHireRequest(req, res);
    }

    if (pathname === '/api/github/summary' && method === 'GET') {
        return handleGitHubSummary(req, res);
    }
    
    if (pathname === '/api/github-contributions' && method === 'GET') {
        return getGitHubContributions(req, res);
    }

    if (pathname === '/api/coding' && method === 'GET') {
        return getCodingActivity(req, res);
    }

    if (pathname === '/api/coding/summary' && method === 'GET') {
        return getCodingSummary(req, res);
    }

    if (pathname === '/api/coding' && method === 'POST') {
        return postCodingActivity(req, res);
    }

    // if (pathname === '/api/leetcode/refresh' && method === 'GET') {
    //     return handleLeetCodeRefresh(req, res);
    // }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end("Route not found");
}

module.exports = { routeRequest };

