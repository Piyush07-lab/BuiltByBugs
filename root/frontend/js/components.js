document.addEventListener('DOMContentLoaded', () => {

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
            const response = await fetch('http://localhost:5000/api/hireRequest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });

            const result = await response.json();

            if (response.ok) {
                alert('Your request has been sent successfully!');
                hireForm.reset();
                document.getElementById('hireModal').classList.add('hidden');
            } else {
                alert(`Failed: ${result.error || 'Unknown Error'}`);
            }

        } catch (err) {
            console.error('Request failed:', err);
            alert('Something went wrong. Please try again later.');
        }

        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Request';
    });


})