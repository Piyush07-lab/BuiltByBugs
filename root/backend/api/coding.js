
const DEFAULT_WAKATIME_API_URL =
    "https://api.wakatime.com/api/v1/users/current/stats/last_7_days";

const DEFAULT_CACHE_TTL_MS = 15 * 60 * 1000;

const cacheTtlMs = Number(process.env.WAKATIME_CACHE_TTL_MS) || DEFAULT_CACHE_TTL_MS;

// In-memory cache for the latest successful WakaTime response.
let wakatimeCache = {
    data: null,
    fetchedAt: null,
    expiresAt: 0,
};

function sendJson(res, statusCode, payload) {
    res.writeHead(statusCode, {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
    });

    res.end(JSON.stringify(payload));
}

function getWakaTimeConfig() {
    const apiKey = process.env.WAKATIME_API_KEY;
    const apiUrl = process.env.WAKATIME_API_URL || DEFAULT_WAKATIME_API_URL;

    if (!apiKey) {
        throw new Error("Missing WAKATIME_API_KEY in backend environment.");
    }

    return { apiKey, apiUrl };
}

function getAuthHeader(apiKey) {
    return `Basic ${Buffer.from(apiKey).toString("base64")}`;
}

// Makes the actual GET request to WakaTime and normalizes the response wrapper.
async function fetchWakaTimeData() {
    const { apiKey, apiUrl } = getWakaTimeConfig();

    const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: getAuthHeader(apiKey),
        },
    });

    const body = await response.text();
    let payload;

    try {
        payload = JSON.parse(body);
    } catch (error) {
        throw new Error("WakaTime returned a non-JSON response.", { cause: error });
    }

    if (!response.ok) {
        const message =
            payload.error ||
            payload.errors?.[0]?.message ||
            `WakaTime request failed with status ${response.status}.`;

        throw new Error(message);
    }

    return {
        source: "wakatime",
        endpoint: apiUrl,
        fetchedAt: new Date().toISOString(),
        cacheTtlMs,
        data: payload.data ?? payload,
    };
}

async function getCachedWakaTimeData({ forceRefresh = false } = {}) {
    const now = Date.now();

    if (!forceRefresh && wakatimeCache.data && now < wakatimeCache.expiresAt) {
        return {
            ...wakatimeCache.data,
            cache: {
                hit: true,
                stale: false,
                fetchedAt: wakatimeCache.fetchedAt,
                expiresAt: new Date(wakatimeCache.expiresAt).toISOString(),
            },
        };
    }

    try {
        const freshData = await fetchWakaTimeData();

        wakatimeCache = {
            data: freshData,
            fetchedAt: freshData.fetchedAt,
            expiresAt: now + cacheTtlMs,
        };

        return {
            ...freshData,
            cache: {
                hit: false,
                stale: false,
                fetchedAt: wakatimeCache.fetchedAt,
                expiresAt: new Date(wakatimeCache.expiresAt).toISOString(),
            },
        };
    } catch (error) {
        if (wakatimeCache.data) {
            return {
                ...wakatimeCache.data,
                cache: {
                    hit: true,
                    stale: true,
                    fetchedAt: wakatimeCache.fetchedAt,
                    expiresAt: new Date(wakatimeCache.expiresAt).toISOString(),
                    error: error.message,
                },
            };
        }

        throw error;
    }
}

function toMinutes(seconds) {
    return Math.round((Number(seconds) || 0) / 60);
}

function summarizeList(items = []) {
    return items.map((item) => ({
        name: item.name,
        text: item.text,
        percent: item.percent,
        totalSeconds: item.total_seconds,
        totalMinutes: toMinutes(item.total_seconds),
    }));
}

function buildCodingSummary(wakatimePayload) {
    const stats = wakatimePayload.data || {};

    const languages = summarizeList(stats.languages);

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

        languageBreakdown: languages.reduce((breakdown, language) => {
            breakdown[language.name] = language.totalMinutes;
            return breakdown;
        }, {}),
    };
}

async function getCodingActivity(req, res) {
    try {
        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const forceRefresh = parsedUrl.searchParams.get("refresh") === "true";

        const payload = await getCachedWakaTimeData({ forceRefresh });

        sendJson(res, 200, payload);
    } catch (error) {
        console.error("[WakaTime activity error]", error);

        sendJson(res, 502, {
            error: "Failed to fetch WakaTime coding activity.",
            message: error.message,
        });
    }
}

async function getCodingSummary(req, res) {
    try {
        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const forceRefresh = parsedUrl.searchParams.get("refresh") === "true";

        const payload = await getCachedWakaTimeData({ forceRefresh });

        sendJson(res, 200, buildCodingSummary(payload));
    } catch (error) {
        console.error("[WakaTime summary error]", error);

        sendJson(res, 502, {
            error: "Failed to fetch WakaTime coding summary.",
            message: error.message,
        });
    }
}

export { getCodingActivity, getCodingSummary };
