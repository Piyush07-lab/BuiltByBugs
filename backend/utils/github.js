
require('dotenv').config();
const https = require('https');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');


const headers = {
    'User-Agent': 'Manual-Node-Client',
    'Accept': 'application/vnd.github.v3+json'
};

if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
}

const fetchGitHub = (options) => {
    return new Promise((resolve, reject) => {
        https.get(options, (res) => {
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

async function getContributionHeatmap() {
    const username = 'Piyush07-lab';
    const url = `https://github.com/${username}`;
    const filePath = path.join(__dirname, '..', 'data', 'activity-log.json');

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox']
    });

    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'networkidle2' });
        await page.waitForSelector('svg.js-calendar-graph-svg');

        const contributions = await page.$$eval('svg.js-calendar-graph-svg rect[data-date]', rects =>
            rects.map(rect => ({
                date: rect.getAttribute('data-date'),
                count: parseInt(rect.getAttribute('data-count')),
                level: rect.getAttribute('data-level')
            }))
        );

        await browser.close();

        const payload = { github: contributions };
        fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));

        return payload;
    } catch (err) {
        await browser.close();
        console.error('Puppeteer Scraping Error:', err);
        throw err;
    }
}


module.exports = {
    getUserAndRepos,
    getContributionHeatmap
};