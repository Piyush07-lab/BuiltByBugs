import {
    fetchGitSummary,
    fetchGitContributions
} from "../API-fetch.js";

import { renderProfile } from "./profileRenderer.js";
import { renderHeatmap } from "./heatmapRenderer.js";

let githubSummary = null;
let heatmapData = null;

let currentSlide = 0;
let rotationTimer = null;

export async function startGithub() {

    const container = document.getElementById("github");

    if (!container) return;

    try {

        const [summary, heatmap] = await Promise.all([
            fetchGitSummary(),
            fetchGitContributions()
        ]);

        githubSummary = summary;
        heatmapData = heatmap;

        renderCurrentSlide(container);

        rotationTimer = setInterval(() => {

            currentSlide++;

            if (currentSlide >= 2) {
                currentSlide = 0;
            }

            renderCurrentSlide(container);

        }, 7000);

    } catch (error) {

        console.error("GitHub widget initialization failed:", error);

        container.textContent = "Unable to load GitHub data.";

    }

}

function renderCurrentSlide(container) {

    switch (currentSlide) {

        case 0:
            renderProfile(container, githubSummary);
            break;

        case 1:
            renderHeatmap(container, heatmapData);
            break;

        default:
            renderProfile(container, githubSummary);

    }

}
