// Artworks data - matches actual files in assets/paintings/
const artworks = [
    { title: 'Balcony Flowers', src: 'assets/paintings/balcony-flowers.jpg', description: 'A vibrant display of blooming flowers on a sunlit balcony' },
    { title: 'Balcony Table', src: 'assets/paintings/balcony-table.jpg', description: 'An intimate corner scene with elegant table setting' },
    { title: 'Fall', src: 'assets/paintings/fall.jpg', description: 'Autumn colors painting the landscape in warm hues' },
    { title: 'Flower Café', src: 'assets/paintings/flower-cafe.jpg', description: 'A charming café adorned with beautiful floral arrangements' },
    { title: 'Porto Bridge', src: 'assets/paintings/porto-bridge.jpg', description: 'The iconic bridge spanning across the Douro River' },
    { title: 'Sea Sunset', src: 'assets/paintings/sea-sunset.jpg', description: 'Golden hour reflections on calm ocean waters' },
    { title: 'Well Street Kitchen', src: 'assets/paintings/well-street-kitchen.jpg', description: 'Urban life captured in a bustling kitchen scene' }
];

// DOM Content Loaded - Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initializeGallery();
    initializeCanvasAnimation();
    initializeNavigation();
    initializeContactForm();
    updateFooterYear();
});

// Gallery Initialization
function initializeGallery() {
    const galleryGrid = document.getElementById('gallery-grid');
    if (!galleryGrid) return;

    artworks.forEach((artwork, index) => {
        const galleryItem = createGalleryItem(artwork, index);
        galleryGrid.appendChild(galleryItem);
    });
}

function createGalleryItem(artwork, index) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.setAttribute('role', 'listitem');
    item.style.animationDelay = `${index * 0.1}s`;

    const imageContainer = document.createElement('div');
    imageContainer.className = 'gallery-image-container';

    const img = document.createElement('img');
    img.src = artwork.src;
    img.alt = artwork.title;
    img.className = 'gallery-image';
    img.loading = 'lazy';

    // Add error handling for images
    img.onerror = function() {
        console.error(`Failed to load image: ${artwork.src}`);
        this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23999" font-family="sans-serif" font-size="16"%3EImage not found%3C/text%3E%3C/svg%3E';
    };

    const overlay = document.createElement('div');
    overlay.className = 'gallery-overlay';

    const overlayContent = document.createElement('div');
    overlayContent.className = 'gallery-overlay-content';

    const title = document.createElement('h3');
    title.className = 'gallery-title';
    title.textContent = artwork.title;

    const description = document.createElement('p');
    description.className = 'gallery-description';
    description.textContent = artwork.description;

    overlayContent.appendChild(title);
    overlayContent.appendChild(description);
    overlay.appendChild(overlayContent);

    imageContainer.appendChild(img);
    imageContainer.appendChild(overlay);
    item.appendChild(imageContainer);

    return item;
}

// Canvas Animation - Existing SimplexNoise animation
function initializeCanvasAnimation() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const simplex = new SimplexNoise();

    const params = {
        freq: 0.0008,
        amp: 90,
        scaleMin: 1,
        scaleMax: 4,
        cols: 80,
        rows: 20,
        color: [255, 255, 255],
        zOff: 0
    };

    let animationId;

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    function draw() {
        ctx.fillStyle = 'rgba(15, 23, 42, 1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const cellWidth = canvas.width / params.cols;
        const cellHeight = canvas.height / params.rows;

        for (let i = 0; i < params.cols; i++) {
            for (let j = 0; j < params.rows; j++) {
                const x = i * cellWidth + cellWidth / 2;
                const y = j * cellHeight + cellHeight / 2;

                const noiseValue = simplex.noise3D(
                    i * params.freq,
                    j * params.freq,
                    params.zOff
                );

                const angle = noiseValue * params.amp * Math.PI / 180;
                const scale = Math.abs(noiseValue) * (params.scaleMax - params.scaleMin) + params.scaleMin;

                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(angle);
                ctx.strokeStyle = `rgb(${params.color[0]}, ${params.color[1]}, ${params.color[2]})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(-cellWidth / 2 * scale, 0);
                ctx.lineTo(cellWidth / 2 * scale, 0);
                ctx.stroke();
                ctx.restore();
            }
        }

        params.zOff += 0.002;
        animationId = requestAnimationFrame(draw);
    }

    resizeCanvas();
    draw();

    window.addEventListener('resize', () => {
        resizeCanvas();
    });

    // Pause animation when page is not visible to save resources
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            draw();
        }
    });
}

// Smooth Scrolling Navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .cta-button');
    const nav = document.querySelector('.main-nav');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const navHeight = nav.offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add active class to nav on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }

        // Highlight active section in nav
        const sections = document.querySelectorAll('section, header');
        sections.forEach(section => {
            const sectionTop = section.offsetTop - nav.offsetHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                const sectionId = section.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Contact Form Handling
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear previous errors
        clearFormErrors();

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Show loading state
        const submitButton = form.querySelector('.submit-button');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        try {
            // Simulate form submission (replace with actual endpoint)
            await simulateFormSubmission(data);

            // Show success message
            showFormStatus('Thank you for your message! I will get back to you soon.', 'success');
            form.reset();
        } catch (error) {
            // Show error message
            showFormStatus('Something went wrong. Please try again later.', 'error');
        } finally {
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }
    });
}

function validateForm() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    let isValid = true;

    if (!nameInput.value.trim()) {
        showFieldError(nameInput, 'Please enter your name');
        isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
        showFieldError(emailInput, 'Please enter your email');
        isValid = false;
    } else if (!emailRegex.test(emailInput.value)) {
        showFieldError(emailInput, 'Please enter a valid email address');
        isValid = false;
    }

    if (!messageInput.value.trim()) {
        showFieldError(messageInput, 'Please enter a message');
        isValid = false;
    }

    return isValid;
}

function showFieldError(input, message) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.form-error');
    errorElement.textContent = message;
    input.classList.add('error');
    input.setAttribute('aria-invalid', 'true');
}

function clearFormErrors() {
    const errorElements = document.querySelectorAll('.form-error');
    errorElements.forEach(el => el.textContent = '');

    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.classList.remove('error');
        input.removeAttribute('aria-invalid');
    });

    const statusElement = document.getElementById('form-status');
    statusElement.textContent = '';
    statusElement.className = 'form-status';
}

function showFormStatus(message, type) {
    const statusElement = document.getElementById('form-status');
    statusElement.textContent = message;
    statusElement.className = `form-status ${type}`;
}

// Simulate form submission (replace with actual API call)
function simulateFormSubmission(data) {
    return new Promise((resolve) => {
        console.log('Form data:', data);
        setTimeout(resolve, 1500);
    });
}

// Update footer year
function updateFooterYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Add scroll reveal animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => observer.observe(item));
});
