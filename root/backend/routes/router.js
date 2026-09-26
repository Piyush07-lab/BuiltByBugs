// Routes
import fs from "node:fs";
import path from "node:path";

import { handleHireRequest } from "../api/hireRequest.js";
import { handleContactRequest } from "../api/contact.js";
import { getGitHubContributions } from "../api/github-contributions.js";
import { getUserAndRepos } from "../utils/github.js";
import { handleGeminiChat } from "../api/geminiChat.js";
import { getLeetcodeStats } from "../api/leetcode.js";
import { getCodingActivity, getCodingSummary } from "../api/coding.js";

//---- github-summary ----//

const CACHE_TTL = 5 * 60 * 1000;

let githubCache = {
    timestamp: null,
    data: null,
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
            data: freshData,
        };

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(freshData));
    } catch (error) {
        console.error("[GitHub Summary error]", error);
        res.writeHead(502, { "Content-Type": "application/json" });
        res.end(
            JSON.stringify({
                error: "Failed to fetch GitHub summary",
                message: error.message,
            })
        );
    }
}

function sendMethodNotAllowed(res, allowMethods, customMessage) {
    res.writeHead(405, {
        "Content-Type": "application/json",
        Allow: allowMethods,
    });
    res.end(
        JSON.stringify({
            error: customMessage || "Method Not Allowed",
        })
    );
}

async function routeRequest(req, res) {
    try {
        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const { pathname } = parsedUrl;
        const { method } = req;

        console.log({
            url: req.url,
            pathname,
            method: req.method,
        });

        // HIRE REQUEST

        if (pathname === "/api/hireRequest") {
            if (method === "POST") return handleHireRequest(req, res);
            return sendMethodNotAllowed(res, "POST, OPTIONS");
        }

        // CONTACT REQUEST

        if (pathname === "/api/contact") {
            if (method === "POST") return handleContactRequest(req, res);
            return sendMethodNotAllowed(res, "POST, OPTIONS");
        }

        // CHAT BOX

        if (pathname === "/api/chat") {
            if (method === "POST") return handleGeminiChat(req, res);
            return sendMethodNotAllowed(res, "POST, OPTIONS");
        }

        // GITHUB SUMMARY

        if (pathname === "/api/github/summary") {
            if (method === "GET") return handleGitHubSummary(req, res);
            return sendMethodNotAllowed(res, "GET, OPTIONS");
        }

        // GITHUB CONTRIBUTION

        if (pathname === "/api/github-contributions") {
            if (method === "GET") return getGitHubContributions(req, res);
            return sendMethodNotAllowed(res, "GET, OPTIONS");
        }

        // CODING ACTIVITY (WAKA-TIME)

        if (pathname === "/api/coding") {
            if (method === "GET") return getCodingActivity(req, res);
            if (method === "POST") {
                return sendMethodNotAllowed(
                    res,
                    "GET, OPTIONS",
                    "Coding activity is read-only and synced from WakaTime."
                );
            }
            return sendMethodNotAllowed(res, "GET, OPTIONS");
        }

        // CODING SUMMARY

        if (pathname === "/api/coding/summary") {
            if (method === "GET") return getCodingSummary(req, res);
            return sendMethodNotAllowed(res, "GET, OPTIONS");
        }

        // LEETCODE API
        if (pathname === "/api/leetcode") {
            if (method === "GET") return getLeetcodeStats(req, res);
            return sendMethodNotAllowed(res, "GET, OPTIONS");
        }

        // LOGO
        if (pathname === "/api/assets/logo") {
            if (method !== "GET") {
                return sendMethodNotAllowed(res, "GET, OPTIONS");
            }

            const logoPath = path.join(import.meta.dirname, "../assets/B3Logo-plain.svg");

            fs.readFile(logoPath, (err, data) => {
                if (err) {
                    console.error("[Logo error]", err);
                    res.writeHead(500, { "Content-Type": "application/json" });
                    return res.end(
                        JSON.stringify({
                            error: "Unable to load logo.",
                        })
                    );
                }

                res.writeHead(200, {
                    "Content-Type": "image/svg+xml",
                    "Cache-Control": "public, max-age=86400",
                });
                res.end(data);
            });
            return;
        }

        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Route not found" }));
    } catch (error) {
        console.error("[Router error]", error);

        if (!res.headersSent) {
            res.writeHead(500, {
                "Content-Type": "application/json",
            });
            res.end(
                JSON.stringify({
                    error: "Internal Server error",
                })
            );
        }
    }
}

export { routeRequest };
