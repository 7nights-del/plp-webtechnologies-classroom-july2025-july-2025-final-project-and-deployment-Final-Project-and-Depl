// Styles Kibao Website JavaScript

document.addEventListener('DOMContentLoaded', function() {

    // ========================================
    // 1. CONTACT FORM HANDLING
    // ========================================

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const name = contactForm.querySelector('input[type="text"]').value;
            const email = contactForm.querySelector('input[type="email"]').value;
            const message = contactForm.querySelector('textarea').value;

            // Basic validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            // Simulate form submission (replace with actual API call)
            submitContactForm(name, email, message);
        });
    }

    // ========================================
    // 2. GALLERY LIGHTBOX FUNCTIONALITY
    // ========================================

    const galleryImages = document.querySelectorAll('.gallery img');
    let currentImageIndex = 0;

    // Create lightbox elements
    const lightbox = createLightbox();

    galleryImages.forEach((img, index) => {
        img.addEventListener('click', function() {
            currentImageIndex = index;
            openLightbox(img.src, img.alt);
        });

        // Add cursor pointer for gallery images
        img.style.cursor = 'pointer';
    });

    // ========================================
    // 3. SMOOTH SCROLLING FOR NAVIGATION
    // ========================================

    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ========================================
    // 4. MOBILE NAVIGATION TOGGLE
    // ========================================

    const nav = document.querySelector('nav');
    const navLinksContainer = nav.querySelector('div:last-child');

    // Create mobile menu toggle button
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.innerHTML = '☰';
    mobileMenuToggle.style.display = 'none';

    // Insert toggle button before nav links
    nav.insertBefore(mobileMenuToggle, navLinksContainer);

    mobileMenuToggle.addEventListener('click', function() {
        navLinksContainer.classList.toggle('active');
        this.innerHTML = navLinksContainer.classList.contains('active') ? '✕' : '☰';
    });

    // ========================================
    // 5. INTERSECTION OBSERVER FOR ANIMATIONS
    // ========================================

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .about-content, .gallery');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // ========================================
    // 6. IMAGE LAZY LOADING FOR GALLERY
    // ========================================

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        galleryImages.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    }

    // ========================================
    // 7. BUTTON CLICK HANDLERS
    // ========================================

    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add ripple effect
            createRippleEffect(this, e);

            // Handle specific button actions
            if (this.textContent.includes('Get Started')) {
                // Scroll to services section or redirect to contact
                const servicesSection = document.querySelector('.services');
                if (servicesSection) {
                    servicesSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                    window.location.href = 'contact.html';
                }
            }
        });
    });

    // ========================================
    // 8. KEYBOARD NAVIGATION
    // ========================================

    document.addEventListener('keydown', function(e) {
        // Escape key to close lightbox
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }

        // Arrow keys for gallery navigation
        if (lightbox.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                navigateGallery('prev');
            } else if (e.key === 'ArrowRight') {
                navigateGallery('next');
            }
        }
    });

    // ========================================
    // HELPER FUNCTIONS
    // ========================================

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'error' ? '#e63946' : '#2a9d8f'};
            color: white;
            border-radius: 5px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    function submitContactForm(name, email, message) {
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            showNotification('Thank you for your message! We\'ll get back to you soon.');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1000);
    }

    function createLightbox() {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <button class="lightbox-prev"><</button>
                <button class="lightbox-next">></button>
                <img class="lightbox-image" src="" alt="">
                <div class="lightbox-caption"></div>
            </div>
        `;

        // Add lightbox styles
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const content = lightbox.querySelector('.lightbox-content');
        content.style.cssText = `
            position: relative;
            max-width: 90%;
            max-height: 90%;
            display: flex;
            flex-direction: column;
            align-items: center;
        `;

        document.body.appendChild(lightbox);

        // Close lightbox functionality
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
                closeLightbox();
            }
        });

        // Navigation buttons
        lightbox.querySelector('.lightbox-prev').addEventListener('click', () => navigateGallery('prev'));
        lightbox.querySelector('.lightbox-next').addEventListener('click', () => navigateGallery('next'));

        return lightbox;
    }

    function openLightbox(src, alt) {
        const lightboxImg = lightbox.querySelector('.lightbox-image');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');

        lightboxImg.src = src;
        lightboxCaption.textContent = alt;

        lightbox.style.display = 'flex';
        setTimeout(() => {
            lightbox.style.opacity = '1';
            lightbox.classList.add('active');
        }, 10);
    }

    function closeLightbox() {
        lightbox.style.opacity = '0';
        setTimeout(() => {
            lightbox.style.display = 'none';
            lightbox.classList.remove('active');
        }, 300);
    }

    function navigateGallery(direction) {
        if (direction === 'next') {
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        } else {
            currentImageIndex = currentImageIndex === 0 ? galleryImages.length - 1 : currentImageIndex - 1;
        }

        const nextImage = galleryImages[currentImageIndex];
        openLightbox(nextImage.src, nextImage.alt);
    }

    function createRippleEffect(button, event) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // ========================================
    // 9. ADD CSS ANIMATIONS
    // ========================================

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }

        @keyframes ripple {
            to { transform: scale(2); opacity: 0; }
        }

        .animate-in {
            animation: fadeInUp 0.6s ease forwards;
        }

        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .lazy {
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .lazy.loaded {
            opacity: 1;
        }

        /* Mobile Navigation Styles */
        @media (max-width: 768px) {
            .mobile-menu-toggle {
                display: block !important;
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 10px;
            }

            nav div:last-child {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: #333;
                flex-direction: column;
                padding: 20px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }

            nav div:last-child.active {
                display: flex;
            }

            nav div:last-child a {
                margin: 10px 0;
                padding: 10px;
                border-bottom: 1px solid #555;
            }
        }
    `;

    document.head.appendChild(style);

    // ========================================
    // 10. PERFORMANCE OPTIMIZATIONS
    // ========================================

    // Debounce function for scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Add scroll-based header effects
    const header = document.querySelector('nav');
    const debouncedScroll = debounce(function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, 10);

    window.addEventListener('scroll', debouncedScroll);

    // Add scrolled header styles
    const scrolledStyle = document.createElement('style');
    scrolledStyle.textContent = `
        nav.scrolled {
            background: rgba(51, 51, 51, 0.95);
            backdrop-filter: blur(10px);
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
    `;
    document.head.appendChild(scrolledStyle);

    console.log('Styles Kibao website loaded successfully! ✨');
});
