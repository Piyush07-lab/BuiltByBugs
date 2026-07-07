import { fetchHireRequest } from "./API-fetch.js";
import { fetchContactRequest } from "./API-fetch.js";

export function hireForm() {
    const modal = document.getElementById('hireModal');
    const openBtn = document.getElementById('hireMe');
    const closeBtn = document.querySelector('.close');

    const hireForm = document.getElementById('hireForm');

    openBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modal.classList.add('hidden');
        }
    });

    hireForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        const submitBtn = hireForm.querySelector('button');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            await fetchHireRequest(name, email, message);

            alert("Your request has been sent successfully!");

            hireForm.reset();
            modal.classList.add('hidden');

        } catch (error) {
            console.error('Request failed:', error);
            alert('Something went wrong. Please try again later.');
        }

        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Request';
    });

}

export function contactForm() {

    const modal = document.getElementById("contactModal");
    const openBtn = document.getElementById("contactMe");
    const closeBtn = modal.querySelector(".cancel");

    const form = document.getElementById("contactForm");

    openBtn.addEventListener("click", () => {
        modal.classList.remove("hidden");
        modal.classList.add("flex");
    });

    closeBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.add("hidden");
            modal.classList.remove("flex");
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("flex")) {
            modal.classList.add("hidden");
            modal.classList.remove("flex");
        }
    });

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = form.email.value.trim();
        const message = form.message.value.trim();

        const submitBtn = form.querySelector('button[type="submit"]');

        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";

        try {

            await fetchContactRequest(email, message);

            alert("Your message has been sent successfully!");

            form.reset();

            modal.classList.add("hidden");
            modal.classList.remove("flex");

        } catch (error) {

            console.error("Request failed:", error);

            alert("Something went wrong. Please try again later.");

        } finally {

            submitBtn.disabled = false;
            submitBtn.textContent = "Send";

        }

    });

}