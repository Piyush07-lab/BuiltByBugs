require("dotenv").config({ path: __dirname + "/.env" });

const http = require('http');
const { URL } = require('url');
const { routeRequest } = require('./routes/router.js');

const PORT = 5500;

const fs = require("fs");
const path = require("path");

const frontendPath = path.join(__dirname, "../frontend");


const server = http.createServer((req, res) => {

    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);


    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');


    if (req.method === 'OPTIONS') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        return res.end('Response Positive');
    }


    if (parsedUrl.pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        return res.end('Hello from backend');
    }


    if (parsedUrl.pathname === '/favicon.ico') {
        res.writeHead(204);
        return res.end();
    }

    const filePath = path.join(
        frontendPath,
        parsedUrl.pathname === "/"
        ? "index.html"
        : parsedUrl.pathname
    );

    if (
        fs.existsSync(filePath)
        &&
        fs.statSync(filePath).isFile()
    ){
        return fs
            .createReadStream(filePath)
            .pipe(res);
    }

    routeRequest(req, res);
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});



