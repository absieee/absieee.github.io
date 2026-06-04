# JS Modernisation: ES Modules Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract all inline JavaScript from `index.html` into `js/main.js` and convert data files to native ES modules.

**Architecture:** Three data files get `export const` added. A new `js/main.js` imports them and contains all render logic written in modern JS. `index.html` drops 6 script tags and gains one `<script type="module">`. No build step, no bundler — native browser modules throughout.

**Tech Stack:** Vanilla JS ES modules, GitHub Pages static hosting.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `data/work.js` | Modify | Add `export` keyword |
| `data/experience.js` | Modify | Add `export` keyword |
| `data/testimonials.js` | Modify | Add `export` keyword |
| `js/main.js` | Create | All render logic + theme toggle + blog feed |
| `index.html` | Modify | Remove 6 script tags, add 1 module script |

---

### Task 1: Add exports to data files

**Files:**
- Modify: `data/work.js` (line 1)
- Modify: `data/experience.js` (line 1)
- Modify: `data/testimonials.js` (line 1)

- [ ] **Step 1: Add `export` to data/work.js**

Change line 1 from:
```js
var WORK = [
```
To:
```js
export const WORK = [
```

- [ ] **Step 2: Add `export` to data/experience.js**

Change line 1 from:
```js
var EXPERIENCE = [
```
To:
```js
export const EXPERIENCE = [
```

- [ ] **Step 3: Add `export` to data/testimonials.js**

Change line 1 from:
```js
var TESTIMONIALS = [
```
To:
```js
export const TESTIMONIALS = [
```

- [ ] **Step 4: Verify syntax**

```bash
node --input-type=module < /dev/null 2>&1 || true
node -e "import('./data/work.js').then(m => console.log('WORK entries:', m.WORK.length))" --input-type=module 2>/dev/null || \
  node --experimental-vm-modules -e "console.log('ok')" 2>/dev/null || \
  python3 -c "
import re
for f in ['data/work.js','data/experience.js','data/testimonials.js']:
    src = open('/Users/abs.sh/Desktop/CODE/personal/absieee.github.io/' + f).read()
    assert src.startswith('export const'), f + ' missing export'
    print(f, 'OK')
"
```
Expected: all three files print OK.

- [ ] **Step 5: Commit**

```bash
cd /Users/abs.sh/Desktop/CODE/personal/absieee.github.io
git add data/work.js data/experience.js data/testimonials.js
git commit -m "convert data files to ES module exports"
```

---

### Task 2: Create js/main.js

**Files:**
- Create: `js/main.js`

- [ ] **Step 1: Create the js/ directory and write main.js**

```bash
mkdir -p /Users/abs.sh/Desktop/CODE/personal/absieee.github.io/js
```

Write the following to `/Users/abs.sh/Desktop/CODE/personal/absieee.github.io/js/main.js`:

```js
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
```

- [ ] **Step 2: Commit**

```bash
cd /Users/abs.sh/Desktop/CODE/personal/absieee.github.io
git add js/main.js
git commit -m "add js/main.js with all render logic as ES module"
```

---

### Task 3: Update index.html and verify

**Files:**
- Modify: `index.html` (lines 174–324)

- [ ] **Step 1: Replace all script tags in index.html**

In `index.html`, find and remove everything from line 174 to line 324 (the three `<script src="data/...">` tags plus the three inline `<script>...</script>` blocks). Replace the entire block with a single line:

```html
<script type="module" src="js/main.js"></script>
```

The removed block starts with:
```html
<script src="data/work.js"></script>
```
And ends with:
```html
})();
</script>
```
(the closing of the blog feed IIFE)

After the edit, `</body>` should be immediately preceded by the single module script tag.

- [ ] **Step 2: Verify the HTML change**

```bash
cd /Users/abs.sh/Desktop/CODE/personal/absieee.github.io
grep -n "script" index.html
```

Expected output — only one script tag remains:
```
NNN:<script type="module" src="js/main.js"></script>
```

- [ ] **Step 3: Verify locally in browser**

```bash
python3 -m http.server 8766 --directory /Users/abs.sh/Desktop/CODE/personal/absieee.github.io &
sleep 1 && curl -s -o /dev/null -w "%{http_code}" http://localhost:8766/
```
Expected: `200`

Open `http://localhost:8766/` in the browser. Verify:
- Page loads with correct styles
- Work section shows 5 case cards
- Experience shows 5 timeline entries
- Testimonials show pull quote + grid + carousel
- Writing section shows blog posts from RSS feed
- Theme toggle (☀/🌙 button) switches light/dark mode

```bash
pkill -f "http.server 8766"
```

- [ ] **Step 4: Commit and push**

```bash
cd /Users/abs.sh/Desktop/CODE/personal/absieee.github.io
git add index.html
git commit -m "replace inline scripts with <script type=\"module\" src=\"js/main.js\">"
git push origin main
```
