# absieee.github.io

Personal site for [Abhishek Sharma](https://absieee.github.io) — product manager, builder, writer.

A zero-dependency static site: no build step, no framework, no npm. GitHub Pages serves the repo root directly.

## Structure

```
index.html      markup only
404.html        not-found page (served by GitHub Pages at unknown paths)
css/
  fonts.css     @font-face rules for the self-hosted fonts
  tokens.css    design tokens (colours, type scale, spacing)
  main.css      all styles
fonts/          self-hosted woff2 fonts (latin subsets)
js/
  main.js       all behaviour (ES module): rendering, theme toggle, blog feed
data/
  work.js       case studies
  experience.js career timeline
  testimonials.js quotes
images/         photos (1200w + 600w portrait variants)
robots.txt      crawler policy + sitemap pointer
sitemap.xml     single-URL sitemap
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

Every push to `main` runs a [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) quality gate (`.github/workflows/lighthouse.yml`): accessibility, best practices, and SEO must each score ≥ 90, and performance ≥ 70 (median of 3 runs), or the workflow fails. Thresholds live in `lighthouserc.json`.

Run the same check locally:

```bash
npx @lhci/cli autorun
```
