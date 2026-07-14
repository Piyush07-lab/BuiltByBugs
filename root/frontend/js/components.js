import { fetchHireRequest } from "./API-fetch.js";
import { fetchContactRequest } from "./API-fetch.js";
import { showToast } from "./utils/toast.js";

export function hireForm() {
    const modal = document.getElementById('hireModal');
    const openBtn = document.getElementById('hireMe');
    const closeBtn = document.querySelector('.close');

    const hireForm = document.getElementById('hireForm');

    function openModal() {
        modal.classList.remove("hidden");

        const firstInput = modal.querySelector(
            "input, textarea, button"
        );

        firstInput.focus();
    }

    function closeModal() {
        modal.classList.add("hidden");

        openBtn.focus();
    }

    openBtn.addEventListener("click", openModal);

    closeBtn.addEventListener("click", closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            closeModal();
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

            showToast(
                "Your request has been sent successfully."
            );

            hireForm.reset();
            closeModal();

        } catch (error) {
            console.error('Request failed:', error);
            showToast(
                'Something went wrong. Please try again later.',
                'error'
            );
        }

        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Request';
    });

}

export function contactForm() {

    const modal = document.getElementById("contactModal");
    const openBtns = document.querySelectorAll("[data-contact-modal]");
    const closeBtn = modal.querySelector(".cancel");

    const form = document.getElementById("contactForm");

    let activeTrigger = null;

    function openModal() {
        modal.classList.remove("hidden");

        const firstInput = modal.querySelector(
            "input, textarea, button"
        );

        firstInput.focus();
    }

    function closeModal() {
        modal.classList.add("hidden");

        activeTrigger?.focus();
    }

    openBtns.forEach(btn => {

        btn.addEventListener("click", (e) => {

            e.preventDefault();

            activeTrigger = btn;

            openModal();

        });
    });

    closeBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeModal();
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

            showToast(
                "Your message has been sent successfully!"
            );

            form.reset();

            closeModal();
    

        } catch (error) {

            console.error("Request failed:", error);

            showToast(
                "Something went wrong. Please try again later.",
                "error"
            );

        } finally {

            submitBtn.disabled = false;
            submitBtn.textContent = "Send";

        }

    });

}