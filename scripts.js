// Artworks data - matches actual files in assets/paintings/
const artworks = [
    { title: 'Balcony Flowers', src: 'assets/paintings/balcony-flowers.jpg', description: 'A vibrant display of blooming flowers on a sunlit balcony', price: '£450', size: '60 × 80 cm' },
    { title: 'Balcony Table', src: 'assets/paintings/balcony-table.jpg', description: 'An intimate corner scene with elegant table setting', price: '£380', size: '50 × 70 cm' },
    { title: 'Fall', src: 'assets/paintings/fall.jpg', description: 'Autumn colors painting the landscape in warm hues', price: '£520', size: '70 × 90 cm' },
    { title: 'Field with Cows', src: 'assets/paintings/field-with-cows.jpg', description: 'Pastoral countryside scene with grazing cattle', price: '£580', size: '70 × 100 cm' },
    { title: 'Flower Café', src: 'assets/paintings/flower-cafe.jpg', description: 'A charming café adorned with beautiful floral arrangements', price: '£420', size: '55 × 75 cm' },
    { title: 'London', src: 'assets/paintings/london.jpg', description: 'The vibrant energy of London captured in watercolour', price: '£620', size: '75 × 95 cm' },
    { title: 'Porto Bridge', src: 'assets/paintings/porto-bridge.jpg', description: 'The iconic bridge spanning across the Douro River', price: '£650', size: '80 × 100 cm' },
    { title: 'Sea Sunset', src: 'assets/paintings/sea-sunset.jpg', description: 'Golden hour reflections on calm ocean waters', price: '£480', size: '60 × 90 cm' },
    { title: 'Turkey Boat', src: 'assets/paintings/turkey-boat.jpg', description: 'Traditional boat resting on turquoise Turkish waters', price: '£540', size: '65 × 85 cm' },
    { title: 'Water Lilies', src: 'assets/paintings/water-lillies.jpg', description: 'Serene pond with floating water lilies', price: '£490', size: '60 × 80 cm' },
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

    return item;
}

