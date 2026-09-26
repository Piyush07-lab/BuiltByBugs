import { isValidHireRequest } from "../utils/spamFilter.js";
import { saveHireRequest } from "../services/inquiryService.js";
import { readJsonBody } from "../utils/request.js";

async function handleHireRequest(req, res) {
    if (req.method !== "POST") {
        res.writeHead(405, {
            "Content-Type": "application/json",
            Allow: "POST, OPTIONS",
        });
        return res.end(JSON.stringify({ error: "Method Not Allowed" }));
    }

    const data = await readJsonBody(req, res);
    if (!data) return;

    try {
        const validation = isValidHireRequest(data);

        if (!validation.ok) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: validation.reason }));
        }

        await saveHireRequest(data);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));
    } catch (error) {
        console.error("[Hire API error]", error);
        if (!res.headersSent) {
            res.writeHead(500, {
                "Content-Type": "application/json",
            });
            res.end(
                JSON.stringify({
                    error: "Internal server error",
                })
            );
        }
    }
}

export { handleHireRequest };
