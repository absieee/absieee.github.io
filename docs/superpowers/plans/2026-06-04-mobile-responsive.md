# Mobile Responsiveness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Phone-friendly fixes for the four owner-flagged sections: hamburger overlay nav, compressed metrics strip, tighter work cards, swipeable carousel — plus a narrower page gutter.

**Architecture:** Additive CSS media queries + ~35 lines of JS in the existing `js/main.js` module + overlay markup in `index.html`. Desktop (>740px) stays pixel-identical. Spec: `docs/superpowers/specs/2026-06-04-mobile-responsive-design.md`.

**Tech Stack:** Vanilla CSS/JS, no dependencies. Repo: `/Users/abs.sh/Desktop/CODE/personal/absieee.github.io`, branch `main` (commits directly to main by convention). No test suite — explicit verification commands per task. Do NOT push until Task 3.

**Commit rule (user's global config):** never add `Co-Authored-By` or any "Generated with" attribution.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `index.html` | Modify | ☰ button in header, overlay markup after header |
| `css/main.css` | Modify | Overlay styles + ≤740/640/480px refinements |
| `js/main.js` | Modify | Menu open/close logic + carousel swipe |

---

### Task 1: Hamburger overlay navigation

**Files:**
- Modify: `index.html` (header block, lines ~17–30)
- Modify: `css/main.css` (nav section, after the existing `@media (max-width: 740px)` rule at ~line 75)
- Modify: `js/main.js` (append a `// --- Mobile menu ---` section at the end)

- [ ] **Step 1: index.html — add ☰ button and overlay**

In the header `<nav class="top">`, directly after the theme toggle button line:
```html
      <button class="toggle" id="themeBtn" aria-label="Toggle theme" title="Toggle light / dark">◐</button>
```
add:
```html
      <button class="toggle menu-btn" id="menuBtn" aria-label="Open menu" aria-expanded="false">☰</button>
```

Directly after the closing `</header>` tag, insert:
```html
<div class="mobile-menu" id="mobileMenu" role="dialog" aria-label="Navigation" hidden>
  <div class="wrap mobile-menu-head">
    <a class="brand" href="#top"><b>ABHI</b></a>
    <button class="toggle" id="menuClose" aria-label="Close menu">✕</button>
  </div>
  <nav class="mobile-menu-links">
    <a href="#about">about</a>
    <a href="#work">work</a>
    <a href="#experience">career</a>
    <a href="#words">praise</a>
    <a href="#writing">writing</a>
    <a class="cta" href="#contact">contact →</a>
  </nav>
</div>
```

- [ ] **Step 2: css/main.css — overlay styles**

The existing rule at ~line 75 is:
```css
@media (max-width: 740px) { nav.top a:not(.cta) { display: none; } }
```
Replace it with:
```css
.menu-btn { display: none; }
@media (max-width: 740px) {
  nav.top a { display: none; }
  .menu-btn { display: inline-grid; }
}

/* ---- mobile menu overlay ---- */
.mobile-menu {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: var(--bg);
  display: flex;
  flex-direction: column;
}
.mobile-menu[hidden] { display: none; }
.mobile-menu-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  width: 100%;
}
.mobile-menu-links { display: flex; flex-direction: column; padding: 18px 28px; }
.mobile-menu-links a {
  font-family: var(--font-mono);
  font-size: var(--step-1);
  font-weight: 500;
  color: var(--text);
  text-decoration: none;
  padding: 14px 0;
  min-height: 48px;
  display: flex;
  align-items: center;
  border-top: 1px solid var(--border);
}
.mobile-menu-links a:first-child { border-top: none; }
.mobile-menu-links a::before { content: "$ "; color: var(--accent); font-weight: 600; margin-right: 8px; }
.mobile-menu-links a.cta { color: var(--accent); font-weight: 700; }
body.menu-open { overflow: hidden; }
```
Note: the old rule's `:not(.cta)` exception goes away — on phones the `.cta` header link hides too; the overlay carries contact.

- [ ] **Step 3: js/main.js — menu logic**

Append at the end of the file:
```js
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
```

- [ ] **Step 4: Verify**

```bash
cd /Users/abs.sh/Desktop/CODE/personal/absieee.github.io
cp js/main.js /tmp/main-check.mjs && node --check /tmp/main-check.mjs && echo "js OK"
python3 -m http.server 8770 &
sleep 1
/usr/bin/curl -s http://localhost:8770/index.html | grep -c 'menuBtn\|mobileMenu\|menuClose'
pkill -f "http.server 8770"
```
Expected: `js OK`, then `3` (button, overlay, close all present).

- [ ] **Step 5: Commit**

```bash
git add index.html css/main.css js/main.js
git commit -m "add mobile hamburger menu with terminal-style overlay"
```

---

### Task 2: Section refinements + carousel swipe

**Files:**
- Modify: `css/main.css` (metrics ~line 205, work ~line 274, carousel ~line 393, wrap ~line 12)
- Modify: `js/main.js` (inside the carousel block, after the prev/next listeners at ~line 54)

- [ ] **Step 1: css/main.css — metrics ≤480px**

After the existing rule:
```css
@media (max-width: 760px) {
  .metrics { grid-template-columns: 1fr 1fr; }
  .metric:nth-child(3) { border-left: none; }
}
```
add:
```css
@media (max-width: 480px) {
  .metric { padding: 14px 16px; }
  .metric .big { font-size: var(--step-1); }
  .metric .cap { line-height: 1.45; }
}
```

- [ ] **Step 2: css/main.css — work cards ≤640px**

The existing rule:
```css
@media (max-width: 640px) {
  .case { grid-template-columns: auto 1fr; }
  .case .arrow { display: none; }
}
```
becomes:
```css
@media (max-width: 640px) {
  .case { grid-template-columns: auto 1fr; padding: 18px 16px; gap: 14px; }
  .case .arrow { display: none; }
}
```

- [ ] **Step 3: css/main.css — carousel + pull quote ≤640px**

After the existing rule:
```css
@media (max-width: 820px) {
  .carousel-prev { left: 0; }
  .carousel-next { right: 0; }
  .carousel-track-wrap { padding: 0 44px; }
}
```
add:
```css
@media (max-width: 640px) {
  .carousel-btn { display: none; }
  .carousel-track-wrap { padding: 0; }
  .pull blockquote { font-size: var(--step-2); }
}
```
Also add `touch-action: pan-y;` to the existing `.carousel-track-wrap` base rule (~line 333).

- [ ] **Step 4: css/main.css — page gutter ≤480px**

After the `.wrap` base rule (`.wrap { max-width: var(--maxw); margin: 0 auto; padding: 0 28px; }`, ~line 12) add:
```css
@media (max-width: 480px) { .wrap { padding: 0 20px; } }
```

- [ ] **Step 5: js/main.js — carousel swipe**

Inside the `if (rest.length > 0) {` block, directly after the line:
```js
  carousel.querySelector('.carousel-next').addEventListener('click', () => goTo(current + 1));
```
insert:
```js
  const wrap = carousel.querySelector('.carousel-track-wrap');
  let startX = null;
  wrap.addEventListener('pointerdown', (e) => { startX = e.clientX; });
  wrap.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
    startX = null;
  });
  wrap.addEventListener('pointercancel', () => { startX = null; });
```

- [ ] **Step 6: Verify**

```bash
cd /Users/abs.sh/Desktop/CODE/personal/absieee.github.io
cp js/main.js /tmp/main-check2.mjs && node --check /tmp/main-check2.mjs && echo "js OK"
grep -c "max-width: 480px" css/main.css
grep -c "touch-action: pan-y" css/main.css
```
Expected: `js OK`, `2` (metrics + wrap rules), `1`.

- [ ] **Step 7: Commit**

```bash
git add css/main.css js/main.js
git commit -m "mobile: compress metrics and work cards, swipeable carousel, narrower gutter"
```

---

### Task 3: Gate, manual check, push

**Files:** none

- [ ] **Step 1: Run the Lighthouse gate locally**

```bash
cd /Users/abs.sh/Desktop/CODE/personal/absieee.github.io
npx --yes @lhci/cli@0.14.x autorun
```
Expected: PASS — performance ≥0.7, accessibility ≥0.9 (must still be 1.0 — the gate runs mobile emulation, so the new menu button/overlay are audited), best-practices/seo ≥0.9. If accessibility dropped, the overlay ARIA is wrong — STOP and report the failing audits verbatim. Then `rm -rf .lighthouseci`.

- [ ] **Step 2: Horizontal-overflow check at 375px**

```bash
python3 -m http.server 8771 &
sleep 1
/usr/bin/curl -s http://localhost:8771/ > /dev/null && echo "serving"
pkill -f "http.server 8771"
```
(Full visual confirmation happens in the controller's companion browser — the implementing agent only confirms the site serves.)

- [ ] **Step 3: Push and watch CI**

```bash
git push origin main
gh run watch $(gh run list --workflow=lighthouse.yml --limit 1 --json databaseId --jq '.[0].databaseId') --exit-status
```
Expected: conclusion `success`. If it fails, `gh run view --log-failed`, report verbatim, STOP.
