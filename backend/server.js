let githubCache = {
    timestamp: null,
    data: null
};

const CACHE_TTL = 5 * 60 * 1000;

const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 5000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);


    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }


    if (parsedUrl.pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        return res.end('Hello from backend!');
    }

    if (parsedUrl.pathname === '/favicon.ico') {
        res.writeHead(204);
        return res.end();
    }

    if (
        req.method === 'GET' &&
        (parsedUrl.pathname === '/api/github/summary' || parsedUrl.pathname === '/api/github/summary/')
    ) {
        const now = Date.now();
        if (githubCache.data && (now - githubCache.timestamp) < CACHE_TTL) {
            console.log("⚡ Serving GitHub summary from cache");
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify(githubCache.data));
        }

        const userOptions = {
            hostname: 'api.github.com',
            path: '/users/Piyush07-lab',
            method: 'GET',
            headers: { 'User-Agent': 'Manual-Node-Client' }
        };

        const repoOptions = {
            hostname: 'api.github.com',
            path: '/users/Piyush07-lab/repos?sort=updated',
            method: 'GET',
            headers: { 'User-Agent': 'Manual-Node-Client' }
        };

        const fetchGitHub = (options) => {
            return new Promise((resolve, reject) => {
                https.get(options, (apiRes) => {
                    let data = '';
                    apiRes.on('data', chunk => data += chunk);
                    apiRes.on('end', () => {
                        try {
                            const parsed = JSON.parse(data);
                            resolve(parsed);
                        } catch (err) {
                            reject(err);
                        }
                    });
                }).on('error', reject);
            });
        };

        Promise.all([
            fetchGitHub(userOptions),
            fetchGitHub(repoOptions)
        ])
            .then(([user, repos]) => {
                if (!Array.isArray(repos)) throw new Error("GitHub repo response is not an array");

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
                console.error("❌ GitHub summary fetch failed:", err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "GitHub summary fetch failed", details: err.message }));
            });

        return;
    }


    res.writeHead(404, { 'Cpntent-Type': 'application/json' });
    res.end(JSON.stringify({ message: "Not Found" }));

});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})


