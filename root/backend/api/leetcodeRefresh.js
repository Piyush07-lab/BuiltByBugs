const { fetchLeetCodeStats } = require('./leetcode');

function handleLeetCodeRefresh(req, res) {
    if (req.method === 'GET') {
        fetchLeetCodeStats()
            .then(data => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, data }));
            })
            .catch(err => {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            });

        return true;
    }

    return false;
}

module.exports = handleLeetCodeRefresh;