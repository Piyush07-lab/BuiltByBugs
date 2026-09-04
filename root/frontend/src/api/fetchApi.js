import { apiRequest } from "./client";

function withRefresh(path, refresh) {
    return refresh ? `${path}?refresh=true` : path;
};

export function getCodingActivity({ refresh = false } = {}) {
    return apiRequest(withRefresh("/api/coding", refresh));
};

export function getCodingSummary({ refresh = false } = {}) {
    return apiRequest(withRefresh("/api/coding/summary", refresh));
};

export function fetchGitHubSummary() {
    return apiRequest("/api/github/summary");
};

export function fetchGitContributions() {
    return apiRequest("/api/github-contributions")
};

export function sendContact(data) {
    return apiRequest("/api/contact", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function sendHireRequest(data) {
    return apiRequest("/api/hireRequest", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function sendChatMessage(messages) {
    return apiRequest("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages }),
    });
}
