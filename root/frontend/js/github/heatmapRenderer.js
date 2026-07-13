export function renderHeatmap(container, heatmapData) {

    if (!container || !Array.isArray(heatmapData)) return;

    container.replaceChildren();

    container.classList.add(
        "cursor-pointer",
        "transition-transform",
        "duration-200",
        "hover:scale-[1.01]"
    );

    container.onclick = () => {
        window.open("https://github.com/Piyush07-lab", "_blank");
    };

    // ==========================
    // Wrapper
    // ==========================

    const wrapper = document.createElement("div");
    wrapper.className = "flex h-full flex-col";

    // Title

    const title = document.createElement("h3");
    title.className = "mb-4 text-xl text-cyan-300 font-bold";
    title.textContent = "Contribution Heatmap";

    // ==========================
    // Recent Activity (49 Days)
    // ==========================

    const recent = [...heatmapData]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(-70);


    const heatmapContainer = document.createElement("div");

    heatmapContainer.className =
        "mt-5 mx-auto flex w-full flex-1 items-center justify-center px-2";

    const grid = document.createElement("div");

    grid.className =
        "grid grid-cols-10 gap-[2px] w-[288px]";


    let total = 0;
    let maxDay = null;

    recent.forEach(day => {

        total += day.count;

        if (!maxDay || day.count > maxDay.count) {
            maxDay = day;
        }

        const square = document.createElement("div");

        square.className =
            "aspect-square w-full rounded-[3px] transition-transform duration-150 hover:scale-110";
            
        square.style.backgroundColor = day.color;

        square.title =
            `${day.date}\n${day.count} contribution${day.count === 1 ? "" : "s"}`;

        grid.append(square);

    });

    heatmapContainer.append(grid);

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
        heatmapContainer,
        footer
    );

    container.append(wrapper);

}