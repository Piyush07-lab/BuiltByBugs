#!/usr/bin/env node

/**
 * Route Health Check & Status Confirmation Runner
 *
 * Automatically verifies all registered endpoints against a running backend
 * or by launching a transient test instance.
 */

import { server } from "../server.js";

const ROUTES = [
    { path: "/health", method: "GET", expected: 200, note: "Health check" },
    { path: "/favicon.ico", method: "GET", expected: 204, note: "Favicon" },
    {
        path: "/api/assets/logo",
        method: "GET",
        expected: 200,
        note: "Brand logo SVG",
    },
    {
        path: "/api/coding",
        method: "POST",
        expected: 405,
        note: "Read-only guard (405)",
    },
    {
        path: "/api/contact",
        method: "GET",
        expected: 405,
        note: "Method guard (405)",
    },
    {
        path: "/nonexistent-page",
        method: "GET",
        expected: 404,
        note: "Server 404 (JSON)",
    },
    {
        path: "/api/nonexistent-route",
        method: "GET",
        expected: 404,
        note: "Router 404 (JSON)",
    },
    {
        path: "/api/contact",
        method: "OPTIONS",
        expected: 204,
        note: "CORS preflight (204)",
    },
];

async function runRouteChecks() {
    let transientServer = null;
    let baseUrl = process.env.BASE_URL || "";

    if (!baseUrl) {
        // Start ephemeral server on port 0
        await new Promise((resolve) => {
            transientServer = server.listen(0, "127.0.0.1", () => {
                const addr = transientServer.address();
                baseUrl = `http://127.0.0.1:${addr.port}`;
                resolve();
            });
        });
    }

    console.log(`\n======================================================`);
    console.log(`   BACKEND ROUTE STATUS & CONFIRMATION AUDIT          `);
    console.log(`   Target: ${baseUrl}`);
    console.log(`======================================================\n`);

    const results = [];

    for (const route of ROUTES) {
        const start = performance.now();
        let status;
        let ok = false;

        try {
            const res = await fetch(`${baseUrl}${route.path}`, {
                method: route.method,
                headers:
                    route.method === "OPTIONS" ? { Origin: "http://localhost:5173" } : {},
            });
            status = res.status;
            ok = status === route.expected;
        } catch (err) {
            status = err.code || "ERR";
        }

        const duration = Math.round(performance.now() - start);

        results.push({
            Method: route.method,
            Path: route.path,
            Expected: route.expected,
            Actual: status || "ERR",
            Status: ok ? "✔ PASS" : "✖ MISMATCH",
            Time: `${duration}ms`,
            Note: route.note,
        });
    }

    console.table(results);

    if (transientServer) {
        await new Promise((resolve) => transientServer.close(resolve));
    }

    const allPassed = results.every((r) => r.Status === "✔ PASS");
    console.log(
        allPassed
            ? "\n✔ All route checks passed expected status criteria.\n"
            : "\n✖ Some routes did not match expected criteria.\n"
    );

    if (!allPassed) {
        process.exitCode = 1;
    }
}

runRouteChecks().catch((err) => {
    console.error("Route check execution failed:", err);
    process.exit(1);
});
