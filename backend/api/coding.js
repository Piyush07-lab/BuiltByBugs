// Coding Activity tracker
const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "../data/activity-log.json");

if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, "[]", "utf-8");
}

function getCodingActivity(req, res) {
    const raw = fs.readFileSync(logFilePath, "utf-8");
    const logs = JSON.parse(raw);

    res.writeHead(200, { "Content-Type": "application/json" });
    req.end(JSON.stringify(logs));
}

function postCodingActivity(req, res) {
    let body = "";

    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
        try {
            const newEntry = JSON.parse(body);
            const raw = fs.readFileSync(logFilePath, "utf-8");
            const logs = JSON.parse(raw);

            logs.push(newEntry);

            fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2), "utf-8");

            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Activity logged successfully." }));
        } catch (err) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Invalid JSON payload" }));
        }
    });
}

module.exports = { getCodingActivity, postCodingActivity };