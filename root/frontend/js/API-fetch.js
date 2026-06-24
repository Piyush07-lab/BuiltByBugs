// const API_BASE = "";

export async function fetchHireRequest(name, email, message) {
    try {
        const res = await fetch("/api/hireRequest",
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });

        const result = await res.json();
        if (!res.ok) {
            alert(`error: ${result.error || 'Unknown error'}`);
        }

        return result;

    } catch (error) {
        
        console.error(error);

        alert("Unable to contact server");

        return {
            success: false,
            error: error.message
        };
    }
}

export async function fetchLeetCode() {
    const res = await fetch("/api/leetcode");
    if (!res.ok) throw new error("LeetCode Api fetch failed");
    return await res.json();
}

export async function fetchGitContributions() {
    const res = await fetch("/api/github-contributions");
    if (!res.ok) throw new error("GitHub API fetch failed");
    return await res.json();
}

export async function fetchGitSummary() {
    const res = await fetch("/api/github/summary");
    if (!res.ok) throw new error("Github Summary response failed");
    return await res.json();
}

export async function loadCodingSummary() {

}