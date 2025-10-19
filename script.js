// Простая навигация по представлениям (home / os)
const views = Array.from(document.querySelectorAll('[data-view]'));
const links = Array.from(document.querySelectorAll('[data-link]'));

function show(id) {
    views.forEach(v => v.classList.toggle('active', v.id === id));
    if (id === 'home') {
        history.pushState({view: 'home'}, '', '#');
    } else {
        history.pushState({view: id}, '', '#' + id);
    }
}

// Клики по карточкам/кнопкам
links.forEach(el => el.addEventListener('click', (e) => {
    e.preventDefault();
    const id = el.dataset.link;
    show(id);
    scrollTo({top: 0, behavior: 'smooth'});
}));

// Инициализация по хэшу URL
const initial = location.hash.replace('#', '');
if (initial && document.getElementById(initial)) {
    show(initial);
}

// Поддержка кнопки "назад" браузера
window.addEventListener('popstate', (e) => {
    const id = (location.hash || '#').replace('#', '') || 'home';
    if (document.getElementById(id)) {
        views.forEach(v => v.classList.toggle('active', v.id === id));
    }
});

// Копирование в буфер из блоков .code
document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-copy]');
    if (!btn) return;
    const sel = btn.getAttribute('data-copy');
    const el = document.querySelector(sel);
    if (!el) return;
    const text = el.innerText.trim();
    navigator.clipboard.writeText(text).then(() => {
        const old = btn.textContent;
        btn.textContent = 'Скопировано';
        setTimeout(() => btn.textContent = old, 1200);
    }).catch(() => {
        alert('Не удалось скопировать.');
    });
});

// Текущий год в подвале
document.getElementById('year').textContent = new Date().getFullYear();

// Theme switcher
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

function applyTheme(theme) {
    if (theme === 'light') {
        body.setAttribute('data-theme', 'light');
    } else {
        body.removeAttribute('data-theme');
    }
}

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    // Add rotation animation
    themeToggle.classList.add('rotate');
    setTimeout(() => {
        themeToggle.classList.remove('rotate');
    }, 50);
});

// Load theme from localStorage or system preference
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Set initial theme
if (savedTheme) {
    applyTheme(savedTheme);
} else if (prefersDark) {
    applyTheme('dark');
} else {
    applyTheme('dark'); // Default to dark
}
