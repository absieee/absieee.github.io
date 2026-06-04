# JS Modernisation: ES Modules Design

**Date:** 2026-06-04  
**Status:** Approved

## Goal

Extract all inline JavaScript from `index.html` into `js/main.js` and convert the codebase to native ES modules — no build step, no bundler, GitHub Pages deployment unchanged.

## Current state

```
index.html
  ├── <script src="data/work.js">        ← global var WORK
  ├── <script src="data/experience.js">  ← global var EXPERIENCE
  ├── <script src="data/testimonials.js"> ← global var TESTIMONIALS
  ├── <script> testimonials renderer + theme toggle (inline IIFE)
  ├── <script> work + experience renderer (inline IIFE)
  └── <script> blog RSS feed fetcher (inline IIFE)
```

Pain points:
- All JS logic lives inline in HTML — hard to read and edit
- Data files pollute global scope with `var` declarations
- Old-style IIFEs, `var`, string concatenation throughout

## Target state

```
index.html
  └── <script type="module" src="js/main.js">  ← single entry point

js/
  └── main.js    ← all render logic, imports data, ~120 lines

data/
  ├── work.js          ← export const WORK = [...]
  ├── experience.js    ← export const EXPERIENCE = [...]
  └── testimonials.js  ← export const TESTIMONIALS = [...]
```

## What changes

### `data/work.js`, `data/experience.js`, `data/testimonials.js`
- `var WORK = [...]` → `export const WORK = [...]`
- Same for EXPERIENCE and TESTIMONIALS
- No other changes to data content

### `js/main.js` (new file)
Contains all logic currently in the three inline script blocks:
1. **Testimonials renderer** — renderAuthor, renderQuote, cardHTML, pull quote, grid, carousel
2. **Work renderer** — work-list innerHTML
3. **Experience renderer** — experience-tl innerHTML
4. **Theme toggle** — localStorage persistence, matchMedia, button click handler
5. **Blog RSS fetch** — fetch feed.xml, parse Atom entries, render posts-list

Syntax modernisation applied throughout:
- `var` → `const` / `let`
- Old-style `function` expressions → arrow functions where appropriate
- String concatenation → template literals
- IIFEs removed (modules have their own scope)

`type="module"` scripts are deferred by default — runs after DOM is parsed, no DOMContentLoaded wrapper needed.

### `index.html`
- Remove: `<script src="data/work.js"></script>`
- Remove: `<script src="data/experience.js"></script>`
- Remove: `<script src="data/testimonials.js"></script>`
- Remove: three inline `<script>...</script>` blocks
- Add: `<script type="module" src="js/main.js"></script>`

## What does NOT change

- Site behaviour is identical in the browser
- GitHub Pages deployment unchanged — `main` branch root, no build step
- CSS files untouched
- Data content in `data/*.js` files untouched (only the `export` keyword added)
- `images/`, `design/`, `docs/` untouched

## Risk

Low. Pure refactor — no logic changes. The one behaviour difference is `type="module"` defers execution, but the scripts are already at the bottom of `<body>` so load order is equivalent. Module scope replaces IIFE scope with identical effect.

One caveat: `type="module"` requires a server to work locally (CORS restriction on `file://` protocol for module imports). The existing `python3 -m http.server` dev workflow is unaffected.
