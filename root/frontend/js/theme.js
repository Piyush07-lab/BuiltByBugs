import { createParticles } from './utils/particles.js'

export function initCanvas() {
    const canvas = document.getElementById("backgroundCanvas");
    const ctx = canvas.getContext("2d");

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    const particles = createParticles(canvas, 120);

    function animate() {
        const t = Date.now() * 0.00015;
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);

        const hueStart = (t * 360) % 360;
        const hueEnd = (hueStart + 180) % 360;

        grad.addColorStop(0, `hsl(${hueStart}, 25%, 25%)`);
        grad.addColorStop(0.5, `hsl(${(hueStart + 90) % 360}, 20%, 20%)`);
        grad.addColorStop(1, `hsl(${hueEnd}, 25%, 15%)`)

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.draw();

        requestAnimationFrame(animate);
    }

    animate();
}