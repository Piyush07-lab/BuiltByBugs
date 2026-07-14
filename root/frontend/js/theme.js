export function initCanvas() {

    const canvas = document.getElementById("backgroundCanvas");
    const ctx = canvas.getContext("2d");
    const main = document.querySelector("main");

    function resize() {

        canvas.width = window.innerWidth;
        canvas.height = main.scrollHeight;

        draw();

    }

    window.addEventListener("resize", resize);

    function draw() {

        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);

        //--------------------------------------------------
        // Background
        //--------------------------------------------------

        const bg = ctx.createLinearGradient(0, 0, 0, h);

        bg.addColorStop(0, "#13091F");
        bg.addColorStop(1, "#050507");

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);

        //--------------------------------------------------
        // Glow
        //--------------------------------------------------

        const glow = ctx.createRadialGradient(
            w * 0.35,
            h * 0.08,
            0,
            w * 0.35,
            h * 0.08,
            700
        );

        glow.addColorStop(0, "rgba(255,0,200,.75)");
        glow.addColorStop(.45, "rgba(170,0,255,.45)");
        glow.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);

        //--------------------------------------------------
        // Orbit Arc
        //--------------------------------------------------

        ctx.save();

        ctx.strokeStyle = "rgba(255,255,255,0.06)";
        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.arc(
            w * (0.95 + Math.random() * 0.2),
            h * (0.45 + Math.random() * 0.2),
            700 + Math.random() * 400,
            Math.PI * 0.9,
            Math.PI * 1.7
        );

        ctx.stroke();

        ctx.restore();

        //--------------------------------------------------
        // Large Soft Circle
        //--------------------------------------------------

        ctx.save();

        const cx = w * (0.6 + Math.random() * 0.3);
        const cy = h * (0.45 + Math.random() * 0.35);

        const radius = 350 + Math.random() * 450;

        const glow3 = ctx.createRadialGradient(
            cx,
            cy,
            0,
            cx,
            cy,
            radius
        );

        const hue2 = 220 + Math.random() * 120;

        glow3.addColorStop(0, `hsla(${hue2},100%,65%,0.16)`);
        glow3.addColorStop(0.35, `hsla(${hue2},100%,55%,0.08)`);
        glow3.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = glow3;
        ctx.fillRect(0, 0, w, h);

        ctx.restore();

        //--------------------------------------------------
        // Procedural Ribbons
        //--------------------------------------------------

        const ribbonCount = 1;

        const ribbons = [];

        const usableHeight = h * 0.82;
        const spacing = usableHeight / ribbonCount;

        for (let i = 0; i < ribbonCount; i++) {

            ribbons.push({

                y:
                    h * 0.08 +
                    (i * spacing) +
                    ((Math.random() - 0.5) * 80),

                width:
                    140 + Math.random() * 220,

                thickness:
                    80 + Math.random() * 120,

                slope:
                    260 + Math.random() * 180,

                endOffset:
                    180 + Math.random() * 220,

                opacity:
                    0.35 + Math.random() * 0.35,

                hue:
                    315 + Math.random() * 20

            });

        }

        ribbons.sort((a, b) => a.y - b.y);

        for (const ribbon of ribbons) {

            const x = w * 0.22;

            ctx.beginPath();

            ctx.moveTo(x - ribbon.width, ribbon.y);
            ctx.lineTo(x + ribbon.width, ribbon.y);

            ctx.lineTo(
                w + ribbon.endOffset,
                ribbon.y + ribbon.slope
            );

            ctx.lineTo(
                w + ribbon.endOffset - ribbon.thickness,
                ribbon.y + ribbon.slope - ribbon.thickness
            );

            ctx.closePath();

            const g = ctx.createLinearGradient(
                x,
                ribbon.y,
                w,
                ribbon.y + ribbon.slope
            );

            g.addColorStop(
                0,
                `hsl(${ribbon.hue},90%,68%)`
            );

            g.addColorStop(
                0.5,
                `hsl(${(ribbon.hue + 35) % 360},90%,62%)`
            );

            g.addColorStop(
                1,
                `hsl(${(ribbon.hue + 75) % 360},75%,60%)`
            );

            ctx.fillStyle = g;
            ctx.globalAlpha = ribbon.opacity;

            ctx.fill();

        }

        ctx.globalAlpha = 1;

        //--------------------------------------------------
        // Vignette
        //--------------------------------------------------

        const vignette = ctx.createRadialGradient(
            w / 2,
            h / 2,
            400,
            w / 2,
            h / 2,
            h
        );

        vignette.addColorStop(0, "rgba(0,0,0,0)");
        vignette.addColorStop(1, "rgba(0,0,0,.65)");

        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, w, h);

    }

    resize();

}