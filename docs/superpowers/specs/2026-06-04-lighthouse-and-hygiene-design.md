# Lighthouse CI + Repo Hygiene + Page Table Stakes

**Date:** 2026-06-04
**Status:** Approved

## Goal

Add an automated quality gate (Lighthouse CI), clean up repo hygiene debt, fix outdated docs, and add the small production-page essentials a public personal site should have. No build step, no npm dependency in the repo, no framework — the site stays a zero-dependency static site on GitHub Pages.

## Scope — four work streams

### A. Lighthouse CI quality gate

**Trigger:** `push` to `main`.

**Files:**
- `.github/workflows/lighthouse.yml`
  - Jobs: checkout → `actions/setup-node` (LTS) → `npx @lhci/cli@0.14.x autorun`
  - No secrets required. Reports uploaded to LHCI `temporary-public-storage` so every run links a full HTML report in the job log.
- `lighthouserc.json` (repo root)
  - `staticDistDir: "."` — LHCI serves the repo root with its own static server (matches GitHub Pages semantics)
  - `url: ["http://localhost/index.html"]`
  - `numberOfRuns: 3` — median score dampens performance variance
  - Assertions: `categories:performance`, `categories:accessibility`, `categories:best-practices`, `categories:seo` — all `["error", {"minScore": 0.9}]`

**Behavior:** any push to main that drops a median category score below 90 fails the workflow with a red ✗ on the commit, names the failing audits in the log, and links the full report.

**Rationale for approach:** `@lhci/cli` directly via npx (Google's official tool) rather than a third-party wrapper action. The same `lighthouserc.json` works locally: `npx @lhci/cli autorun` on a dev machine reproduces CI exactly.

**Note:** the blog-feed `fetch` in `js/main.js` runs cross-origin from LHCI's localhost server; it either succeeds or hits the existing `.catch` fallback. Neither path affects category scores meaningfully.

### B. Repo hygiene

- Untrack the 10 committed `.superpowers/brainstorm/` scratch files (`git rm -r --cached .superpowers`). They are session artifacts (server PIDs, logs, mockup HTML) committed before `.gitignore` covered the directory, and are currently served by GitHub Pages.
- Add trailing newline to `.gitignore`.

### C. README rewrite

The current README is wrong: it says "Open `index.html` in a browser to preview locally," which broke when the site moved to native ES modules (`file://` blocks module imports). Rewrite to cover:

- One-line description of the site
- Repo structure map (`index.html`, `css/`, `js/`, `data/`, `images/`, `docs/`, `.github/`)
- Local preview: `python3 -m http.server 8000` then open `http://localhost:8000` — and a note explaining why `file://` no longer works
- Deploy: push to `main`, GitHub Pages serves repo root
- CI: Lighthouse gate, thresholds, and how to run it locally (`npx @lhci/cli autorun`)

### D. Production page table stakes

- `404.html` — minimal page reusing `css/tokens.css` + `css/main.css`, matching site look, with a link back to `/`. No JS needed.
- Open Graph + Twitter Card meta in `index.html` `<head>`:
  - `og:title`, `og:description` (reuse existing title/description copy), `og:type=website`, `og:url=https://absieee.github.io/`, `og:image` → absolute URL to `images/photo.jpg`
  - `twitter:card=summary` (square-ish portrait photo suits `summary`, not `summary_large_image`)
- `robots.txt` — allow all, point to sitemap
- `sitemap.xml` — single entry for `https://absieee.github.io/`

## What does NOT change

- No npm/`package.json` in the repo — LHCI runs via `npx` in CI only
- No JS restructuring (`js/main.js` stays one file; revisit ~250 lines)
- No HTML-escaping layer for data interpolation (author-controlled data, accepted risk)
- `design/` stays local-only and gitignored

## Implementation order

1. **B** (hygiene) — smallest, unblocks a clean baseline
2. **A** (Lighthouse) — verify locally with `npx @lhci/cli autorun` before pushing so the first CI run passes
3. **D** (table stakes) — lands before README so the README documents final state
4. **C** (README) — documents everything above

## Risks

- **Low.** Lighthouse performance score variance in CI runners is the main flake risk; mitigated by `numberOfRuns: 3` (median) and a 90 threshold with headroom (a page this light typically scores 95+).
- OG image: `photo.jpg` is a portrait, not a 1200×630 banner — link previews will render it as a thumbnail (`summary` card), which is acceptable; a dedicated banner image can be added later without structural change.

## Success criteria

- Push to main triggers Lighthouse; all four categories ≥ 90; failure blocks with a named audit
- `git ls-files | grep .superpowers` returns nothing
- README local-preview instructions work as written on a clean machine
- Sharing `https://absieee.github.io/` on LinkedIn/X shows a titled card with description and photo
- `https://absieee.github.io/nonexistent` shows the styled 404 page
