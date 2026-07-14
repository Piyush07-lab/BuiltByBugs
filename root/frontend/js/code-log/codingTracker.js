import { fetchCodingTracker } from "../API-fetch.js";
import { renderOverview } from "./overviewRenderer.js";
import { renderActivity } from "./activityRenderer.js";

let trackerData = null;

let currentSlide = 0;

let intervalId = null;

const SLIDE_DURATION = 8000;

function renderCurrentSlide(container) {

    if (!trackerData) return;

    container.replaceChildren();

    switch (currentSlide) {

        case 0:
            renderOverview(container, trackerData);
            break;

        case 1:
            renderActivity(container, trackerData);
            break;

        default:
            renderOverview(container, trackerData);

    }

}

export async function loadCodingTracker() {

    const container = document.querySelector("#codingTracker");

    if (!container) return;

    try {

        trackerData = await fetchCodingTracker();

    } catch (error) {

        console.error("Failed to load Coding Tracker:", error);

        container.textContent = "Unable to load coding activity.";

        return;

    }

    return {

        render() {

            renderCurrentSlide(container);

            if (intervalId) {

                clearInterval(intervalId);

            }

            intervalId = setInterval(() => {

                currentSlide = (currentSlide + 1) % 2;

                renderCurrentSlide(container);

            }, SLIDE_DURATION);
        
        }
    }

};

    
