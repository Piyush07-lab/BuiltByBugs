const { fetchLeetCodeStats } = require('./leetcode');

function handleLeetCodeRefresh(req, res) {
    if (req.method === 'GET') {
        fetchLeetCodeStats()
            .then(data => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, data }));
            })
            .catch(error => {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: error.message }));
            });

        return true;
    }

    return false;
}

module.exports = handleLeetCodeRefresh;