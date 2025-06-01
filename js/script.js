const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navbar = document.querySelector('.navbar');

function setupMobileMenu() {
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Toggle ikon
        const icon = hamburger.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = hamburger.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
}

function setupNavbarScroll() {
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                return;
            }

            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

function setupFrontpage() {
    // Galleri hover effekter
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
        galleryItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const img = item.querySelector('img');
                if (img) img.style.transform = 'scale(1.1)';
            });

            item.addEventListener('mouseleave', () => {
                const img = item.querySelector('img');
                if (img) img.style.transform = 'scale(1)';
            });
        });
    }

    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.about-teaser, .gallery-preview, .color-showcase');

        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;

            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    const animatedElements = document.querySelectorAll('.about-teaser, .gallery-preview, .color-showcase');
    if (animatedElements.length > 0) {
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        });

        // Trigger animationer ved load
        setTimeout(animateOnScroll, 300);
        window.addEventListener('scroll', animateOnScroll);
    }
}

function setupAboutPage() {
    // Timeline animationer
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length > 0) {
        const animateTimeline = () => {
            timelineItems.forEach(item => {
                const itemPosition = item.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.3;

                if (itemPosition < screenPosition) {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }
            });
        };

        timelineItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        });

        setTimeout(animateTimeline, 300);
        window.addEventListener('scroll', animateTimeline);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    setupNavbarScroll();
    setupSmoothScrolling();

    if (document.querySelector('.gallery-grid')) {
        setupFrontpage();
    }
    if (document.querySelector('.timeline')) {
        setupAboutPage();
    }
});

if ('IntersectionObserver' in window) {
    const lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));

    if (lazyImages.length > 0) {
        let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove('lazy');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    }
}