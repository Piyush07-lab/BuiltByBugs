//Leetcode tracker api

require("dotenv").config();
console.log("Session cookie:", process.env.LEETCODE_SESSION);
const https = require("https");

function getLeetCodeStats(username, callback) {
    const query = JSON.stringify({
        query: `
         query userProfile($username: String!) {
          matchedUser(username: $username) {
            username
            profile {
              reputation
              ranking
              starRating
            }
            submitStats: submitStatsGlobal {
              acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
       }
     }
     `,
        variables: {
            username
        }
    });

    const options = {
        hostname: "leetcode.com",
        path: "/graphql",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(query),
            "Cookie": `LEETCODE_SESSION=${process.env.LEETCODE_SESSION}`,
            "Referer": "https://leetcode.com/",
            "Origin": "https://leetcode.com/",
            "User-Agent": "Mozilla/5.0 (Node.js)"
        }
    };

    const req = https.request(options, res => {
        let data = "";

        res.on("data", chunk => data += chunk);
        res.on("end", () => {
            try {
                const result = JSON.parse(data);
                console.log("LeetCode response:", result);
                callback(null, result);
            } catch (err) {
                callback(err, null);
            }
        });
    });

    req.on("error", err => callback(err, null));

    console.log("Sending request to LeetCode...");
    console.log("Headers:", options.headers);
    console.log("Body:", query);



    req.write(query);
    req.end();
}

module.exports = getLeetCodeStats;


