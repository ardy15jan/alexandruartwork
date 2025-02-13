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
    const ctx = canvas.getContext('2d');

    // Set canvas size to match the header
    const header = document.querySelector('header');
    canvas.width = header.offsetWidth;
    canvas.height = header.offsetHeight/8;

    const gridSize = 8;
    const noiseScale = 0.01;
    let time = 0;

    function drawGrid() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let x = 0; x < canvas.width; x += gridSize) {
            for (let y = 0; y < canvas.height; y += gridSize) {
                const angle = noise(x * noiseScale, y * noiseScale, time) * Math.PI * 2;
                ctx.save();
                ctx.translate(x + gridSize / 2, y + gridSize / 2);
                ctx.rotate(angle);
                ctx.beginPath();
                ctx.moveTo(-gridSize / 2, 0);
                ctx.lineTo(gridSize / 2, 0);
                ctx.strokeStyle = '#00000022';
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.restore();
            }
        }
        time += 0.01;
        requestAnimationFrame(drawGrid);
    }

    // Simplex Noise function
    function noise(x, y, z) {
        // Implementation of a 3D Simplex Noise function
        // You can use a library like 'simplex-noise' for this
        // For simplicity, here's a placeholder function
        return Math.sin(x + y + z);
    }

    drawGrid();
});