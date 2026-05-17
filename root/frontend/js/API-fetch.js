const API_BASE = 
    window.location.hostname === "localhost"
    ?"http://localhost:5500"
    :window.location.origin;

export async function fetchHireRequest(name, email, message) {
    const res = await fetch(`&{API_BASE}/api/hireRequest`, 
    {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
    });

    const result = await res.json();
    if (!res.ok) {
        alert(`Error: ${result.error || 'Unknown Error'}`);
    }

    return result;
}

export async function fetchLeetCode() {
    const res = await fetch(`&{API_BASE}/api/leetcode`);
    if (!res.ok) throw new Error("LeetCode Api fetch failed");
    return await res.json();
}

export async function fetchGitContributions() {
    const res = await fetch(`&{API_BASE}/api/github-contributions`);
    if (!res.ok) throw new Error("GitHub API fetch failed");
    return await res.json();
}

export async function fetchGitSummary() {
    const res = await fetch(`&{API_BASE}/api/github/summary`);
    if (!res.ok) throw new Error("Github Summary response failed");
    return await res.json();
}

export async function loadCodingSummary() {
    
}