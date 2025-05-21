// Maleri data - i en rigtig app ville dette komme fra en database
const paintings = Array.from({ length: 64 }, (_, i) => ({
    id: i + 1,
    title: `Maleri ${i + 1}`,
    category: ['landscape', 'flowers', 'animals', 'seasons'][Math.floor(Math.random() * 4)],
    medium: ['oil', 'acrylic', 'watercolor', 'mixed'][Math.floor(Math.random() * 4)],
    year: 2020 + Math.floor(Math.random() * 4),
    imageUrl: `images/paintings/painting-${(i % 16) + 1}.jpg`, // Antager 16 unikke billeder der gentages
    description: `Dette maleri er inspireret af naturen og skabt med stor passion. Værk ${i + 1} i serien.`
}));

// DOM elementer
const galleryGrid = document.getElementById('gallery-grid');
const categoryFilter = document.getElementById('category');
const mediumFilter = document.getElementById('medium');
const sortFilter = document.getElementById('sort');
const resetButton = document.getElementById('reset-filters');
const prevButton = document.getElementById('prev-page');
const nextButton = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');

// Pagination variabler
const itemsPerPage = 12;
let currentPage = 1;
let filteredPaintings = [...paintings];

// Initialisering
document.addEventListener('DOMContentLoaded', () => {
    renderGallery();
    setupEventListeners();
});

// Render galleri
function renderGallery() {
    // Filtrering
    const category = categoryFilter.value;
    const medium = mediumFilter.value;

    filteredPaintings = paintings.filter(painting => {
        return (category === 'all' || painting.category === category) &&
            (medium === 'all' || painting.medium === medium);
    });

    // Sortering
    const sortBy = sortFilter.value;
    filteredPaintings.sort((a, b) => {
        if (sortBy === 'newest') return b.year - a.year;
        if (sortBy === 'oldest') return a.year - b.year;
        if (sortBy === 'name') return a.title.localeCompare(b.title);
        return 0;
    });

    // Pagination
    const totalPages = Math.ceil(filteredPaintings.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedPaintings = filteredPaintings.slice(startIndex, startIndex + itemsPerPage);

    // Render malerier
    galleryGrid.innerHTML = '';
    paginatedPaintings.forEach(painting => {
        const paintingElement = document.createElement('div');
        paintingElement.className = 'gallery-item';
        paintingElement.innerHTML = `
            <img src="${painting.imageUrl}" alt="${painting.title}" class="lazy">
            <div class="gallery-item-overlay">
                <h3>${painting.title}</h3>
                <p>${painting.medium === 'oil' ? 'Olie' :
            painting.medium === 'acrylic' ? 'Akryl' :
                painting.medium === 'watercolor' ? 'Akvarel' : 'Mixet medium'} på lærred</p>
            </div>
        `;
        paintingElement.addEventListener('click', () => openLightbox(painting));
        galleryGrid.appendChild(paintingElement);
    });

    // Opdater pagination
    pageInfo.textContent = `Side ${currentPage} af ${totalPages}`;
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages || totalPages === 0;

    // Lazy loading
    if ('IntersectionObserver' in window) {
        const lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));
        const lazyImageObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.getAttribute('src');
                    lazyImage.classList.remove('lazy');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach((lazyImage) => {
            lazyImageObserver.observe(lazyImage);
        });
    }
}

// Lightbox
function openLightbox(painting) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <span class="close-lightbox">&times;</span>
        <div class="lightbox-content">
            <img src="${painting.imageUrl}" alt="${painting.title}">
            <div class="lightbox-caption">
                <h3>${painting.title}</h3>
                <p>${painting.description}</p>
                <p>Teknik: ${painting.medium === 'oil' ? 'Olie' :
        painting.medium === 'acrylic' ? 'Akryl' :
            painting.medium === 'watercolor' ? 'Akvarel' : 'Mixet medium'}</p>
                <p>År: ${painting.year}</p>
            </div>
        </div>
    `;

    document.body.appendChild(lightbox);

    lightbox.querySelector('.close-lightbox').addEventListener('click', () => {
        lightbox.style.opacity = '0';
        setTimeout(() => lightbox.remove(), 300);
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.opacity = '0';
            setTimeout(() => lightbox.remove(), 300);
        }
    });
}

// Event listeners
function setupEventListeners() {
    categoryFilter.addEventListener('change', () => {
        currentPage = 1;
        renderGallery();
    });

    mediumFilter.addEventListener('change', () => {
        currentPage = 1;
        renderGallery();
    });

    sortFilter.addEventListener('change', renderGallery);

    resetButton.addEventListener('click', () => {
        categoryFilter.value = 'all';
        mediumFilter.value = 'all';
        sortFilter.value = 'newest';
        currentPage = 1;
        renderGallery();
    });

    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderGallery();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    nextButton.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredPaintings.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderGallery();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}