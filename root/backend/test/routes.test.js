import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";

process.env.NODE_ENV = "test";
import { server } from "../server.js";

let baseUrl = "";

describe("Backend Routes & Status Confirmation Suite", () => {
    before(async () => {
        await new Promise((resolve) => {
            server.listen(0, "127.0.0.1", () => {
                const addr = server.address();
                baseUrl = `http://127.0.0.1:${addr.port}`;
                resolve();
            });
        });
    });

    after(async () => {
        await new Promise((resolve, reject) => {
            server.close((err) => (err ? reject(err) : resolve()));
        });
    });

    describe("Core Infrastructure & Health Endpoints", () => {
        it("GET /health should return 200 OK with json payload", async () => {
            const res = await fetch(`${baseUrl}/health`);
            assert.equal(res.status, 200);
            assert.match(res.headers.get("content-type"), /application\/json/);

            const body = await res.json();
            assert.equal(body.status, "ok");
            assert.ok(typeof body.uptime === "number");
            assert.ok(typeof body.timestamp === "string");
        });

        it("GET /favicon.ico should return 204 No Content", async () => {
            const res = await fetch(`${baseUrl}/favicon.ico`);
            assert.equal(res.status, 204);
        });

        it("OPTIONS preflight should return 204 No Content with CORS headers", async () => {
            const res = await fetch(`${baseUrl}/api/contact`, {
                method: "OPTIONS",
                headers: {
                    Origin: "http://localhost:5173",
                },
            });
            assert.equal(res.status, 204);
            assert.equal(
                res.headers.get("access-control-allow-origin"),
                "http://localhost:5173"
            );
            assert.ok(res.headers.get("access-control-allow-methods"));
        });

        it("GET /nonexistent should return 404 JSON for non-api route", async () => {
            const res = await fetch(`${baseUrl}/nonexistent`);
            assert.equal(res.status, 404);
            assert.match(res.headers.get("content-type"), /application\/json/);
            const body = await res.json();
            assert.equal(body.error, "Endpoint not found");
        });

        it("GET /api/nonexistent should return 404 JSON for unmatched api route", async () => {
            const res = await fetch(`${baseUrl}/api/nonexistent`);
            assert.equal(res.status, 404);
            assert.match(res.headers.get("content-type"), /application\/json/);
            const body = await res.json();
            assert.equal(body.error, "Route not found");
        });
    });

    describe("Static Assets", () => {
        it("GET /api/assets/logo should serve SVG with 200 OK", async () => {
            const res = await fetch(`${baseUrl}/api/assets/logo`);
            assert.equal(res.status, 200);
            assert.match(res.headers.get("content-type"), /image\/svg\+xml/);
            assert.ok(res.headers.get("cache-control")?.includes("max-age"));
            const svgContent = await res.text();
            assert.ok(svgContent.includes("<svg"));
        });

        it("POST /api/assets/logo should return 405 Method Not Allowed", async () => {
            const res = await fetch(`${baseUrl}/api/assets/logo`, {
                method: "POST",
            });
            assert.equal(res.status, 405);
            assert.equal(res.headers.get("allow"), "GET, OPTIONS");
            const body = await res.json();
            assert.equal(body.error, "Method Not Allowed");
        });
    });

    describe("Contact & Hire Request Routes", () => {
        it("GET /api/contact should return 405 Method Not Allowed with Allow header", async () => {
            const res = await fetch(`${baseUrl}/api/contact`);
            assert.equal(res.status, 405);
            assert.equal(res.headers.get("allow"), "POST, OPTIONS");
            const body = await res.json();
            assert.equal(body.error, "Method Not Allowed");
        });

        it("GET /api/hireRequest should return 405 Method Not Allowed with Allow header", async () => {
            const res = await fetch(`${baseUrl}/api/hireRequest`);
            assert.equal(res.status, 405);
            assert.equal(res.headers.get("allow"), "POST, OPTIONS");
            const body = await res.json();
            assert.equal(body.error, "Method Not Allowed");
        });

        it("POST /api/contact with invalid JSON should return 400", async () => {
            const res = await fetch(`${baseUrl}/api/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: "invalid-json{",
            });
            assert.equal(res.status, 400);
            const body = await res.json();
            assert.equal(body.error, "Invalid JSON payload");
        });

        it("POST /api/contact with missing fields should return 400", async () => {
            const res = await fetch(`${baseUrl}/api/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: "" }),
            });
            assert.equal(res.status, 400);
            const body = await res.json();
            assert.ok(body.error);
        });

        it("POST /api/contact with oversized payload (>1MB) should return 413", async () => {
            const largeData = "x".repeat(1024 * 1024 + 100);
            const res = await fetch(`${baseUrl}/api/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: "A", email: "a@b.com", details: largeData }),
            });
            assert.equal(res.status, 413);
            const body = await res.json();
            assert.equal(body.error, "Payload too large");
        });

        it("POST /api/hireRequest with invalid JSON should return 400", async () => {
            const res = await fetch(`${baseUrl}/api/hireRequest`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: "{not-valid-json",
            });
            assert.equal(res.status, 400);
            const body = await res.json();
            assert.equal(body.error, "Invalid JSON payload");
        });

        it("POST /api/hireRequest with missing fields should return 400", async () => {
            const res = await fetch(`${baseUrl}/api/hireRequest`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: "Test" }),
            });
            assert.equal(res.status, 400);
            const body = await res.json();
            assert.ok(body.error);
        });
    });

    describe("Coding, Chat & LeetCode Routes", () => {
        it("POST /api/coding should return 405 Method Not Allowed with custom message", async () => {
            const res = await fetch(`${baseUrl}/api/coding`, {
                method: "POST",
            });
            assert.equal(res.status, 405);
            assert.equal(res.headers.get("allow"), "GET, OPTIONS");
            const body = await res.json();
            assert.ok(body.error.includes("read-only"));
        });

        it("POST /api/leetcode should return 405 Method Not Allowed", async () => {
            const res = await fetch(`${baseUrl}/api/leetcode`, {
                method: "POST",
            });
            assert.equal(res.status, 405);
            assert.equal(res.headers.get("allow"), "GET, OPTIONS");
            const body = await res.json();
            assert.equal(body.error, "Method Not Allowed");
        });

        it("POST /api/chat with non-array messages should return 400", async () => {
            const res = await fetch(`${baseUrl}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: "invalid string" }),
            });
            assert.equal(res.status, 400);
            const body = await res.json();
            assert.equal(body.error, "Invalid messages format");
        });

        it("POST /api/chat with oversized payload (>512KB) should return 413", async () => {
            const largeData = "x".repeat(512 * 1024 + 100);
            const res = await fetch(`${baseUrl}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [{ role: "user", parts: [{ text: largeData }] }],
                }),
            });
            assert.equal(res.status, 413);
            const body = await res.json();
            assert.equal(body.error, "Payload too large");
        });
    });
});
