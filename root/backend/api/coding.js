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
    res.end(JSON.stringify(logs));
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

function getCodingSummary(req, res) {
    const raw = fs.readFileSync(logFilePath, "utf-8");
    const logs = JSON.parse(raw);


    logs.sort((a, b) => new Date(a.date) - new Date(b.date));

    let totalMinutes = 0;
    let uniqueDates = new Set();
    let langMap = {};

    let currentStreak = 0;
    let longestStreak = 0;
    let prevDate = null;

    for (const log of logs) {

        const { date, minutes, languages } = log;

        totalMinutes += minutes;
        uniqueDates.add(date);


        for (const lang of (languages || [])) {
            langMap[lang] = (langMap[lang] || 0) + 1;
        }

        const curr = new Date(date);

        if (!prevDate) {

            currentStreak = 1;
            prevDate = curr;

            longestStreak = Math.max(longestStreak, currentStreak);

            continue;
        }

        const diff = (curr - prevDate) / (1000 * 60 * 60 * 24);

        if (diff === 1) {
            currentStreak++
        } 
        else {
            currentStreak = 1;
        }

        longestStreak = Math.max(longestStreak, currentStreak);

        prevDate = curr;

    }
    const summary = {
        totalDays: uniqueDates.size,
        totalMinutes,
        currentStreak,
        longestStreak,
        languageBreakdown: langMap
    };
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(summary));
}

module.exports = {
    getCodingActivity,
    postCodingActivity,
    getCodingSummary
};