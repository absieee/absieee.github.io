# Repo Structure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganise the static site repo by extracting inline CSS into `css/main.css`, moving `tokens.css` into `css/`, and moving data files into `data/` — no build step, no logic changes.

**Architecture:** Pure file moves and path updates. `index.html` ends up as markup-only with `<link>` and `<script>` tags pointing to the new locations. No JS logic changes. GitHub Pages continues to serve `index.html` from root.

**Tech Stack:** Static HTML/CSS/JS, GitHub Pages. No build tooling.

---

### Task 1: Create `css/` folder and extract styles

**Files:**
- Create: `css/main.css`
- Create: `css/tokens.css` (copy of root `tokens.css`)
- Modify: `index.html` (lines 11–472)

- [ ] **Step 1: Create the css directory and copy tokens.css into it**

```bash
mkdir -p css
cp tokens.css css/tokens.css
```

- [ ] **Step 2: Extract the style block from index.html into css/main.css**

Copy everything between (and NOT including) the `<style>` and `</style>` tags on lines 13 and 472 of `index.html` into a new file `css/main.css`. The file should start with the comment `/* ===== Direction 4 — Combined best-of ===== */` and end with the last CSS rule before `</style>`.

Use the Read tool to read `index.html` lines 13–472, then Write the content (excluding the `<style>` and `</style>` tags themselves) to `css/main.css`.

- [ ] **Step 3: Update the stylesheet links in index.html**

In `index.html`, replace:
```html
<link rel="stylesheet" href="tokens.css">
<style>
/* ===== Direction 4 — Combined best-of ===== */
...all CSS...
</style>
```
With:
```html
<link rel="stylesheet" href="css/tokens.css">
<link rel="stylesheet" href="css/main.css">
```

The entire `<style>...</style>` block (lines 13–472) is removed and replaced with a single `<link>` tag alongside the updated tokens link.

- [ ] **Step 4: Verify locally — styles render correctly**

```bash
python3 -m http.server 8766 --directory . &
sleep 1 && curl -s http://localhost:8766/ | grep -c "css/"
```
Expected: `2` (two css/ references in the HTML)

Also open `http://localhost:8766/` in browser and confirm the page looks identical to before.

```bash
pkill -f "http.server 8766"
```

- [ ] **Step 5: Commit**

```bash
git add css/tokens.css css/main.css index.html
git commit -m "extract inline CSS to css/main.css, move tokens.css to css/"
```

---

### Task 2: Create `data/` folder and move data files

**Files:**
- Create: `data/work.js` (move from root)
- Create: `data/experience.js` (move from root)
- Create: `data/testimonials.js` (move from root)
- Modify: `index.html` (script src attributes)

- [ ] **Step 1: Create data directory and copy files**

```bash
mkdir -p data
cp work.js data/work.js
cp experience.js data/experience.js
cp testimonials.js data/testimonials.js
```

- [ ] **Step 2: Update script src paths in index.html**

In `index.html`, find these three lines (near the bottom, just before the closing `</body>`):
```html
<script src="work.js"></script>
<script src="experience.js"></script>
<script src="testimonials.js"></script>
```

Replace with:
```html
<script src="data/work.js"></script>
<script src="data/experience.js"></script>
<script src="data/testimonials.js"></script>
```

- [ ] **Step 3: Verify locally — data renders correctly**

```bash
python3 -m http.server 8766 --directory . &
sleep 1 && curl -s http://localhost:8766/ | grep -c "data/"
```
Expected: `3` (three data/ script references)

Open `http://localhost:8766/` in browser and confirm:
- Selected work section shows 5 case cards
- Experience timeline shows 5 roles
- Testimonials section shows pull quote + cards + carousel

```bash
pkill -f "http.server 8766"
```

- [ ] **Step 4: Commit**

```bash
git add data/work.js data/experience.js data/testimonials.js index.html
git commit -m "move data files to data/"
```

---

### Task 3: Clean up root and push

**Files:**
- Delete: `tokens.css` (root copy — now at `css/tokens.css`)
- Delete: `work.js`, `experience.js`, `testimonials.js` (root copies — now at `data/`)

- [ ] **Step 1: Remove old root files**

```bash
git rm tokens.css work.js experience.js testimonials.js
```

- [ ] **Step 2: Final local verification**

```bash
python3 -m http.server 8766 --directory . &
sleep 1
curl -s -o /dev/null -w "%{http_code}" http://localhost:8766/
```
Expected: `200`

Open `http://localhost:8766/` in browser. Do a full visual check — scroll through every section. Confirm nothing is broken.

```bash
pkill -f "http.server 8766"
```

- [ ] **Step 3: Commit and push**

```bash
git commit -m "remove old root copies of css and data files"
git push origin main
```
