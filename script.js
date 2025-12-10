// Translations for all 7 languages
const translations = {
    en: {
        siteName: "ContentBox",
        search: "Search",
        changeLanguage: "Change Language",
        toggleDarkMode: "Toggle Dark Mode",
        back: "Back",
        searchPlaceholder: "Search content...",
        selectLanguage: "Select Language",
        close: "Close",
        languageChanged: "Language changed to"
    },
    ar: {
        siteName: "صندوق المحتوى",
        search: "بحث",
        changeLanguage: "تغيير اللغة",
        toggleDarkMode: "تبديل الوضع الداكن",
        back: "رجوع",
        searchPlaceholder: "البحث عن المحتوى...",
        selectLanguage: "اختر اللغة",
        close: "إغلاق",
        languageChanged: "تم تغيير اللغة إلى"
    },
    id: {
        siteName: "KotakKonten",
        search: "Cari",
        changeLanguage: "Ganti Bahasa",
        toggleDarkMode: "Alihkan Mode Gelap",
        back: "Kembali",
        searchPlaceholder: "Cari konten...",
        selectLanguage: "Pilih Bahasa",
        close: "Tutup",
        languageChanged: "Bahasa diubah ke"
    },
    hi: {
        siteName: "सामग्री बॉक्स",
        search: "खोजें",
        changeLanguage: "भाषा बदलें",
        toggleDarkMode: "डार्क मोड टॉगल करें",
        back: "वापस",
        searchPlaceholder: "सामग्री खोजें...",
        selectLanguage: "भाषा चुनें",
        close: "बंद करें",
        languageChanged: "भाषा बदली गई"
    },
    ru: {
        siteName: "КонтентБокс",
        search: "Поиск",
        changeLanguage: "Изменить язык",
        toggleDarkMode: "Переключить темный режим",
        back: "Назад",
        searchPlaceholder: "Поиск контента...",
        selectLanguage: "Выберите язык",
        close: "Закрыть",
        languageChanged: "Язык изменен на"
    },
    es: {
        siteName: "CajaContenido",
        search: "Buscar",
        changeLanguage: "Cambiar idioma",
        toggleDarkMode: "Alternar modo oscuro",
        back: "Volver",
        searchPlaceholder: "Buscar contenido...",
        selectLanguage: "Seleccionar idioma",
        close: "Cerrar",
        languageChanged: "Idioma cambiado a"
    },
    ur: {
        siteName: "مواد کا خانہ",
        search: "تلاش کریں",
        changeLanguage: "زبان تبدیل کریں",
        toggleDarkMode: "ڈارک موڈ ٹوگل کریں",
        back: "واپس",
        searchPlaceholder: "مواد تلاش کریں...",
        selectLanguage: "زبان منتخب کریں",
        close: "بند کریں",
        languageChanged: "زبان تبدیل ہوگئی"
    }
};

// Boxes data - will be loaded from JSON
let boxesData = {};

// Current language
let currentLanguage = localStorage.getItem('language') || 'en';

// Get DOM elements
const searchBtn = document.getElementById('searchBtn');
const searchContainer = document.getElementById('searchContainer');
const searchInput = document.getElementById('searchInput');
const langBtn = document.getElementById('langBtn');
const langModal = document.getElementById('langModal');
const closeLangModal = document.getElementById('closeLangModal');
const darkModeBtn = document.getElementById('darkModeBtn');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');
const mainContent = document.getElementById('mainContent');
const detailView = document.getElementById('detailView');
const backBtn = document.getElementById('backBtn');
const boxesGrid = document.getElementById('boxesGrid');

// Load boxes data from JSON file
async function loadBoxesData() {
    try {
        const response = await fetch('data.json');
        boxesData = await response.json();
        initializePage();
    } catch (error) {
        console.error('Error loading data:', error);
        boxesGrid.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-color);">Error loading content. Please refresh the page.</p>';
    }
}

// Generate boxes dynamically
function generateBoxes() {
    boxesGrid.innerHTML = ''; // Clear existing boxes
    
    Object.keys(boxesData).forEach(boxId => {
        const data = boxesData[boxId][currentLanguage];
        
        if (data) {
            const box = document.createElement('div');
            box.className = 'box';
            box.setAttribute('data-id', boxId);
            box.setAttribute('role', 'article');
            box.setAttribute('tabindex', '0');
            
            box.innerHTML = `
                <div class="box-image">
                    <img loading="lazy" src="${data.image}" alt="${data.title}">
                </div>
                <div class="box-content">
                    <h3 class="box-title">${data.title}</h3>
                    <p class="box-subtitle">${data.subtitle}</p>
                </div>
            `;
            
            boxesGrid.appendChild(box);
        }
    });
    
    // Attach event listeners to newly generated boxes
    attachBoxListeners();
    animateBoxesOnLoad();
}

// Attach click listeners to dynamically generated boxes
function attachBoxListeners() {
    const boxes = document.querySelectorAll('.box');
    boxes.forEach((box) => {
        box.addEventListener('click', () => {
            const boxId = box.getAttribute('data-id');
            const data = boxesData[boxId];
            
            if (data && data[currentLanguage]) {
                showDetailView(data[currentLanguage]);
            }
        });
    });
}

// Animate boxes on load
function animateBoxesOnLoad() {
    const boxes = document.querySelectorAll('.box');
    boxes.forEach((box, index) => {
        box.style.animationDelay = `${index * 0.1}s`;
    });
}

// Initialize page after data is loaded
function initializePage() {
    changeLanguage(currentLanguage);
    generateBoxes();
}

