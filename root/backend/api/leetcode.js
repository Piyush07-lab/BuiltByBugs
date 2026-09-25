let cachedData = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 60 * 60 * 1000;

export async function fetchLeetcodeData() {
    const endpoint = process.env.LEETCODE_ENDPOINT_URL;
    const username = process.env.LEETCODE_USER;

    if (!endpoint) {
        throw new Error("Missing endpoint url (LEETCODE_ENDPOINT_URL)!");
    }
    if (!username) {
        throw new Error("Missing username (LEETCODE_USER)!");
    }

    const now = Date.now();
    if (cachedData && now - lastFetchTime < CACHE_TTL_MS) {
        return cachedData;
    }

    const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
          totalSubmissionNum {
            difficulty
            count
            submissions
          }
        }
        profile {
          ranking
          reputation
        }
      }
    }
  `;

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Referer: "https://leetcode.com",
            },
            body: JSON.stringify({
                query,
                variables: { username },
            }),
        });

        if (!response.ok) {
            throw new Error(`LeetCode API responded with status ${response.status}`);
        }

        const payload = await response.json();

        if (payload.errors && payload.errors.length > 0) {
            throw new Error(`GraphQL Error: ${payload.errors[0].message}`);
        }

        const matchedUser = payload.data?.matchedUser;
        if (!matchedUser) {
            throw new Error(`User "${username}" not found on LeetCode.`);
        }

        // Update cache
        cachedData = matchedUser;
        lastFetchTime = now;

        return matchedUser;
    } catch (error) {
        console.error("Failed to fetch LeetCode stats:", error.message);
        throw error;
    }
}

export async function getLeetcodeStats(req, res) {
    try {
        const data = await fetchLeetcodeData();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
    } catch (error) {
        res.writeHead(502, { "Content-Type": "application/json" });
        res.end(
            JSON.stringify({
                error: "Failed to fetch LeetCode statistics",
                message: error.message,
            })
        );
    }
}
