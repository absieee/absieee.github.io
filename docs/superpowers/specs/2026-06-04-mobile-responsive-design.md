# Mobile Responsiveness Design

**Date:** 2026-06-04
**Status:** Approved

## Goal

Make the site genuinely phone-friendly. A 375px-width audit with the owner flagged four sections: header/navigation, metrics strip, work cards, and testimonials/carousel. Fix those; leave unflagged sections (hero, about/capabilities, timeline, writing, contact) untouched.

## Scope — five changes

### 1. Mobile navigation: hamburger → terminal-style overlay (≤740px)

Today `css/main.css` hides every nav link except `.cta` below 740px, leaving no navigation. Replace with:

- A ☰ button (`#menuBtn`, same 38×38 styling family as the theme toggle) that appears only ≤740px, sitting beside the theme toggle in the header bar. The existing `nav.top a:not(.cta) { display: none }` rule stays; the `.cta` link also hides ≤740px (the overlay carries contact instead).
- Tapping ☰ opens a full-screen overlay (`#mobileMenu`): fixed position, `background: var(--bg)`, site header row repeated at top (brand + ✕ close button), then the six links styled like terminal commands — mono font, `$ ` prefix via CSS `::before`, `$ contact →` accented — each a ≥48px-tall tap row.
- Behavior (~20 lines in `js/main.js`): open/close toggling a class; tapping any link closes it; Escape closes it; `document.body` scroll locked while open (`overflow: hidden`).
- Accessibility: button has `aria-label="Open menu"` and `aria-expanded` kept in sync; overlay has `role="dialog"` and `aria-label="Navigation"`. Lighthouse accessibility must stay 1.0.
- Desktop (>740px): nothing changes; overlay elements hidden.

### 2. Metrics strip (≤480px)

Keep the 2×2 grid from the existing 760px rule. Add a ≤480px refinement: `.metric` padding 24px/28px → 14px/16px; `.metric .big` drops one type step (`--step-2` → `--step-1`); `.metric .cap` gains `line-height: 1.45` so multi-word captions wrap cleanly.

### 3. Work cards (≤640px)

Extend the existing 640px rule: `.case` padding 24px/26px → 18px/16px and gap 22px → 14px. Chips and the two-column (idx + content) layout stay as-is. The whole card remains a single tap target.

### 4. Testimonials + carousel (≤640px)

- **Swipe:** add pointer-event-based swipe to the carousel in `js/main.js` (~15 lines): pointerdown/pointermove/pointerup on the track wrap, threshold ~40px horizontal, reuses the existing `goTo()`; vertical scrolling must not be hijacked (`touch-action: pan-y`).
- **Arrows:** hide `.carousel-prev`/`.carousel-next` ≤640px and reduce `.carousel-track-wrap` side padding (44px → 0) — dots + swipe are the phone idiom.
- **Pull quote:** `.pull blockquote` drops one type step ≤640px (`--step-3` → `--step-2`).

### 5. Page frame (≤480px)

`.wrap` horizontal padding 28px → 20px.

## What does NOT change

- No build step, no new dependencies.
- Desktop layout pixel-identical at >740px.
- Hero, about/capabilities, experience timeline, writing, contact sections untouched.
- `404.html` untouched (no nav on it).

## Verification

- Lighthouse gate stays green; accessibility must remain 1.0 (overlay ARIA correct, tap targets ≥24px).
- Manual viewport checks at 375px and 768px (companion/browser) before push: menu opens/closes, swipe works, no horizontal overflow anywhere on the page.
- `npx @lhci/cli autorun` locally before pushing.

## Risks

Low. The overlay is additive CSS/JS; the section fixes are media-query refinements. Main risk is carousel swipe interfering with vertical scroll — mitigated with `touch-action: pan-y` and a horizontal-intent threshold.
