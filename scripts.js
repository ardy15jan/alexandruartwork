// Artworks data - matches actual files in assets/paintings/
const artworks = [
    { title: 'Balcony Flowers', src: 'assets/paintings/balcony-flowers.jpg', description: 'A vibrant display of blooming flowers on a sunlit balcony', price: '£450', size: '60 × 80 cm' },
    { title: 'Balcony Table', src: 'assets/paintings/balcony-table.jpg', description: 'An intimate corner scene with elegant table setting', price: '£380', size: '50 × 70 cm' },
    { title: 'Fall', src: 'assets/paintings/fall.jpg', description: 'Autumn colors painting the landscape in warm hues', price: '£520', size: '70 × 90 cm' },
    { title: 'Flower Café', src: 'assets/paintings/flower-cafe.jpg', description: 'A charming café adorned with beautiful floral arrangements', price: '£420', size: '55 × 75 cm' },
    { title: 'Porto Bridge', src: 'assets/paintings/porto-bridge.jpg', description: 'The iconic bridge spanning across the Douro River', price: '£650', size: '80 × 100 cm' },
    { title: 'Sea Sunset', src: 'assets/paintings/sea-sunset.jpg', description: 'Golden hour reflections on calm ocean waters', price: '£480', size: '60 × 90 cm' },
    { title: 'Well Street Kitchen', src: 'assets/paintings/well-street-kitchen.jpg', description: 'Urban life captured in a bustling kitchen scene', price: '£550', size: '65 × 85 cm' }
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

    // Details section (price and size) - shown on tap
    const details = document.createElement('div');
    details.className = 'gallery-details';

    const size = document.createElement('span');
    size.className = 'gallery-size';
    size.textContent = artwork.size;

    const price = document.createElement('span');
    price.className = 'gallery-price';
    price.textContent = artwork.price;

    details.appendChild(size);
    details.appendChild(price);

    overlayContent.appendChild(title);
    overlayContent.appendChild(description);
    overlayContent.appendChild(details);
    overlay.appendChild(overlayContent);

    imageContainer.appendChild(img);
    imageContainer.appendChild(overlay);
    item.appendChild(imageContainer);

    // Add tap/click handler to toggle details
    item.addEventListener('click', () => {
        // Remove active from all other items
        document.querySelectorAll('.gallery-item.active').forEach(el => {
            if (el !== item) el.classList.remove('active');
        });
        // Toggle active on this item
        item.classList.toggle('active');
    });

    return item;
}

// Elegant Canvas Animation - Flowing particles with connections
function initializeCanvasAnimation() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const simplex = new SimplexNoise();

    let particles = [];
    let animationId;
    let time = 0;

    const config = {
        particleCount: 80,
        connectionDistance: 150,
        particleSize: 2,
        speed: 0.3,
        noiseScale: 0.003,
        noiseStrength: 2,
        baseColor: { r: 187, g: 148, b: 87 }, // Gold accent color
        fadeColor: { r: 255, g: 255, b: 255 }  // White
    };

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = 0;
            this.vy = 0;
            this.life = Math.random() * 0.5 + 0.5;
        }

        update() {
            // Use simplex noise for organic movement
            const noiseX = simplex.noise3D(
                this.x * config.noiseScale,
                this.y * config.noiseScale,
                time * 0.5
            );
            const noiseY = simplex.noise3D(
                this.x * config.noiseScale + 100,
                this.y * config.noiseScale + 100,
                time * 0.5
            );

            // Apply noise as acceleration
            this.vx += noiseX * config.noiseStrength * 0.01;
            this.vy += noiseY * config.noiseStrength * 0.01;

            // Damping
            this.vx *= 0.98;
            this.vy *= 0.98;

            // Limit velocity
            const maxSpeed = config.speed;
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > maxSpeed) {
                this.vx = (this.vx / speed) * maxSpeed;
                this.vy = (this.vy / speed) * maxSpeed;
            }

            this.x += this.vx;
            this.y += this.vy;

            // Wrap around edges
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            const alpha = this.life * 0.8;
            ctx.beginPath();
            ctx.arc(this.x, this.y, config.particleSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${config.baseColor.r}, ${config.baseColor.g}, ${config.baseColor.b}, ${alpha})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.connectionDistance) {
                    const alpha = (1 - distance / config.connectionDistance) * 0.3;

                    // Create gradient for connection
                    const gradient = ctx.createLinearGradient(
                        particles[i].x, particles[i].y,
                        particles[j].x, particles[j].y
                    );
                    gradient.addColorStop(0, `rgba(${config.baseColor.r}, ${config.baseColor.g}, ${config.baseColor.b}, ${alpha})`);
                    gradient.addColorStop(0.5, `rgba(${config.fadeColor.r}, ${config.fadeColor.g}, ${config.fadeColor.b}, ${alpha * 0.5})`);
                    gradient.addColorStop(1, `rgba(${config.baseColor.r}, ${config.baseColor.g}, ${config.baseColor.b}, ${alpha})`);

                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }

    function drawFlowingCurves() {
        const curveCount = 5;

        for (let c = 0; c < curveCount; c++) {
            ctx.beginPath();

            const yOffset = (canvas.height / (curveCount + 1)) * (c + 1);
            const amplitude = 50 + c * 10;

            for (let x = 0; x <= canvas.width; x += 5) {
                const noise = simplex.noise3D(
                    x * 0.002,
                    c * 0.5,
                    time * 0.3
                );
                const y = yOffset + noise * amplitude;

                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            const alpha = 0.1 + (c * 0.02);
            ctx.strokeStyle = `rgba(${config.baseColor.r}, ${config.baseColor.g}, ${config.baseColor.b}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        initParticles();
    }

    function draw() {
        // Clear with fade effect for trails
        ctx.fillStyle = 'rgba(26, 26, 46, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw flowing curves in background
        drawFlowingCurves();

        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
        });

        // Draw connections
        drawConnections();

        // Draw particles on top
        particles.forEach(particle => {
            particle.draw();
        });

        time += 0.01;
        animationId = requestAnimationFrame(draw);
    }

    resizeCanvas();

    // Initial clear
    ctx.fillStyle = 'rgba(26, 26, 46, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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

// Close gallery details when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.gallery-item')) {
        document.querySelectorAll('.gallery-item.active').forEach(el => {
            el.classList.remove('active');
        });
    }
});
