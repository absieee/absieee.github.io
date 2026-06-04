import { WORK } from '../data/work.js';
import { EXPERIENCE } from '../data/experience.js';
import { TESTIMONIALS } from '../data/testimonials.js';

// --- Testimonials ---

const renderAuthor = (t) =>
  t.linkedin
    ? `<a href="${t.linkedin}" target="_blank" rel="noopener noreferrer">${t.author}</a>`
    : t.author;

const renderQuote = (t) => {
  const q = t.emphasis
    ? t.quote.replace(t.emphasis, `<span class="it">${t.emphasis}</span>`)
    : t.quote;
  return `"${q}"`;
};

const cardHTML = (t) =>
  `<div class="quote-card"><blockquote>${renderQuote(t)}</blockquote><div class="by"><b>${renderAuthor(t)}</b><br>${t.role}</div></div>`;

const featured = TESTIMONIALS.find(t => t.featured);
const highlighted = TESTIMONIALS.filter(t => t.highlight);
const rest = TESTIMONIALS.filter(t => !t.featured && !t.highlight);

if (featured) {
  document.getElementById('pull-quote').innerHTML =
    `<blockquote>${renderQuote(featured)}</blockquote><div class="by"><b>${renderAuthor(featured)}</b> — ${featured.role}</div>`;
}

document.getElementById('quotes-row').innerHTML = highlighted.map(cardHTML).join('');

if (rest.length > 0) {
  const carousel = document.getElementById('quotes-carousel');
  const track = document.getElementById('carousel-track');
  const dotsEl = document.getElementById('carousel-dots');
  let current = 0;

  track.innerHTML = rest.map(cardHTML).join('');
  dotsEl.innerHTML = rest.map((_, i) =>
    `<button class="carousel-dot${i === 0 ? ' active' : ''}" aria-label="Go to slide ${i + 1}"></button>`
  ).join('');

  const dots = dotsEl.querySelectorAll('.carousel-dot');

  const goTo = (n) => {
    current = (n + rest.length) % rest.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  };

  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
  carousel.querySelector('.carousel-prev').addEventListener('click', () => goTo(current - 1));
  carousel.querySelector('.carousel-next').addEventListener('click', () => goTo(current + 1));
  carousel.style.display = 'flex';
}

// --- Work ---

document.getElementById('work-list').innerHTML = WORK.map((w, i) => {
  const idx = String(i + 1).padStart(3, '0');
  const chips = w.chips.map(c => `<span class="chip">${c}</span>`).join('');
  const open = w.url ? `<a class="case" href="${w.url}">` : '<div class="case">';
  const close = w.url ? '</a>' : '</div>';
  const arrow = w.url ? '<span class="arrow">→</span>' : '';
  return `${open}<span class="idx">${idx}</span><div><h3>${w.title}</h3><p class="desc">${w.desc}</p><div class="chips">${chips}</div></div>${arrow}${close}`;
}).join('');

// --- Experience ---

document.getElementById('experience-tl').innerHTML = EXPERIENCE.map(e => {
  const co = e.linkedin
    ? `<a href="${e.linkedin}" target="_blank" rel="noopener noreferrer" class="tl-co">${e.company}</a>`
    : `<span class="tl-co">${e.company}</span>`;
  return `<div class="tl-item"><div class="tl-when">${e.when}</div><div><div class="tl-role">${e.role} · ${co}</div><p class="tl-desc">${e.desc}</p></div></div>`;
}).join('');

// --- Theme toggle ---

const root = document.documentElement;
const btn = document.getElementById('themeBtn');
const saved = localStorage.getItem('abhi-theme');

if (saved) {
  root.setAttribute('data-theme', saved);
} else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
  root.setAttribute('data-theme', 'dark');
}

const setTheme = (t) => {
  root.setAttribute('data-theme', t);
  localStorage.setItem('abhi-theme', t);
};

btn.addEventListener('click', () =>
  setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark')
);

// --- Blog feed ---

const FEED = 'https://absieee.github.io/blog/feed.xml';
const postsList = document.getElementById('posts-list');

fetch(FEED)
  .then(r => r.text())
  .then(xml => {
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    const entries = Array.from(doc.querySelectorAll('entry'));
    if (!entries.length) return;
    postsList.innerHTML = entries.map(e => {
      const title = e.querySelector('title')?.textContent ?? '';
      const url = e.querySelector('link[rel="alternate"]')?.getAttribute('href')
        ?? e.querySelector('link')?.getAttribute('href')
        ?? '#';
      const published = e.querySelector('published')?.textContent ?? '';
      const d = published ? new Date(published) : null;
      const dateStr = d
        ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        : '';
      return `<a class="post" href="${url}" target="_blank" rel="noopener noreferrer"><span class="date">${dateStr}</span><span class="pt">${title}</span></a>`;
    }).join('');
  })
  .catch(() => {
    postsList.innerHTML = `<a class="post" href="https://absieee.github.io/blog" target="_blank" rel="noopener noreferrer"><span class="pt">Visit the blog →</span></a>`;
  });

// --- Mobile menu ---

const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('mobileMenu');
const menuClose = document.getElementById('menuClose');

const setMenu = (open) => {
  menu.hidden = !open;
  menuBtn.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
};

menuBtn.addEventListener('click', () => setMenu(true));
menuClose.addEventListener('click', () => setMenu(false));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !menu.hidden) setMenu(false);
});
