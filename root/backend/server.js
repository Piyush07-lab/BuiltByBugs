require("dotenv").config({ path: __dirname + "/.env" });

const http = require('http');
const { URL } = require('url');
const { routeRequest } = require('./routes/router.js');

const PORT = process.env.PORT || 5500;

const fs = require("fs");
const path = require("path");

const frontendPath = path.join(__dirname, "../frontend");

const mimeTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".woff": "font/woff",
    ".woff2": "font/woff2"
};


const server = http.createServer((req, res) => {

    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);


    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');


    if (req.method === 'OPTIONS') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        return res.end('Response Positive');
    }


    // if (parsedUrl.pathname === '/') {
    //     res.writeHead(200, { 'Content-Type': 'text/plain' });
    //     return res.end('Hello from backend');
    // }


    if (parsedUrl.pathname === '/favicon.ico') {
        res.writeHead(204);
        return res.end();
    }

    if (parsedUrl.pathname.startsWith(
        "/api"
    )){
        return routeRequest(req,res);
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
        const contentType = mimeTypes[path.extname(filePath).toLowerCase()]
            || "application/octet-stream";

        res.writeHead(200, { "Content-Type": contentType });

        return fs
            .createReadStream(filePath)
            .pipe(res);
    }

    routeRequest(req, res);
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});



