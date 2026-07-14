import { hireForm, contactForm } from "./components.js";
import { loadBulletin } from "./bulletin/bulletinRender.js";
import { loadGithub } from "./github/github.js";
import { startGithubShowcase } from "./github/github-sc.js";
import { loadCodingTracker } from "./code-log/codingTracker.js";
import { initCanvas } from "./theme.js";
import {
    initMotion,
    registerLazy
} from "./motion.js";

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
    initMotion();
    initCanvas();
    setActiveNav();
    hireForm();
    contactForm();

    registerLazy(
        document.getElementById("bulletin"),
        loadBulletin
    );

    registerLazy(
        document.getElementById("github"),
        loadGithub
    );

    registerLazy(
        document.getElementById("codingTracker"),
        loadCodingTracker
    );

    registerLazy(
        document.getElementById("githubShowcase"),
        startGithubShowcase
    )
})
