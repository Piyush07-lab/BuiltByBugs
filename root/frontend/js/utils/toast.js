export function showToast(message, type = "success") {

    const container =
        document.getElementById("toastContainer");

    const toast = document.createElement("div");

    const colors = {
        success: "border-lime-400",
        error: "border-red-400",
        info: "border-cyan-400"
    };

    toast.className = `
        pointer-events-auto
        rounded-lg
        border
        ${colors[type] || colors.info}
        bg-slate-900
        px-5
        py-3
        shadow-xl
        text-sm
        text-slate-100
        animate-fade-in
    `;

    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 3500);
}