// Maleri data - nu med konsekvent nummerering og korrekte billedesti
const paintings = Array.from({ length: 64 }, (_, i) => {
    const paintingNumber = i + 1;
    return {
        id: paintingNumber,
        title: `Maleri ${paintingNumber}`,
        category: getCategory(paintingNumber),
        medium: getMedium(paintingNumber),
        year: getYear(paintingNumber),
        imageUrl: `billeder/${paintingNumber}.jpg`,  // Ændret fra images/billeder/ til billeder/
        description: `Dette maleri er inspireret af naturen og skabt med stor passion. Værk ${paintingNumber} i serien.`
    };
});

// Hjælpefunktioner for at give meningfuld data baseret på maleri nummer
function getCategory(number) {
    const categories = ['landscape', 'flowers', 'animals', 'seasons'];
    return categories[number % categories.length];
}

function getMedium(number) {
    const mediums = ['oil', 'acrylic', 'watercolor', 'mixed'];
    return mediums[number % mediums.length];
}

function getYear(number) {
    return 2020 + (number % 4); // Fordeler årene mellem 2020-2023
}

const galleryGrid = document.getElementById('gallery-grid');
const categoryFilter = document.getElementById('category');
const mediumFilter = document.getElementById('medium');
const sortFilter = document.getElementById('sort');
const resetButton = document.getElementById('reset-filters');
const prevButton = document.getElementById('prev-page');
const nextButton = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');
const firstPageButton = document.getElementById('first-page');

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
        if (sortBy === 'name') return a.title.localeCompare(b.title);
        return a.id - b.id; // Standard sortering efter ID (nummerisk)
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

// Forbedret Lightbox funktion
function openLightbox(painting) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-container">
            <span class="close-lightbox">&times;</span>
            <div class="lightbox-content">
                <div class="lightbox-image-container">
                    <img src="${painting.imageUrl}" alt="${painting.title}" loading="eager">
                    <div class="lightbox-navigation">
                        <button class="nav-button prev-button" aria-label="Forrige maleri">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <button class="nav-button next-button" aria-label="Næste maleri">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
                <div class="lightbox-info">
                    <h3>${painting.title}</h3>
                    <div class="lightbox-meta">
                        <span class="meta-item">
                            <i class="fas fa-paint-brush"></i>
                            ${painting.medium === 'oil' ? 'Olie' :
        painting.medium === 'acrylic' ? 'Akryl' :
            painting.medium === 'watercolor' ? 'Akvarel' : 'Mixet medium'}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-calendar-alt"></i>
                            ${painting.year}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-tags"></i>
                            ${painting.category === 'landscape' ? 'Landskab' :
        painting.category === 'flowers' ? 'Blomster' :
            painting.category === 'animals' ? 'Dyr' : 'Årstider'}
                        </span>
                    </div>
                    <p class="lightbox-description">${painting.description}</p>
                <a href="contact.html?subject=reservation" 
                   class="btn btn-primary lightbox-inquiry">
                    <i class="fas fa-envelope"></i> Reserver dette maleri
                </a>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden'; // Forhindrer scrolling i baggrunden

    // Luk lightbox
    lightbox.querySelector('.close-lightbox').addEventListener('click', () => {
        closeLightbox(lightbox);
    });

    // Luk ved at klikke udenfor indholdet
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox(lightbox);
        }
    });

    // Navigation mellem malerier
    const currentIndex = filteredPaintings.findIndex(p => p.id === painting.id);

    if (currentIndex > 0) {
        const prevButton = lightbox.querySelector('.prev-button');
        prevButton.addEventListener('click', () => {
            lightbox.remove();
            openLightbox(filteredPaintings[currentIndex - 1]);
        });
    } else {
        lightbox.querySelector('.prev-button').style.visibility = 'hidden';
    }

    if (currentIndex < filteredPaintings.length - 1) {
        const nextButton = lightbox.querySelector('.next-button');
        nextButton.addEventListener('click', () => {
            lightbox.remove();
            openLightbox(filteredPaintings[currentIndex + 1]);
        });
    } else {
        lightbox.querySelector('.next-button').style.visibility = 'hidden';
    }

    // Tilføj keyboard navigation
    function handleKeyDown(e) {
        if (e.key === 'Escape') {
            closeLightbox(lightbox);
        } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
            lightbox.remove();
            openLightbox(filteredPaintings[currentIndex - 1]);
        } else if (e.key === 'ArrowRight' && currentIndex < filteredPaintings.length - 1) {
            lightbox.remove();
            openLightbox(filteredPaintings[currentIndex + 1]);
        }
    }

    document.addEventListener('keydown', handleKeyDown);

    // Fjern event listener når lightbox lukkes
    lightbox._handleKeyDown = handleKeyDown;
}

function closeLightbox(lightbox) {
    lightbox.style.opacity = '0';
    setTimeout(() => {
        document.body.style.overflow = 'auto';
        document.removeEventListener('keydown', lightbox._handleKeyDown);
        lightbox.remove();
    }, 300);
}

function setupEventListeners() {
    categoryFilter.addEventListener('change', () => {
        currentPage = 1;
        renderGallery();
    });

    mediumFilter.addEventListener('change', () => {
        currentPage = 1;
        renderGallery();
    });

    firstPageButton.addEventListener('click', () => {
        if (currentPage !== 1) {
            currentPage = 1;
            renderGallery();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
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