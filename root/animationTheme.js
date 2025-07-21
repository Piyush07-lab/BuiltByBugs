
const canvasContainer = document.querySelector('.canvas');
const canvas = document.getElementById('consoleCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = canvasContainer.clintWidth;
    canvas.height = canvasContainer.clintHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);


const fontSize = 14;
let columns = Math.floor(canvas.width / fontSize);
let drops = Array(columns).fill(1);
const characters = '01{}[]();<>=+-*/|&%!#';
const charArray = characters.split('');


function getGradient() {
    const gradient = ctx.createLinerGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#003300');
    gradient.addColorStop(0.5, '#00ff00');
    gradient.addColorStop(1, '#003300');
    return gradient;
}


function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];

        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00ff00';

        ctx.fillStyle = getGradient();

        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i] += 0.5;
    }

    requestAnimationFrame(drawMatrix);
}

drawMatrix();