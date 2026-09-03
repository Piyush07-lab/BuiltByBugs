const { isValidContactRequest } = require('../utils/spamFilter');
const { saveContactRequest } = require('../services/inquiryService');

async function handleContactRequest(req, res) {

    if (req.method !== 'POST') {
        res.writeHead(405, {
            'Content-Type': 'application/json'
        });

        res.end(JSON.stringify({
            error: 'Method Not Allowed'
        }));

        return;
    }

    const MAX_BODY_SIZE = 1024 * 1024;

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
        if (res.writableEnded || res.headersSent) return;

        try {

            const data = JSON.parse(body);

            const validation = isValidContactRequest(data);

            if (!validation.ok) {

                res.writeHead(400, {
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({
                    error: validation.reason
                }));

                return;

            }

            await saveContactRequest(data);

            res.writeHead(200, {
                'Content-Type': 'application/json'
            });

            res.end(JSON.stringify({
                success: true
            }));

        } catch (error) {

            console.error('[Contact API Error]', error);

            if (error instanceof SyntaxError) {

                res.writeHead(400, {
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({
                    error: 'Invalid JSON payload'
                }));

                return;

            }

            res.writeHead(500, {
                'Content-Type': 'application/json'
            });

            res.end(JSON.stringify({
                error: 'Internal server error'
            }));

        }

    });

}

module.exports = {
    handleContactRequest
};