// Elegant Canvas Animation - Flowing particles with connections
function initializeCanvasAnimation() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;

    const container = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    const simplex = new SimplexNoise();

    let particles = [];
    let ripples = [];
    let animationId;
    let time = 0;

    const config = {
        particleCount: 160,
        connectionDistance: 160,
        particleSize: 2.5,
        speed: 0.3,
        noiseScale: 0.003,
        noiseStrength: 2,
        baseColor: { r: 187, g: 148, b: 87 },
        fadeColor: { r: 255, g: 255, b: 255 },
        interactionRadius: 400,
        repulsionStrength: 32,
        attractionStrength: 22
    };

    // Extended canvas offset (connectionDistance beyond visible area)
    const extend = config.connectionDistance;

    // Interaction state
    const interaction = {
        active: false,
        x: 0,
        y: 0,
        prevX: 0,
        prevY: 0,
        dragDistance: 0  // Track distance since last trail ripple
    };

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.homeX = this.x;
            this.homeY = this.y;
            this.vx = 0;
            this.vy = 0;
            this.life = Math.random() * 0.5 + 0.5;
            this.size = Math.random() * config.particleSize + 0.5;
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

            // Interaction forces
            if (interaction.active) {
                const dx = this.x - interaction.x;
                const dy = this.y - interaction.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.interactionRadius && distance > 0) {
                    // Repulsion force - push particles away
                    const force = (1 - distance / config.interactionRadius) * config.repulsionStrength;
                    this.vx += (dx / distance) * force * 0.1;
                    this.vy += (dy / distance) * force * 0.1;

                    // Wind effect from drag
                    const windX = interaction.x - interaction.prevX;
                    const windY = interaction.y - interaction.prevY;
                    this.vx += windX * 0.1 * (1 - distance / config.interactionRadius);
                    this.vy += windY * 0.1 * (1 - distance / config.interactionRadius);
                }
            }

            // Damping
            this.vx *= 0.98;
            this.vy *= 0.98;

            // Limit velocity
            const maxSpeed = config.speed * 3;
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > maxSpeed) {
                this.vx = (this.vx / speed) * maxSpeed;
                this.vy = (this.vy / speed) * maxSpeed;
            }

            this.x += this.vx;
            this.y += this.vy;

            // Wrap around edges (using full canvas including extended area)
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            const alpha = this.life * 0.8;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${config.baseColor.r}, ${config.baseColor.g}, ${config.baseColor.b}, ${alpha})`;
            ctx.fill();
        }
    }

    class Ripple {
        constructor(x, y, type) {
            this.x = x;
            this.y = y;
            this.type = type; // 'push', 'pull', or 'trail'
            this.radius = 0;

            // Trail ripples are smaller and weaker
            if (type === 'trail') {
                this.maxRadius = 300;
                this.speed = 4;
                this.waveWidth = 50;
                this.strength = 0.4;
            } else {
                this.maxRadius = Math.max(canvas.width, canvas.height);
                this.speed = type === 'push' ? 6 : 5;
                this.waveWidth = 80;
                this.strength = type === 'push' ? 1 : 0.6;
            }
        }

        update() {
            this.radius += this.speed;
            return this.radius < this.maxRadius;
        }

        // Apply wave force to a particle
        applyToParticle(particle) {
            const dx = particle.x - this.x;
            const dy = particle.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Check if particle is within the wave band
            const distanceFromWave = distance - this.radius;

            if (Math.abs(distanceFromWave) < this.waveWidth) {
                // Sinusoidal wave shape - particles oscillate as wave passes
                const wavePhase = (distanceFromWave / this.waveWidth) * Math.PI;
                const waveForce = Math.sin(wavePhase) * this.strength;

                // Decay based on how far the wave has traveled
                const decay = 1 - (this.radius / this.maxRadius);

                // Direction: outward for push, inward for pull
                if (distance > 0) {
                    const forceMultiplier = waveForce * decay * 2;
                    particle.vx += (dx / distance) * forceMultiplier;
                    particle.vy += (dy / distance) * forceMultiplier;
                }
            }
        }

        // Affect flowing curves with same wave pattern
        getDisplacement(x, y) {
            const dx = x - this.x;
            const dy = y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const distanceFromWave = distance - this.radius;

            if (Math.abs(distanceFromWave) < this.waveWidth) {
                const wavePhase = (distanceFromWave / this.waveWidth) * Math.PI;
                const waveForce = Math.sin(wavePhase);
                const decay = 1 - (this.radius / this.maxRadius);
                return waveForce * decay * 15 * this.strength;
            }
            return 0;
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

                // Add ripple displacement
                let rippleDisplacement = 0;
                ripples.forEach(ripple => {
                    rippleDisplacement += ripple.getDisplacement(x, yOffset + noise * amplitude);
                });

                const y = yOffset + noise * amplitude + rippleDisplacement;

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
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        // Extend canvas beyond visible area
        canvas.width = containerWidth + extend * 2;
        canvas.height = containerHeight + extend * 2;

        // Position canvas with negative offset
        canvas.style.position = 'absolute';
        canvas.style.left = -extend + 'px';
        canvas.style.top = -extend + 'px';
        canvas.style.width = canvas.width + 'px';
        canvas.style.height = canvas.height + 'px';
    }

    function getCanvasCoords(e) {
        const rect = container.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        // Add extend offset since canvas is positioned with negative margin
        return {
            x: clientX - rect.left + extend,
            y: clientY - rect.top + extend
        };
    }

    function handleStart(e) {
        const coords = getCanvasCoords(e);
        interaction.active = true;
        interaction.x = coords.x;
        interaction.y = coords.y;
        interaction.prevX = coords.x;
        interaction.prevY = coords.y;
        interaction.dragDistance = 0;

        // Create push ripple
        ripples.push(new Ripple(coords.x, coords.y, 'push'));
    }

    function handleMove(e) {
        if (!interaction.active) return;
        const coords = getCanvasCoords(e);
        interaction.prevX = interaction.x;
        interaction.prevY = interaction.y;
        interaction.x = coords.x;
        interaction.y = coords.y;

        // Calculate distance moved
        const dx = coords.x - interaction.prevX;
        const dy = coords.y - interaction.prevY;
        const moved = Math.sqrt(dx * dx + dy * dy);
        interaction.dragDistance += moved;

        // Spawn trail ripple every 60 pixels of drag
        if (interaction.dragDistance > 60) {
            ripples.push(new Ripple(coords.x, coords.y, 'trail'));
            interaction.dragDistance = 0;
        }
    }

    function handleEnd() {
        if (interaction.active) {
            // Create pull ripple and attract particles back
            ripples.push(new Ripple(interaction.x, interaction.y, 'pull'));

            // Apply attraction force to nearby particles
            particles.forEach(particle => {
                const dx = particle.x - interaction.x;
                const dy = particle.y - interaction.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.interactionRadius * 1.5 && distance > 0) {
                    const force = (1 - distance / (config.interactionRadius * 1.2)) * config.attractionStrength;
                    particle.vx -= (dx / distance) * force * 0.3;
                    particle.vy -= (dy / distance) * force * 0.3;
                }
            });
        }
        interaction.active = false;
    }

    function draw() {
        // Clear with fade effect for trails
        ctx.fillStyle = 'rgba(26, 26, 46, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update ripples and apply wave forces to particles
        ripples = ripples.filter(ripple => {
            const alive = ripple.update();
            if (alive) {
                // Apply ripple wave to all particles
                particles.forEach(particle => {
                    ripple.applyToParticle(particle);
                });
            }
            return alive;
        });

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
    initParticles();

    // Initial clear
    ctx.fillStyle = 'rgba(26, 26, 46, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    draw();

    window.addEventListener('resize', () => {
        resizeCanvas();
    });

    // Mouse/touch interaction
    container.addEventListener('mousedown', handleStart);
    container.addEventListener('mousemove', handleMove);
    container.addEventListener('mouseup', handleEnd);
    container.addEventListener('mouseleave', handleEnd);
    container.addEventListener('touchstart', handleStart, { passive: true });
    container.addEventListener('touchmove', handleMove, { passive: true });
    container.addEventListener('touchend', handleEnd);

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

        // Show loading state
        const submitButton = form.querySelector('.submit-button');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        try {
            // Submit to Formspree
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                showFormStatus('Thank you for your message! I will get back to you soon.', 'success');
                form.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
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
