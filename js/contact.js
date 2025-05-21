// Initialisering af kort
function initMap() {
    // Koordinater for Lyngvej 21, Køge (55.4640° N, 12.1704° E)
    const map = L.map('map').setView([55.4640, 12.1704], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([55.4640, 12.1704]).addTo(map)
        .bindPopup('Mit galleri<br>Lyngvej 21, 4600 Køge')
        .openPopup();
}

// FAQ funktionalitet
function setupFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            faqItem.classList.toggle('active');

            // Luk andre åbne spørgsmål
            faqQuestions.forEach(q => {
                if (q !== question) {
                    q.parentElement.classList.remove('active');
                }
            });
        });
    });
}

// Formular håndtering
function handleFormSubmit() {
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Simuler formularindsendelse
        console.log('Formular indsendt:', data);

        // Vis succesbesked
        alert('Tak for din besked! Jeg vender tilbage til dig snarest.');

        // Nulstil formular
        contactForm.reset();
    });
}

// Initialisering
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    setupFAQ();
    handleFormSubmit();
});