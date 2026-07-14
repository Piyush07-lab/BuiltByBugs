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

function resolveSafePath(baseDir, requestPath) {
    const normalizedPath = path.normalize(requestPath);

    const resolvedBase = path.resolve(baseDir);

    const resolvedPath = path.resolve(
        baseDir,
        "." + normalizedPath
    );

    if (
        resolvedPath !== resolvedBase &&
        !resolvedPath.startsWith(resolvedBase + path.sep)
    ) {
        return null;
    }

    return resolvedPath;
}


const server = http.createServer((req, res) => {

    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);


    const allowedOrigins = [
        'http://localhost:5500',
        'http://localhost:3000',
        'https://builtbybugs.work.gd'
    ];

    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader(
            'Access-Control-Allow-Origin',
            origin
        );
    }

    res.setHeader('Access-Control-Allow-Methods',
        'GET, POST, OPTIONS'
    );

    res.setHeader('Access-Control-Allow-Headers',
        'Content-Type'
    );

    res.setHeader(
        "X-Content-Type-Options",
        "nosniff"
    );

    res.setHeader(
        "X-Frame-Options",
        "DENY"
    );

    res.setHeader(
        "Referrer-Policy",
        "strict-origin-when-cross-origin"
    );

    res.setHeader(
        "Permissions-Policy",
        [
            "accelerometer=()",
            "autoplay=()",
            "camera=()",
            "display-capture=()",
            "fullscreen=(self)",
            "geolocation=()",
            "gyroscope=()",
            "magnetometer=()",
            "microphone=()",
            "payment=()",
            "usb=()"
        ].join(", ")
    );

    res.setHeader(
        "Content-Security-Policy",
        [
            "default-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'none'",
            "object-src 'none'",
            "script-src 'self'",
            "style-src 'self'",
            "img-src 'self' data:",
            "font-src 'self'",
            "connect-src 'self'",
            "manifest-src 'self'",
            "worker-src 'self'",
            "media-src 'self'",
            "upgrade-insecure-requests"
        ].join("; ")
    );

    res.setHeader(
        "Cross-Origin-Opener-Policy",
        "same-origin"
    );

    res.setHeader(
        "Cross-Origin-Resource-Policy",
        "same-origin"
    );

    if (req.method === 'OPTIONS') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        return res.end('Response Positive');
    }



    if (parsedUrl.pathname === '/favicon.ico') {
        res.writeHead(204);
        return res.end();
    }

    if (parsedUrl.pathname.startsWith(
        "/api"
    )) {
        return routeRequest(req, res);
    }

    const requestedPath =
        parsedUrl.pathname === "/"
            ? "/index.html"
            : decodeURIComponent(parsedUrl.pathname);

    const filePath = resolveSafePath(
        frontendPath,
        requestedPath
    );

    if (filePath) {
        try {
            const stats = fs.statSync(filePath);

            if (stats.isFile()) {
                const contentType =
                    mimeTypes[path.extname(filePath).toLowerCase()]
                    || "application/octet-stream";

                const cacheControl =
                    path.basename(filePath) === "index.html"
                        ? "no-cache"
                        : "public, max-age=86400";

                res.writeHead(200, {
                    "Content-Type": contentType,
                    "Cache-Control": cacheControl
                });

                return fs
                    .createReadStream(filePath)
                    .pipe(res);
            }
        }
        catch (error) {
            console.error("[File Path]", error);
            
        }
    }

    routeRequest(req, res);
});

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port: ${PORT}`);
});



