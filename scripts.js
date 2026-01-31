document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');
    const artworks = [
        { title: 'Balcony Flowers', src: 'assets/paintings/balcony-flowers.jpg' },
        { title: 'Balcony Table', src: 'assets/paintings/balcony-table.jpg' },
        { title: 'Fall', src: 'assets/paintings/fall.jpg' },
        { title: 'Flower Cafe', src: 'assets/paintings/flower-cafe.jpg' },
        { title: 'Porto Bridge', src: 'assets/paintings/porto-bridge.jpg' },
        { title: 'Sea Sunset', src: 'assets/paintings/sea-sunset.jpg' },
        { title: 'Well Street Kitchen', src: 'assets/paintings/well-street-kitchen.jpg' },
        // Add more artworks here
    ];

    const ul = document.createElement('ul');
    artworks.forEach(art => {
        const li = document.createElement('li');
        const img = document.createElement('img');
        img.src = art.src;
        img.alt = art.title;
        img.title = art.title;

        const title = document.createElement('p');
        title.textContent = art.title;

        li.appendChild(img);
        li.appendChild(title);
        ul.appendChild(li);
    });
    gallery.appendChild(ul);

    const form = document.getElementById('contact-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message!');
        form.reset();
    });

    // Canvas animation
    const canvas = document.getElementById('headerCanvas');
    const context = canvas.getContext('2d');

    const settings = {
        dimensions: [1080, 1080],
        animate: true
    };

    const params = {
        cols: 80,
        rows: 20,
        scaleMin: 0.01,
        scaleMax: 2,
        freq: 0.0015,
        amp: 0.2,
        frame: 0,
        animate: true,
        lineCap: 'butt',
        color: { r: 100, g: 110, b: 130 },
    };

    canvas.width = settings.dimensions[0];
    canvas.height = settings.dimensions[1];

    const simplex = new SimplexNoise();

    function mapRange(value, a, b, c, d) {
        return c + (d - c) * ((value - a) / (b - a));
    }

    function draw(frame) {
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);

        const cols = params.cols;
        const rows = params.rows;
        const numCells = cols * rows;

        const gridw = canvas.width * 0.8;
        const gridh = canvas.height * 0.8;
        const cellw = gridw / cols;
        const cellh = gridh / rows;
        const margx = (canvas.width - gridw) / 2;
        const margy = (canvas.height - gridh) / 2;

        for (let i = 0; i < numCells; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);

            const x = col * cellw;
            const y = row * cellh;
            const w = cellw * 0.8;
            const h = cellh * 0.8;

            const f = params.animate ? frame : params.frame;
            const n = simplex.noise3D(x, y, f * 10 * params.freq);
            const angle = n * Math.PI * params.amp;
            const scale = mapRange(n, -1, 1, params.scaleMin, params.scaleMax);

            context.save();
            context.translate(x + margx + cellw / 2, y + margy + cellh / 2);
            context.rotate(angle);

            context.lineWidth = scale;
            context.lineCap = params.lineCap;
            context.strokeStyle = `rgb(${params.color.r},${params.color.g},${params.color.b})`;

            context.beginPath();
            context.moveTo(-w / 2, 0);
            context.lineTo(w / 2, 0);
            context.stroke();

            context.restore();
        }
    }

    function resizeCanvas() {
        // Match the canvas size to its displayed size
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        // Redraw or adjust your canvas content as needed
        draw();
    }

    // Initial resize and draw
    resizeCanvas();

    // Adjust canvas size on window resize
    window.addEventListener('resize', resizeCanvas);

    let frame = 0;
    function animate() {
        draw(frame);
        frame += 1;
        requestAnimationFrame(animate);
    }

    if (settings.animate) {
        animate();
    } else {
        draw(frame);
    }
});