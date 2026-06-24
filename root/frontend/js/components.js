import { fetchHireRequest } from "./API-fetch.js";

export function ocdHireForm() {
    const modal = document.getElementById('hireModal');
    const openBtn = document.getElementById('hireMeBtn');
    const closeBtn = document.querySelector('.close');

    const hireForm = document.getElementById('hireForm');

    openBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') modal.classList.add('hidden');
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