// Update language modal with all 7 languages
function updateLanguageModal() {
    const modalContent = langModal.querySelector('.lang-modal-content');
    modalContent.innerHTML = `
        <h2>${translations[currentLanguage].selectLanguage}</h2>
        <button class="lang-option" data-lang="en">English</button>
        <button class="lang-option" data-lang="ar">العربية (Arabic)</button>
        <button class="lang-option" data-lang="id">Bahasa Indonesia</button>
        <button class="lang-option" data-lang="hi">हिन्दी (Hindi)</button>
        <button class="lang-option" data-lang="ru">Русский (Russian)</button>
        <button class="lang-option" data-lang="es">Español (Spanish)</button>
        <button class="lang-option" data-lang="ur">اردو (Urdu)</button>
        <button id="closeLangModal" class="close-modal">${translations[currentLanguage].close}</button>
    `;
    
    // Re-attach event listeners
    document.getElementById('closeLangModal').addEventListener('click', () => {
        langModal.classList.add('hidden');
    });
    
    document.querySelectorAll('.lang-option').forEach(option => {
        option.addEventListener('click', (e) => {
            const selectedLang = e.target.getAttribute('data-lang');
            changeLanguage(selectedLang);
            langModal.classList.add('hidden');
        });
    });
}

// Change language function
function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Update page direction for RTL languages
    if (lang === 'ar' || lang === 'ur') {
        document.body.setAttribute('dir', 'rtl');
    } else {
        document.body.setAttribute('dir', 'ltr');
    }
    
    // Update UI text
    document.querySelector('.nav-logo h1').textContent = translations[lang].siteName;
    searchInput.placeholder = translations[lang].searchPlaceholder;
    backBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        ${translations[lang].back}
    `;
    
    // Update button aria-labels
    searchBtn.setAttribute('aria-label', translations[lang].search);
    langBtn.setAttribute('aria-label', translations[lang].changeLanguage);
    darkModeBtn.setAttribute('aria-label', translations[lang].toggleDarkMode);
    
    // Regenerate boxes with new language if data is loaded
    if (Object.keys(boxesData).length > 0) {
        generateBoxes();
    }
    
    // Update language modal
    updateLanguageModal();
}

// Search functionality
let searchTimeout;
let isSearchOpen = false;

searchBtn.addEventListener('click', () => {
    isSearchOpen = !isSearchOpen;
    if (isSearchOpen) {
        searchContainer.classList.remove('hidden');
        searchInput.focus();
    } else {
        searchContainer.classList.add('hidden');
        searchInput.value = '';
        showAllBoxes();
    }
});

searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        showAllBoxes();
        return;
    }
    
    // Wait 2 seconds after user stops typing
    searchTimeout = setTimeout(() => {
        filterBoxes(searchTerm);
    }, 2000);
});

function filterBoxes(searchTerm) {
    const boxes = document.querySelectorAll('.box');
    let visibleCount = 0;
    
    boxes.forEach((box) => {
        const boxId = box.getAttribute('data-id');
        const data = boxesData[boxId];
        
        if (data && data[currentLanguage]) {
            const langData = data[currentLanguage];
            const titleMatch = langData.title.toLowerCase().includes(searchTerm);
            const subtitleMatch = langData.subtitle.toLowerCase().includes(searchTerm);
            const paragraphMatch = langData.paragraph.toLowerCase().includes(searchTerm);
            
            if (titleMatch || subtitleMatch || paragraphMatch) {
                box.style.display = 'block';
                visibleCount++;
            } else {
                box.style.display = 'none';
            }
        }
    });
}

function showAllBoxes() {
    const boxes = document.querySelectorAll('.box');
    boxes.forEach(box => {
        box.style.display = 'block';
    });
}

// Language modal functionality
langBtn.addEventListener('click', () => {
    langModal.classList.remove('hidden');
});

langModal.addEventListener('click', (e) => {
    if (e.target === langModal) {
        langModal.classList.add('hidden');
    }
});

// Dark mode functionality
let isDarkMode = false;

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'enabled') {
    enableDarkMode();
}

darkModeBtn.addEventListener('click', () => {
    if (isDarkMode) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
});

function enableDarkMode() {
    document.body.classList.add('dark-mode');
    sunIcon.classList.add('hidden');
    moonIcon.classList.remove('hidden');
    isDarkMode = true;
    localStorage.setItem('darkMode', 'enabled');
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    sunIcon.classList.remove('hidden');
    moonIcon.classList.add('hidden');
    isDarkMode = false;
    localStorage.setItem('darkMode', 'disabled');
}

// Show detail view
function showDetailView(data) {
    document.getElementById('detailImage').src = data.image;
    document.getElementById('detailImage').alt = data.title;
    document.getElementById('detailTitle').textContent = data.title;
    document.getElementById('detailParagraph').textContent = data.paragraph;
    
    mainContent.classList.add('hidden');
    detailView.classList.remove('hidden');
    window.scrollTo(0, 0);
}

// Back button functionality
backBtn.addEventListener('click', () => {
    detailView.classList.add('hidden');
    mainContent.classList.remove('hidden');
    window.scrollTo(0, 0);
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape key to close detail view or search
    if (e.key === 'Escape') {
        if (!detailView.classList.contains('hidden')) {
            backBtn.click();
        } else if (isSearchOpen) {
            searchBtn.click();
        } else if (!langModal.classList.contains('hidden')) {
            langModal.classList.add('hidden');
        }
    }
    
    // Ctrl/Cmd + K to toggle search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchBtn.click();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadBoxesData();
});