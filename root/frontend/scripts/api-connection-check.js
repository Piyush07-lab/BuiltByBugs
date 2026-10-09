#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Frontend API Connection & Status Probe Runner
 *
 * Verifies live endpoint connectivity, HTTP status codes, and latency against
 * a running backend instance or staging URL.
 */

const BASE_URL =
  process.env.VITE_API_BASE_URL || process.env.BASE_URL || 'http://localhost:5500';
const IS_STRICT = process.argv.includes('--strict');

const ENDPOINTS = [
  { path: '/health', method: 'GET', expected: 200, note: 'Backend health check' },
  { path: '/api/assets/logo', method: 'GET', expected: 200, note: 'Logo asset' },
  { path: '/api/coding', method: 'GET', expected: 200, note: 'WakaTime activity' },
  { path: '/api/coding/summary', method: 'GET', expected: 200, note: 'Coding summary' },
  {
    path: '/api/github/summary',
    method: 'GET',
    expected: 200,
    note: 'GitHub profile & repos',
  },
  {
    path: '/api/github-contributions',
    method: 'GET',
    expected: 200,
    note: 'Contributions',
  },
  {
    path: '/api/leetcode',
    method: 'GET',
    expected: 200,
    note: 'LeetCode profile & stats',
  },
  {
    path: '/api/contact',
    method: 'OPTIONS',
    expected: 204,
    note: 'Contact CORS preflight',
  },
];

async function runConnectionAudit() {
  console.log('\n======================================================');
  console.log('   FRONTEND -> BACKEND API STATUS CHECK PROBE         ');
  console.log(`   Target Server: ${BASE_URL}`);
  console.log('======================================================\n');

  // First check if server is reachable
  try {
    const probe = await fetch(`${BASE_URL}/health`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!probe.ok && probe.status !== 200) {
      console.warn(
        `[WARN] Server responded with status ${probe.status} to /health probe.\n`
      );
    }
  } catch (err) {
    console.warn(
      `[INFO] Backend server at ${BASE_URL} is currently unreachable (${err.message}).`
    );
    console.warn(
      '       Skipping live socket probe. (Pass --strict to enforce live check in CI)\n'
    );
    if (IS_STRICT) {
      process.exit(1);
    }
    return;
  }

  const results = [];

  for (const ep of ENDPOINTS) {
    const start = performance.now();
    let status;
    let ok = false;

    try {
      const res = await fetch(`${BASE_URL}${ep.path}`, {
        method: ep.method,
        headers: ep.method === 'OPTIONS' ? { Origin: 'http://localhost:5173' } : {},
        signal: AbortSignal.timeout(5000),
      });
      status = res.status;
      ok = status === ep.expected;
    } catch (err) {
      status = err.code || 'ERR';
    }

    const duration = Math.round(performance.now() - start);

    results.push({
      Method: ep.method,
      Path: ep.path,
      Expected: ep.expected,
      Actual: status,
      Status: ok ? '✔ PASS' : '✖ MISMATCH',
      Time: `${duration}ms`,
      Note: ep.note,
    });
  }

  console.table(results);

  const allPassed = results.every((r) => r.Status === '✔ PASS');
  console.log(
    allPassed
      ? '\n✔ All frontend API endpoints matched expected status criteria.\n'
      : '\n✖ Some endpoints reported unexpected status codes.\n'
  );

  if (!allPassed && IS_STRICT) {
    process.exit(1);
  }
}

runConnectionAudit().catch((err) => {
  console.error('API connection check failed:', err);
  if (IS_STRICT) process.exit(1);
});
