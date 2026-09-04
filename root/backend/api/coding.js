// WakaTime coding activity adapter.
// This file fetches real coding data from WakaTime, caches it, and exposes it
// through simple route handlers for the portfolio frontend.
require("dotenv").config({ path: __dirname + "/.env" });
// Default WakaTime endpoint used when WAKATIME_API_URL is not set in .env.
const DEFAULT_WAKATIME_API_URL =
    "https://api.wakatime.com/api/v1/users/current/stats/last_7_days";

// Default cache lifetime: 15 minutes.
const DEFAULT_CACHE_TTL_MS = 15 * 60 * 1000;

// Allows the cache duration to be overridden from backend/.env.
const cacheTtlMs = Number(
    process.env.WAKATIME_CACHE_TTL_MS
) || DEFAULT_CACHE_TTL_MS;

// In-memory cache for the latest successful WakaTime response.
// This resets whenever the backend process restarts.
let wakatimeCache = {
    data: null,
    fetchedAt: null,
    expiresAt: 0
};

// Sends a JSON response with consistent headers.
function sendJson(res, statusCode, payload) {
    res.writeHead(statusCode, {
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
    });

    res.end(JSON.stringify(payload));
}

// Reads WakaTime config from environment variables.
// The API key must stay on the backend and should never be sent to React.
function getWakaTimeConfig() {
    const apiKey = process.env.WAKATIME_API_KEY;
    const apiUrl = process.env.WAKATIME_API_URL || DEFAULT_WAKATIME_API_URL;

    if (!apiKey) {
        throw new Error("Missing WAKATIME_API_KEY in backend environment.");
    }

    return { apiKey, apiUrl };
}

// WakaTime supports API-key auth through a Basic Authorization header.
function getAuthHeader(apiKey) {
    return `Basic ${Buffer.from(apiKey).toString("base64")}`;
}

// Makes the actual GET request to WakaTime and normalizes the response wrapper.
async function fetchWakaTimeData() {
    // Step 1: Load the WakaTime API key and target URL.
    const { apiKey, apiUrl } = getWakaTimeConfig();

    // Step 2: Call WakaTime from the backend with the secret key.
    const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Authorization": getAuthHeader(apiKey)
        }
    });

    // Step 3: Read the response body as text first so JSON parse errors are clear.
    const body = await response.text();
    let payload;

    // Step 4: Convert WakaTime's JSON string response into a JavaScript object.
    try {
        payload = JSON.parse(body);
    }
    catch (error) {
        throw new Error("WakaTime returned a non-JSON response.");
    }

    // Step 5: Turn unsuccessful WakaTime responses into useful backend errors.
    if (!response.ok) {
        const message =
            payload.error ||
            payload.errors?.[0]?.message ||
            `WakaTime request failed with status ${response.status}.`;

        throw new Error(message);
    }

    // Step 6: Return one predictable object for the rest of this backend module.
    return {
        source: "wakatime",
        endpoint: apiUrl,
        fetchedAt: new Date().toISOString(),
        cacheTtlMs,
        data: payload.data ?? payload
    };
}

// Returns cached WakaTime data when possible, otherwise refreshes it.
async function getCachedWakaTimeData({ forceRefresh = false } = {}) {
    const now = Date.now();

    // Step 1: If the cache is still fresh, return it immediately.
    if (
        !forceRefresh &&
        wakatimeCache.data &&
        now < wakatimeCache.expiresAt
    ) {
        return {
            ...wakatimeCache.data,
            cache: {
                hit: true,
                stale: false,
                fetchedAt: wakatimeCache.fetchedAt,
                expiresAt: new Date(wakatimeCache.expiresAt).toISOString()
            }
        };
    }

    // Step 2: If there is no fresh cache, request fresh data from WakaTime.
    try {
        const freshData = await fetchWakaTimeData();

        // Step 3: Store the successful WakaTime response in memory.
        wakatimeCache = {
            data: freshData,
            fetchedAt: freshData.fetchedAt,
            expiresAt: now + cacheTtlMs
        };

        // Step 4: Return the fresh data and mark it as a cache miss.
        return {
            ...freshData,
            cache: {
                hit: false,
                stale: false,
                fetchedAt: wakatimeCache.fetchedAt,
                expiresAt: new Date(wakatimeCache.expiresAt).toISOString()
            }
        };
    }
    catch (error) {
        // Step 5: If refresh fails but old data exists, keep the portfolio alive.
        if (wakatimeCache.data) {
            return {
                ...wakatimeCache.data,
                cache: {
                    hit: true,
                    stale: true,
                    fetchedAt: wakatimeCache.fetchedAt,
                    expiresAt: new Date(wakatimeCache.expiresAt).toISOString(),
                    error: error.message
                }
            };
        }

        // Step 6: If there is no cache yet, let the route handler return an error.
        throw error;
    }
}

