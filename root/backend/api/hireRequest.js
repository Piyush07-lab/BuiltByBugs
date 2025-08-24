const fs = require('fs');
const path = require('path');
const { isValidHireRequest } = require('../utils/spamFilter');

async function handleHireRequest(req, res) {
    if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        return;
    }

    let body = '';

    req.on('data', chunk => { body += chunk; });

    req.on('end', () => {
        try {
            const data = JSON.parse(body);
            const validation = isValidHireRequest(data);

            if (!validation.ok) {
                res.writeHead(400, { 'Content-Type': 'application/json'});
                res.end(JSON.stringify({ error: validation.reason }));
                return;
            }

            const savePath = path.join(__direname, '../data/hire-requests.json');
            const existing = fs.existsSync(savePath) ? JSON.parse(fs.readFileSync(savePath)) : [];
            existing.push({ ...data, timestamp: new date().toISOString() });
            
            fs.writeFileSync(savePath, JSON.stringify(existing, null, 2));

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));

        } catch (err) {
            console.error('[Hire API Error]', err);
            res.writeHead(500, { 'Content-Type': 'appliction/json' });
            res.end(JSON.stringify({ error: 'Internal server error' }));
        }
    });
};

module.exports = { handleHireRequest };