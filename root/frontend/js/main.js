import { hireForm } from "./components.js";
import { contactForm } from "./components.js";
import { startBulletin } from "./bulletin/bulletinRender.js";
import { startGithub } from "./github/github.js";
// import { initCanvas } from "./theme.js"

document.addEventListener('DOMContentLoaded', () => {
    hireForm();
    contactForm();
    startBulletin();
    startGithub();
})
