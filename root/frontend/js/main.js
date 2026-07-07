import { hireForm } from "./components.js";
import { contactForm } from "./components.js";
// TODO Phase 3:
// Re-enable GitHub contribution analytics and heatmap rendering.
// import { renderGitHubContributions } from "./github-res.js";
// import { initCanvas } from "./theme.js"

document.addEventListener('DOMContentLoaded', () => {
    hireForm();
    contactForm();
    // renderGitHubContributions();
    // initCanvas();
})