// Converts WakaTime seconds into rounded whole minutes for simpler UI display.
function toMinutes(seconds) {
    return Math.round((Number(seconds) || 0) / 60);
}

// Converts repeated WakaTime lists, like languages or projects, into one UI shape.
function summarizeList(items = []) {
    return items.map((item) => ({
        name: item.name,
        text: item.text,
        percent: item.percent,
        totalSeconds: item.total_seconds,
        totalMinutes: toMinutes(item.total_seconds)
    }));
}

// Shapes the raw WakaTime stats response into frontend-friendly portfolio data.
function buildCodingSummary(wakatimePayload) {
    // Step 1: Pull the actual stats object out of the cached WakaTime payload.
    const stats = wakatimePayload.data || {};

    // Step 2: Normalize languages once so it can be reused below.
    const languages = summarizeList(stats.languages);

    // Step 3: Return only the fields the frontend is likely to render.
    return {
        source: wakatimePayload.source,
        fetchedAt: wakatimePayload.fetchedAt,
        cache: wakatimePayload.cache,
        range: stats.range || null,
        isUpToDate: stats.is_up_to_date,
        percentCalculated: stats.percent_calculated,
        totalSeconds: stats.total_seconds,
        totalMinutes: toMinutes(stats.total_seconds),
        totalText: stats.human_readable_total || stats.text || "",
        dailyAverageSeconds: stats.daily_average,
        dailyAverageText: stats.daily_average_including_other_language_text || "",
        bestDay: stats.best_day || null,
        languages,
        editors: summarizeList(stats.editors),
        operatingSystems: summarizeList(stats.operating_systems),
        projects: summarizeList(stats.projects),
        categories: summarizeList(stats.categories),

        // Step 4: Keep a simple language-to-minutes map for compact widgets.
        languageBreakdown: languages.reduce((breakdown, language) => {
            breakdown[language.name] = language.totalMinutes;
            return breakdown;
        }, {})
    };
}

// Route handler for GET /api/coding.
// Sends the cached raw-ish WakaTime data to the frontend.
async function getCodingActivity(req, res) {
    try {
        // Step 1: Read ?refresh=true when you want to bypass the current cache.
        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const forceRefresh = parsedUrl.searchParams.get("refresh") === "true";

        // Step 2: Get cached data or fetch fresh WakaTime data.
        const payload = await getCachedWakaTimeData({ forceRefresh });

        // Step 3: Ship the data through router.js as JSON.
        sendJson(res, 200, payload);
    }
    catch (error) {
        // Step 4: Return a clean backend error if WakaTime cannot be reached.
        console.error("[WakaTime activity error]", error);

        sendJson(res, 502, {
            error: "Failed to fetch WakaTime coding activity.",
            message: error.message
        });
    }
}

// Route handler for GET /api/coding/summary.
// Sends a smaller, render-ready version of the WakaTime stats.
async function getCodingSummary(req, res) {
    try {
        // Step 1: Read ?refresh=true when you want to bypass the current cache.
        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const forceRefresh = parsedUrl.searchParams.get("refresh") === "true";

        // Step 2: Get cached data or fetch fresh WakaTime data.
        const payload = await getCachedWakaTimeData({ forceRefresh });

        // Step 3: Transform the WakaTime data before sending it to React.
        sendJson(res, 200, buildCodingSummary(payload));
    }
    catch (error) {
        // Step 4: Return a clean backend error if summary data cannot be built.
        console.error("[WakaTime summary error]", error);

        sendJson(res, 502, {
            error: "Failed to fetch WakaTime coding summary.",
            message: error.message
        });
    }
}

// Expose route handlers for backend/routes/router.js.
module.exports = {
    getCodingActivity,
    getCodingSummary
};
