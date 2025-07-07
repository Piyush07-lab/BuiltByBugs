
const https = require('https');
require('dotenv').config();


const headers = {
    'user-Agent': 'Manual-Node-Client',
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

const getUserAndRepos = async (username) => {
    const userOptions = {
        hostname: 'api.github.com',
        path: `/user/${username}/repos?sort=updated`,
        method: 'GET',
        headers: headers,
    };

    const [user, repos] = await Promise.all([
        fetchGitHub(userOptions),
        fetchGitHub(repoOptions)
    ]);

    return { user, repos };

};

module.exports = {
    getUserAndRepos
};