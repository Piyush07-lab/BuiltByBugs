import { fetchBulletin } from "../API-fetch.js";

let bulletinData = [];
let currentIndex = 0;
let rotationTimer = null;

export async function loadBulletin() {

    try {

        bulletinData = await fetchBulletin();

        if (!Array.isArray(bulletinData) || bulletinData.length === 0) {
            throw new Error("No bulletin data available.");
        }

        return {

            render() {

                renderBulletin();

                rotationTimer = setInterval(() => {

                    currentIndex++;

                    if (currentIndex >= bulletinData.length)
                        currentIndex = 0;

                    renderBulletin();

                }, 7000);

            }

        };

    } catch (error) {

        console.error("Bulletin initialization failed:", error);

    }

}

export function renderBulletin() {

    const container = document.getElementById("bulletin");

    if (!container) return;

    container.replaceChildren();

    const bulletin = bulletinData[currentIndex];

    // Wrapper
    const wrapper = document.createElement("div");
    wrapper.className = "flex h-full flex-col";

    // Tag
    const tag = document.createElement("span");
    tag.className =
        "mb-4 w-fit rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-cyan-300";
    tag.textContent = bulletin.tag;

    // Title
    const title = document.createElement("h2");
    title.className =
        "text-3xl font-bold leading-tight text-white";
    title.textContent = bulletin.title;

    // Subtitle
    const subtitle = document.createElement("h3");
    subtitle.className =
        "mt-2 text-lg font-medium text-cyan-400";
    subtitle.textContent = bulletin.subtitle;

    // Description
    const description = document.createElement("p");
    description.className =
        "mt-5 flex-1 leading-7 text-slate-400";
    description.textContent = bulletin.description;

    // Footer
    const footer = document.createElement("div");
    footer.className =
        "mt-6 flex items-center justify-between border-t border-slate-800 pt-4";

    // Date
    const date = document.createElement("span");
    date.className =
        "text-sm text-slate-500";
    date.textContent = bulletin.date;

    // Progress Indicator
    const indicator = document.createElement("span");
    indicator.className =
        "rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400";
    indicator.textContent =
        `${currentIndex + 1} / ${bulletinData.length}`;

    footer.append(date, indicator);

    wrapper.append(
        tag,
        title,
        subtitle,
        description,
        footer
    );

    container.append(wrapper);


}