import * as THREE from '/node_modules/three/build/three.module.js';


document.querySelector('.gateway').addEventListener('click', () => {
    createMatrixOverlay();
});

function createMatrixOverlay() {
    const matrixOverlay = document.createElement('div');
    matrixOverlay.id = 'matrix-room';
    Object.assign(matrixOverlay.style, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#000',
        zIndex: 9999,
        overflow: 'hidden'
    });
    document.body.appendChild(matrixOverlay);


    const exitBtn = document.createElement('button');
    exitBtn.textContent = 'X';
    Object.assign(exitBtn.style, {
        position: 'absolute',
        top: '20px',
        right: '20px',
        padding: '10px 20px',
        fontSize: '14px',
        background: '#142c18d3',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        zIndex: 10000
    });
    matrixOverlay.appendChild(exitBtn);


    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        65,
        window.innerWidth / window.innerHeight,
        0.01,
        100
    );
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    matrixOverlay.appendChild(renderer.domElement);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });


    const matrixCanvas = document.createElement('canvas');
    const ctx = matrixCanvas.getContext('2d');
    matrixCanvas.width = 512;
    matrixCanvas.height = 512;


    const chars = '010010000110010101101100011011000110111100100000010011100110010101101111001000010010000001010111011001010110110001100011011011110110110101100101001000000111010001101111001000000111010001101000011001010010000001101101011000010111010001110010011010010111100000101110';
    const fontSize = 10;
    const columns = Math.floor(matrixCanvas.width / fontSize);


    const columnsData = Array.from({ length: columns }, () => ({
        y: Math.floor(Math.random() * matrixCanvas.height / fontSize),
        direction: Math.random() > 0.5 ? 1 : -1,
        speed: Math.random() * 2 + 0.5,
        active: Math.random() > 0.7,
        cooldown: Math.floor(Math.random() * 40)
    }));

    function drawMatrixRain() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        ctx.fillStyle = '#0f0';
        ctx.font = `100 ${fontSize}px monospace`;


        for (let i = 0; i < columnsData.length; i++) {
            const col = columnsData[i];

            if (col.active) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, col.y * fontSize);
                col.y += col.direction * col.speed;


                if (col.y * fontSize > matrixCanvas.height + fontSize || col.y < -1) {
                    col.active = false;
                    col.cooldown = Math.floor(Math.random() * 30);
                    col.y = col.direction === 1 ? -1 : Math.floor(matrixCanvas.height / fontSize) + 1;
                }

            } else {

                if (col.cooldown > 0) {
                    col.cooldown--;
                } else {
                    if (Math.random() > 0.9) {
                        col.active = true;
                        col.direction = Math.random() > 0.5 ? 1 : -1;
                        col.speed = Math.random() * 2 + 0.5;
                    }
                }
            }
        }
    }


    const matrixTexture = new THREE.CanvasTexture(matrixCanvas);
    const material = new THREE.MeshBasicMaterial({
        map: matrixTexture,
        side: THREE.BackSide
    });


    const geometry = new THREE.BoxGeometry(20, 20, 20);
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // ----- Random ASCII messages ------- //

    const messageLayer = document.createElement('div');
    Object.assign(messageLayer.style, {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 100001,
        color: '#0f0',
        fontFamily: 'monospace'
    });
    matrixOverlay.appendChild(messageLayer);

    const messages = [
        'hello_world'
    ];

    function showRandomMessage() {
        const msg = document.createElement('div');
        msg.textContent = messages[Math.floor(Math.random() * messages.lenght)];
        Object.assign(msg.style, {
            position: 'absolute',
            top: `${Math.random() * 80 + 10}%`,
            left: `${Math.random() * 80 + 10}%`,
            fontSize: `${Math.floor(Math.random() * 24) + 12}px`,
            opacity: 0,
            transition: 'opacity 1s ease',
            textShadow: '0 0 10px #0f0'
        });
        messageLayer.appendChild(msg);

        setTimeout(() => (msg.style.opacity = 1), 50);
        setTimeout(() => (msg.style.opacity = 0), 4000);
        setTimeout(() => msg.remove(), 50);
    }

    setInterval(showRandomMessage, 5000);


    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    document.addEventListener('mousemove', (e) => {

        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        targetX = mouseX * 2; 
        targetY = mouseY * 0.5;

    });

    let animationFrameId;
    function animate() {
        drawMatrixRain();
        matrixTexture.needsUpdate = true;

        camera.rotation.y += (targetX - camera.rotation.y) * 0.05;
        camera.rotation.x += (targetY - camera.rotation.x) * 0.05;


        animationFrameId = requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();


    function cleanupMatrixRoom() {
        cancelAnimationFrame(animationFrameId);
        renderer.dispose();
        scene.clear();
        matrixOverlay.remove();
        document.removeEventListener('keydown', escHandler);
    }

    exitBtn.addEventListener('click', cleanupMatrixRoom);

    function escHandler(e) {
        if (e.key === 'Escape') {
            cleanupMatrixRoom();
        }
    }
    document.addEventListener('keydown', escHandler);
}