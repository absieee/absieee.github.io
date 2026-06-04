# Repo Structure Redesign

**Date:** 2026-06-04  
**Status:** Approved

## Goal

Reorganise the static site repo for maintainability without adding a build step, bundler, or npm. Keep it a zero-dependency static site deployable directly via GitHub Pages.

## Current state

```
/
├── index.html          ← 700+ lines, all CSS and JS inline
├── tokens.css
├── favicon.svg
├── experience.js
├── work.js
├── testimonials.js
├── images/
│   └── photo.jpg
├── design/             ← design handoff files (non-production)
├── docs/               ← specs and plans (non-production)
└── README.md
```

**Pain points:**
- `index.html` mixes HTML structure, all CSS, and all JS — hard to navigate and edit
- Data files (`work.js`, `experience.js`, `testimonials.js`) clutter the root alongside `index.html`
- `tokens.css` sits at root with no clear relationship to the main stylesheet

## Target structure

```
/
├── index.html          ← markup only, ~150 lines
├── favicon.svg
├── css/
│   ├── tokens.css      ← design tokens (moved from root)
│   └── main.css        ← all styles extracted from index.html
├── data/
│   ├── work.js
│   ├── experience.js
│   └── testimonials.js
├── images/
│   └── photo.jpg
├── design/             ← unchanged
├── docs/               ← unchanged
└── README.md
```

## What changes

### `index.html`
- Remove all `<style>...</style>` content → moved to `css/main.css`
- Update `<link rel="stylesheet" href="tokens.css">` → `href="css/tokens.css"`
- Add `<link rel="stylesheet" href="css/main.css">`
- Update `<script src="work.js">` → `src="data/work.js"` (×3 data files)
- Result: index.html contains only markup and inline script blocks

### `css/tokens.css`
- Move `tokens.css` from root to `css/tokens.css`

### `css/main.css`
- New file — contains all styles cut from the `<style>` block in `index.html`

### `data/`
- Move `work.js`, `experience.js`, `testimonials.js` from root to `data/`

## What does NOT change

- No build step, no npm, no bundler
- Inline `<script>` blocks in `index.html` stay inline (small, tightly coupled to DOM)
- Blog RSS fetch script stays inline
- `images/`, `design/`, `docs/` untouched
- GitHub Pages deployment unaffected (still serves `index.html` from root)

## Risk

Low. This is pure file moves + path updates. No logic changes. The site should be byte-for-byte identical in the browser after the refactor.
