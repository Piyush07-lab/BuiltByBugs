require("dotenv").config({ path: __dirname + "/.env" });

const http = require('http');
const { URL } = require('url');
const { routeRequest } = require('./routes/router.js');

const PORT = process.env.PORT || 5500;

function getAllowedOrigins() {
    const envOrigins = process.env.ALLOWED_ORIGINS;
    if (envOrigins) {
        return envOrigins
            .split(',')
            .map(origin => origin.trim().replace(/\/+$/, ''))
            .filter(Boolean);
    }
    return [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:5500',
        'https://builtbybugs.in'
    ];
}

const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

    const allowedOrigins = getAllowedOrigins();
    const origin = req.headers.origin;

    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
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
            "style-src 'self' https://fonts.googleapis.com",
            "img-src 'self' data:",
            "font-src 'self' https://fonts.gstatic.com",
            "connect-src 'self'",
            "manifest-src 'self'",
            "worker-src 'self'",
            "media-src 'self'",
            "upgrade-insecure-requests"
        ].join("; ")
    );

    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

    if (req.method === 'OPTIONS') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        return res.end('Response Positive');
    }

    if (parsedUrl.pathname === '/favicon.ico') {
        res.writeHead(204);
        return res.end();
    }

    if (parsedUrl.pathname === '/health' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ 
            status: 'ok', 
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        }));
    }

    if (parsedUrl.pathname.startsWith("/api")) {
        return routeRequest(req, res);
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: "Endpoint not found" }));
});

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port: ${PORT}`);
});
