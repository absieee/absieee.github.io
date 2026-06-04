# Lighthouse CI + Repo Hygiene + Page Table Stakes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Lighthouse CI quality gate on pushes to main, untrack committed scratch files, add 404/OG/robots/sitemap page essentials, and rewrite the outdated README.

**Architecture:** Zero-dependency static site on GitHub Pages stays unchanged. CI uses Google's official `@lhci/cli` via `npx` (no `package.json` in repo). `lighthouserc.json` doubles as local + CI config. Spec: `docs/superpowers/specs/2026-06-04-lighthouse-and-hygiene-design.md`.

**Tech Stack:** GitHub Actions, `@lhci/cli@0.14.x`, plain HTML/XML/txt files.

**Repo:** `/Users/abs.sh/Desktop/CODE/personal/absieee.github.io`, branch `main` (this repo commits directly to main by convention). There is no test suite — each task has explicit verification commands instead. Do NOT push until Task 5.

**Commit message rule (user's global config):** never add `Co-Authored-By` or any "Generated with Claude Code" attribution.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `.gitignore` | Modify | Add trailing newline |
| (10 tracked `.superpowers/**` files) | Untrack | Remove scratch artifacts from git index |
| `lighthouserc.json` | Create | LHCI collect/assert/upload config (CI + local) |
| `.github/workflows/lighthouse.yml` | Create | Quality-gate workflow on push to main |
| `404.html` | Create | Styled not-found page (root-absolute asset paths) |
| `index.html` | Modify | OG + Twitter meta in `<head>` |
| `robots.txt` | Create | Allow all, point to sitemap |
| `sitemap.xml` | Create | Single-URL sitemap |
| `README.md` | Rewrite | Structure map, correct local preview, deploy, CI docs |

---

### Task 1: Repo hygiene

**Files:**
- Modify: `.gitignore` (missing trailing newline)
- Untrack: everything under `.superpowers/` (10 files committed before `.gitignore` covered them)

- [ ] **Step 1: Untrack scratch files**

```bash
cd /Users/abs.sh/Desktop/CODE/personal/absieee.github.io
git rm -r --cached .superpowers
```

Expected: 10 `rm '.superpowers/...'` lines. Files stay on disk (`--cached`), only the index entries go.

- [ ] **Step 2: Add trailing newline to .gitignore**

Current `.gitignore` content ends with `website-artifacts.zip` and no final newline. Rewrite the file as exactly:

```
.DS_Store
design/
.superpowers/
website-artifacts.zip
```

(with a trailing newline at the end).

- [ ] **Step 3: Verify**

```bash
git ls-files | grep -c "^\.superpowers" || echo "0 tracked - OK"
tail -c 1 .gitignore | xxd | grep 0a && echo "newline OK"
```

Expected: `0 tracked - OK` and `newline OK`.

- [ ] **Step 4: Commit**

```bash
git add .gitignore .superpowers
git commit -m "untrack .superpowers scratch files, fix .gitignore newline"
```

Note: `git add .superpowers` here stages the *deletions* recorded by `git rm --cached`. Verify with `git status` before committing: it must show only `deleted:` entries for `.superpowers/**` and `modified: .gitignore` — nothing else.

---

### Task 2: Lighthouse CI config + workflow

**Files:**
- Create: `lighthouserc.json`
- Create: `.github/workflows/lighthouse.yml`

- [ ] **Step 1: Write lighthouserc.json** (repo root)

```json
{
  "ci": {
    "collect": {
      "staticDistDir": ".",
      "url": ["http://localhost/index.html"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

Notes: `staticDistDir: "."` makes LHCI serve the repo root on a random port and substitute it into the `localhost` URL automatically. `numberOfRuns: 3` → median run is asserted.

- [ ] **Step 2: Write .github/workflows/lighthouse.yml**

```yaml
name: Lighthouse CI

on:
  push:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 'lts/*'
      - name: Run Lighthouse CI
        run: npx --yes @lhci/cli@0.14.x autorun
```

- [ ] **Step 3: Run LHCI locally to verify the site clears the gate**

```bash
cd /Users/abs.sh/Desktop/CODE/personal/absieee.github.io
npx --yes @lhci/cli@0.14.x autorun
```

Expected: 3 runs collect, then `✅ Passed all assertions` (or similar all-green assert output), exit code 0. Requires Chrome locally (installed on this Mac). If any category fails locally, STOP and report the failing audits — do not loosen thresholds without asking.

Note: this runs Lighthouse against the *current* working tree, which is the point — catch failures before CI. The run creates a `.lighthouseci/` scratch directory; remove it and do not commit it:

```bash
rm -rf .lighthouseci
```

- [ ] **Step 4: Verify YAML/JSON syntax**

```bash
python3 -c "import json; json.load(open('lighthouserc.json')); print('json OK')"
python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/lighthouse.yml')); print('yaml OK')" 2>/dev/null || npx --yes js-yaml .github/workflows/lighthouse.yml > /dev/null && echo "yaml OK"
```

Expected: `json OK` and `yaml OK`.

- [ ] **Step 5: Commit**

```bash
git add lighthouserc.json .github/workflows/lighthouse.yml
git commit -m "add Lighthouse CI quality gate on pushes to main"
```

---

### Task 3: Page table stakes (404, OG meta, robots, sitemap)

**Files:**
- Create: `404.html`
- Modify: `index.html` (insert after line 8, the `<meta name="description">` line)
- Create: `robots.txt`
- Create: `sitemap.xml`

- [ ] **Step 1: Create 404.html**

GitHub Pages serves this file's content at ANY unknown path (e.g. `/foo/bar/baz`), so all asset hrefs MUST be root-absolute (`/css/...`), never relative. It reuses the site's terminal-card aesthetic and existing CSS classes; no JS (the theme toggle and renderers live in js/main.js which expects index.html's DOM, so it is deliberately not loaded here).

```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>404 — Abhishek Sharma</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta name="robots" content="noindex">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Schibsted+Grotesk:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/tokens.css">
<link rel="stylesheet" href="/css/main.css">
</head>
<body>

<header class="bar">
  <div class="wrap">
    <a class="brand" href="/"><b>ABHI</b></a>
  </div>
</header>

<main>
  <section class="hero">
    <div class="wrap">
      <div class="term-card">
        <div class="term-head">
          <span class="lights"><i></i><i></i><i></i></span>
          <span class="ttl">abhi@swindon: ~ %</span>
        </div>
        <div class="term-body">
          <div class="kicker"><span class="pill">404</span> no such file or directory</div>
          <h1 class="headline">This page doesn't <em>exist.</em></h1>
          <p class="sub">The link is broken, moved, or never was.</p>
          <div class="cta-row">
            <a class="btn primary" href="/">← Back to the homepage</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>

</body>
</html>
```

- [ ] **Step 2: Add OG + Twitter meta to index.html**

In `index.html`, directly after line 8 (`<meta name="description" ...>`), insert:

```html
<meta property="og:title" content="Abhishek Sharma — Product Manager">
<meta property="og:description" content="Abhishek Sharma — product manager, builder, writer. Commercial operator who still gets close to the work.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://absieee.github.io/">
<meta property="og:image" content="https://absieee.github.io/images/photo.jpg">
<meta name="twitter:card" content="summary">
```

(`summary`, not `summary_large_image` — the photo is a portrait, not a banner.)

- [ ] **Step 3: Create robots.txt**

```
User-agent: *
Allow: /

Sitemap: https://absieee.github.io/sitemap.xml
```

- [ ] **Step 4: Create sitemap.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://absieee.github.io/</loc>
  </url>
</urlset>
```

- [ ] **Step 5: Verify**

```bash
cd /Users/abs.sh/Desktop/CODE/personal/absieee.github.io
python3 -c "import xml.dom.minidom as m; m.parse('sitemap.xml'); print('sitemap OK')"
python3 -m http.server 8767 &
sleep 1
/usr/bin/curl -s -o /dev/null -w "404.html: %{http_code}\n" http://localhost:8767/404.html
/usr/bin/curl -s -o /dev/null -w "robots: %{http_code}\n" http://localhost:8767/robots.txt
/usr/bin/curl -s http://localhost:8767/index.html | grep -c "og:" 
pkill -f "http.server 8767"
```

Expected: `sitemap OK`, two `200`s, and `5` (five `og:` meta tags).

Also confirm 404.html's CSS classes exist:
```bash
for c in bar wrap brand term-card term-head term-body kicker pill headline sub cta-row btn lights ttl; do grep -q "\.$c" css/main.css || echo "MISSING: .$c"; done
```
Expected: no output (all classes present).

- [ ] **Step 6: Commit**

```bash
git add 404.html index.html robots.txt sitemap.xml
git commit -m "add 404 page, OG/Twitter meta, robots.txt, sitemap"
```

---

### Task 4: README rewrite

**Files:**
- Rewrite: `README.md`

- [ ] **Step 1: Replace README.md content entirely with:**

````markdown
# absieee.github.io

Personal site for [Abhishek Sharma](https://absieee.github.io) — product manager, builder, writer.

A zero-dependency static site: no build step, no framework, no npm. GitHub Pages serves the repo root directly.

## Structure

```
index.html      markup only
404.html        not-found page (served by GitHub Pages at unknown paths)
css/
  tokens.css    design tokens (colours, type scale, spacing)
  main.css      all styles
js/
  main.js       all behaviour (ES module): rendering, theme toggle, blog feed
data/
  work.js       case studies        ─┐
  experience.js career timeline      ├─ ES module data files
  testimonials.js quotes            ─┘
images/         photos
docs/           design specs and implementation plans
.github/        CI workflows
```

## Local preview

ES modules don't load over `file://`, so opening `index.html` directly shows empty sections. Serve the directory instead:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy

Push to `main`. GitHub Pages publishes the repo root — there is nothing to build.

## CI

Every push to `main` runs a [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) quality gate (`.github/workflows/lighthouse.yml`): performance, accessibility, best practices, and SEO must each score ≥ 90 (median of 3 runs) or the workflow fails.

Run the same check locally:

```bash
npx @lhci/cli autorun
```
````

- [ ] **Step 2: Verify the structure map matches reality**

```bash
cd /Users/abs.sh/Desktop/CODE/personal/absieee.github.io
ls index.html 404.html css/tokens.css css/main.css js/main.js data/work.js data/experience.js data/testimonials.js robots.txt sitemap.xml .github/workflows/lighthouse.yml
```

Expected: all paths listed, no "No such file" errors. (If any are missing, an earlier task wasn't completed — STOP and report.)

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "rewrite README: structure, local preview via http server, CI docs"
```

---

### Task 5: Push and verify CI

**Files:** none (push + observe)

- [ ] **Step 1: Push**

```bash
cd /Users/abs.sh/Desktop/CODE/personal/absieee.github.io
git push origin main
```

- [ ] **Step 2: Watch the Lighthouse workflow**

```bash
gh run list --workflow=lighthouse.yml --limit 1
gh run watch $(gh run list --workflow=lighthouse.yml --limit 1 --json databaseId --jq '.[0].databaseId') --exit-status
```

Expected: run completes with conclusion `success`. If it fails, fetch the log (`gh run view --log-failed`), report the failing audits/assertions verbatim, and STOP — do not loosen thresholds or re-push without guidance.

- [ ] **Step 3: Spot-check the live site (Pages deploy may take ~1 min)**

```bash
sleep 60
/usr/bin/curl -s -o /dev/null -w "404 page: %{http_code}\n" https://absieee.github.io/this-page-does-not-exist
/usr/bin/curl -s https://absieee.github.io/ | grep -c "og:"
/usr/bin/curl -s -o /dev/null -w "robots: %{http_code}\n" https://absieee.github.io/robots.txt
/usr/bin/curl -s -o /dev/null -w "scratch gone: %{http_code}\n" https://absieee.github.io/.superpowers/brainstorm/32836-1779658358/content/theme.html
```

Expected: `404 page: 404` (correct status, styled body), `5`, `robots: 200`, `scratch gone: 404`. If the Pages deploy hasn't propagated yet, wait and retry once before reporting a failure.
