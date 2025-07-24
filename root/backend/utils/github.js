require("dotenv").config({ path: __dirname + "/.env" });

const https = require('https');

const GITHUB_API_URL = "https://api.github.com/graphql";

let cachedHeatmap = null;
let lastFetched = 0;
const CACHE_DTL = 1000 * 60 * 60 * 6;    // 6 hours

async function getContributionHeatmap() {

    const now = Date.now();
    if (cachedHeatmap && now - lastFetched < CACHE_DTL) {
        return cachedHeatmap;
    }

    const query = JSON.stringify({
        query: `
        query {
           user(login: "Piyush07-lab"){
                contributionsCollection {
                    contributionCalendar {
                        weeks {
                            contributionDays {
                              date
                              contributionCount
                              color
                            }
                        }
                    } 
                }
            }
        }
        `
    });

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(query),
            "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
            "User-Agent": "OCDbug-GitHubFetcher/1.0"
        }
    }

    cachedHeatmap = await new Promise((resolve, reject) => {
        const req = https.request(GITHUB_API_URL, options, res => {
            let data = "";

            res.on("data", chunk => data += chunk);
            res.on("end", () => {
                try {
                    const parsed = JSON.parse(data);
                    
                    const days = parsed?.data?.user.contributionsCollection?.contributionCalendar?.weeks

                        .flatMap(week => week.contributionDays)
                        
                        .map(day => ({
                            date: day.date,
                            count: day.contributionCount,
                            color: day.color
                        }));

                    


                    if (!days) throw new Error("Invalid GitHub GraphQL response");

                    lastFetched = now;
                    resolve(days);

                } catch (err) {
                    reject(err);
                }
            });
        });

        req.on("error", reject);
        req.write(query);
        req.end();
    });

    return cachedHeatmap;
}



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




module.exports = {
    getUserAndRepos,
    getContributionHeatmap
};