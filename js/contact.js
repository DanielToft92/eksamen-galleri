function initMap() {
    const map = L.map('map').setView([55.4640, 12.1704], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([55.4640, 12.1704]).addTo(map)
        .bindPopup('Mit galleri<br>Lyngvej 21, 4600 Køge')
        .openPopup();
}

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

function handleFormSubmit() {
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        console.log('Formular indsendt:', data);

        alert('Tak for din besked! Jeg vender tilbage til dig snarest.');

        contactForm.reset();
    });
}

function handleReservationQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    const subject = urlParams.get('subject');

    if (subject === 'reservation') {
        const subjectDropdown = document.getElementById('subject');
        if (subjectDropdown) {
            const options = subjectDropdown.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].textContent.trim() === 'Reservering') {
                    subjectDropdown.selectedIndex = i;
                    break;
                }
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    setupFAQ();
    handleFormSubmit();
    handleReservationQuery(); // Tilføj denne linje
});

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    setupFAQ();
    handleFormSubmit();
});
