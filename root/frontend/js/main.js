import { hireForm, contactForm } from "./components.js";
import { startBulletin } from "./bulletin/bulletinRender.js";
import { startGithub } from "./github/github.js";
import { startCodingTracker } from "./code-log/codingTracker.js";
// import { initCanvas } from "./theme.js"

function setActiveNav() {

    const currentPage =
        window.location.pathname.split("/").pop();

    document.querySelectorAll(".nav-link").forEach(link => {

        const href = link.getAttribute("href");

        if (href.endsWith(currentPage)) {

            link.classList.add("text-cyan-400");

        } else {

            link.classList.remove("text-cyan-400");

        }

    });

}

document.addEventListener('DOMContentLoaded', () => {
    setActiveNav();
    hireForm();
    contactForm();
    startBulletin();
    startGithub();
    startCodingTracker();
})
