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
});