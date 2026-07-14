
import bulletinData from "./bulletin/bulletinData.js";
import codingTrackerData from "./code-log/codingTrackerData.js";
import { showToast } from "./utils/toast.js";

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
            showToast(
                `error: ${result.error || 'Unknown error'}`
            );
        }

        return result;

    } catch (error) {

        console.error("[Hire Request]", error);

        showToast(
            "Unable to contact server"
        );

        return {
            success: false,
            error: error.message
        };
    }
}

export async function fetchContactRequest(email, message) {
    
    try {

        const res = await fetch("/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                message
            })
        });

        const result = await res.json();

        if (!res.ok) {
            showToast(
                `Error: ${result.error || "Unknown error"}`
            );
        }

        return result;

    } catch (error) {

        console.error("[Contact Request]", error);

        showToast(
            "Unable to contact server"
        );

        return {
            success: false,
            error: error.message
        };

    }
}

export async function fetchLeetCode() {
    const res = await fetch("/api/leetcode");
    if (!res.ok) throw new Error("LeetCode Api fetch failed");
    return await res.json();
}

export async function fetchGitContributions() {
    const res = await fetch("/api/github-contributions");
    if (!res.ok) throw new Error("GitHub API fetch failed");
    return await res.json();
}

export async function fetchGitSummary() {
    const res = await fetch("/api/github/summary");
    if (!res.ok) throw new Error("Github Summary response failed");
    return await res.json();
}

export async function loadCodingSummary() {

}

export async function fetchBulletin() {

    return Promise.resolve(bulletinData);

}

export async function fetchCodingTracker() {

    return Promise.resolve(codingTrackerData);
    
}
