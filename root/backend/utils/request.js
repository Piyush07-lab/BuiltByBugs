/**
 * Reads and parses JSON from an incoming HTTP request stream.
 * Protects against payload flooding (MAX_BODY_SIZE), handles stream errors,
 * and ensures safe termination of streams.
 *
 * @param {import('node:http').IncomingMessage} req
 * @param {import('node:http').ServerResponse} res
 * @param {number} [maxBytes=1048576] 1MB default
 * @returns {Promise<any|null>} Parsed JSON object, or null if response was already sent.
 */
export function readJsonBody(req, res, maxBytes = 1024 * 1024) {
    return new Promise((resolve) => {
        let body = "";
        let isAborted = false;

        req.on("data", (chunk) => {
            if (isAborted) return;
            body += chunk;

            if (body.length > maxBytes) {
                isAborted = true;
                res.writeHead(413, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Payload too large" }));
                req.destroy();
                resolve(null);
            }
        });

        req.on("error", (err) => {
            if (isAborted) return;
            isAborted = true;
            if (!res.headersSent) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: `Stream error: ${err.message}` }));
            }
            resolve(null);
        });

        req.on("end", () => {
            if (isAborted || res.writableEnded || res.headersSent) {
                return resolve(null);
            }

            try {
                const parsed = JSON.parse(body);
                resolve(parsed);
            } catch {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid JSON payload" }));
                resolve(null);
            }
        });
    });
}
