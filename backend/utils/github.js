
require('dotenv').config();
const https = require('https');
const cheerio = require("cheerio");


const headers = {
    'User-Agent': 'Manual-Node-Client',
    'Accept': 'application/vnd.github.v3+json'
};

if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
}

const fetchGitHub = (options) => {
    return new Promise((resolve, reject) => {
        https.get(options, (res) =>{
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (err) {
                    reject(err);
                }
            });
        }).on('error', reject);
    });
};

const getUserAndRepos = async () => {
    const userOptions = {
        hostname: 'api.github.com',
        path: `/users/Piyush07-lab`,
        method: 'GET',
        headers: headers,
    };

    const repoOptions = {
        hostname: 'api.github.com',
        path: `/users/Piyush07-lab/repos?sort=updated`,
        method: 'GET',
        headers: headers,
    };

    const [user, repos] = await Promise.all([
        fetchGitHub(userOptions),
        fetchGitHub(repoOptions)
    ]);

    return { user, repos };

};

const getContributionHeatmap = () => {
    const url = 'https:github.com/Piyush07-lab';

    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let html = "";

            res.on("data", (chunk) => (html += chunk));
            res.on("end", () => {
                try {
                    const $ = cheerio.load(html);
                    const contributions = [];

                    $('svg.js-calander-graph-svg rect').each((_, rect) => {
                        const date = $(rect).attr("data-date");
                        const count = parseInt($(rect).attr("data-count") ||"0");
                        if (date) contributions.push({ date, count });
                    });

                    resolve(contributions);
                } catch (err) {
                    reject(err);
                }
            });
        }).on("error", reject);                          
    });
};

module.exports = {
    getUserAndRepos,
    getContributionHeatmap
};