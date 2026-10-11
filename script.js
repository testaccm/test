// Static, hash-based navigation works on GitHub Pages without server rewrites.
const views = [...document.querySelectorAll('[data-view]')];
const links = [...document.querySelectorAll('[data-link]')];

function currentView() {
    const id = decodeURIComponent(location.hash.slice(1));
    return views.some(view => view.id === id) ? id : 'home';
}

function render(id, {scroll = false} = {}) {
    const target = views.some(view => view.id === id) ? id : 'home';
    views.forEach(view => {
        const active = view.id === target;
        view.classList.toggle('active', active);
        view.setAttribute('aria-hidden', String(!active));
    });
    if (scroll) window.scrollTo({top: 0, behavior: 'smooth'});
}

links.forEach(link => {
    const navigate = event => {
        if (event.type === 'keydown' && !['Enter', ' '].includes(event.key)) return;
        if (event.type === 'keydown') event.preventDefault();
        const id = link.dataset.link;
        if (!views.some(view => view.id === id)) return;
        if (location.hash !== `#${id}`) history.pushState({view: id}, '', `#${id}`);
        render(id, {scroll: true});
    };
    link.addEventListener('click', navigate);
    if (link.matches('[role="button"]')) link.addEventListener('keydown', navigate);
});

render(currentView());
window.addEventListener('popstate', () => render(currentView(), {scroll: true}));
window.addEventListener('hashchange', () => render(currentView()));

document.addEventListener('click', async event => {
    const button = event.target.closest('[data-copy]');
    if (!button) return;
    const content = document.querySelector(button.getAttribute('data-copy'));
    if (!content || !navigator.clipboard?.writeText) return;
    try {
        await navigator.clipboard.writeText(content.innerText.trim());
        const previous = button.textContent;
        button.textContent = 'Скопировано';
        window.setTimeout(() => { button.textContent = previous; }, 1200);
    } catch {
        button.textContent = 'Не удалось скопировать';
    }
});

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const themeToggle = document.getElementById('theme-toggle');
const storageKey = 'theme';
function readTheme() {
    try { return localStorage.getItem(storageKey); } catch { return null; }
}
function applyTheme(theme) {
    document.body.dataset.theme = theme === 'light' ? 'light' : 'dark';
    themeToggle?.setAttribute('aria-pressed', String(theme === 'light'));
}

let savedTheme = readTheme();
if (savedTheme !== 'light' && savedTheme !== 'dark') {
    savedTheme = window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}
applyTheme(savedTheme);

themeToggle?.addEventListener('click', () => {
    const next = document.body.dataset.theme === 'light' ? 'dark' : 'light';
    applyTheme(next);
    try { localStorage.setItem(storageKey, next); } catch { /* Private browsing can disable storage. */ }
    themeToggle.classList.add('rotate');
    window.setTimeout(() => themeToggle.classList.remove('rotate'), 220);
});
