const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const { isValidHireRequest } = require('../utils/spamFilter');

async function handleHireRequest(req, res) {
    if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        return;
    }

    const MAX_BODY_SIZE = 1024 * 1024; // 1MB

    let body = '';

    req.on('data', chunk => {
        body += chunk;

        if (body.length > MAX_BODY_SIZE) {
            res.writeHead(413, {
                'Content-Type': 'application/json'
            });

            res.end(JSON.stringify({
                error: 'Payload too large'
            }));

            req.destroy();
        }
    });

    req.on('end', async () => {
        try {
            const data = JSON.parse(body);
            const validation = isValidHireRequest(data);

            if (!validation.ok) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: validation.reason }));
                return;
            }

            const savePath = path.join(
                __dirname,
                '../data/hire-requests.json'
            );

            let existing = [];

            try {
                await fsPromises.access(savePath);

                const fileContent =
                    await fsPromises.readFile(
                        savePath,
                        'utf8'
                    );

                existing = JSON.parse(fileContent);
            }
            catch {
                existing = [];
            }

            existing.push({
                ...data,
                timestamp: new Date().toISOString()
            });

            await fsPromises.writeFile(
                savePath,
                JSON.stringify(existing, null, 2),
                'utf8'
            );

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));

        } catch (err) {
            console.error('[Hire API Error]', err);

            if (err instanceof SyntaxError) {
                res.writeHead(400, {
                    'Content-Type': 'application/json'
                });

                return res.end(JSON.stringify({
                    error: 'Invalid JSON payload'
                }));
            }

            res.writeHead(500, {
                'Content-Type': 'application/json'
            });

            res.end(JSON.stringify({
                error: 'Internal server error'
            }));
        }
    });
};

module.exports = { handleHireRequest };