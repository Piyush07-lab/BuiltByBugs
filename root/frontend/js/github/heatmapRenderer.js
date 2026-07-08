export function renderHeatmap(container, heatmapData) {

    if (!container || !Array.isArray(heatmapData)) return;

    container.replaceChildren();

    // ==========================
    // Wrapper
    // ==========================

    const wrapper = document.createElement("div");
    wrapper.className = "flex h-full flex-col";

    // Title

    const title = document.createElement("h3");
    title.className = "mb-4 text-xl font-bold";
    title.textContent = "Contribution Heatmap";

    // ==========================
    // Heatmap Grid
    // ==========================

    const grid = document.createElement("div");
    grid.className =
        "grid grid-cols-53 gap-1 justify-center";

    let total = 0;
    let maxDay = null;

    heatmapData.forEach(day => {

        total += day.count;

        if (!maxDay || day.count > maxDay.count) {
            maxDay = day;
        }

        const square = document.createElement("div");

        square.className =
            "h-3 w-3 rounded-sm";

        square.style.backgroundColor = day.color;

        square.title =
            `${day.date}\n${day.count} contribution${day.count === 1 ? "" : "s"}`;

        grid.append(square);

    });

    // ==========================
    // Footer
    // ==========================

    const footer = document.createElement("div");
    footer.className =
        "mt-6 flex items-center justify-between border-t border-slate-800 pt-4 text-sm";

    const totalElement = document.createElement("span");
    totalElement.className = "text-slate-400";
    totalElement.textContent =
        `Total: ${total}`;

    const maxElement = document.createElement("span");
    maxElement.className = "text-slate-400";

    if (maxDay) {
        maxElement.textContent =
            `Best Day: ${maxDay.count}`;
    }

    footer.append(
        totalElement,
        maxElement
    );

    wrapper.append(
        title,
        grid,
        footer
    );

    container.append(wrapper);

}