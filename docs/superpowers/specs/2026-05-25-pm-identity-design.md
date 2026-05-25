# PM Identity Refresh — Design Spec

**Date:** 2026-05-25
**Status:** Approved

## Goal

Make the PM identity land immediately on absieee.github.io without requiring any interaction. The terminal stays. Two additions: a role-first header above the terminal, and a testimonial strip below the input line.

## Problem

The terminal aesthetic communicates "this person can build" before it communicates "this person is a PM." Visitors who don't type anything leave without understanding who Abhishek is professionally. The fix is additive — nothing is removed.

## Audience

Both recruiters/hiring managers (cold traffic) and peers/collaborators (warm referrals).

## Changes

### 1. Role-first header

A new non-interactive block at the top of `#terminal`, above the output area.

```
Product Manager
who still gets close to the work
```

- "Product Manager" — `font-size: 20px`, `font-weight: 700`, `color: var(--strong)` (`#f5f5f5`)
- Subtitle line — `font-size: 12px`, `color: var(--dimmed)` (`#404040`)
- Separated from the output area by a subtle bottom border (`1px solid #161616`)
- Padding: `18px 28px 14px`
- No interaction. No animation. Just text.

### 2. Testimonials strip

A fixed strip below `#input-line`, always visible, never requires interaction.

**Behaviour:**
- Quotes are loaded from `testimonials.js` (see below)
- On page load, the array is shuffled (Fisher-Yates)
- Cycles through quotes automatically every 6 seconds
- Dot indicators show current position; dots are clickable to jump to any quote
- No pause on hover — keeps moving passively

**Layout:**
```
" [quote text]
  — Name, Role · Company
  · · · · · · · · · ·   ← dot indicators
```

**Styling:**
- Quote text: `font-size: 11px`, `color: #525252`, `font-style: italic`
- Attribution: `font-size: 10px`, `color: #383838`
- Opening `"` mark: `color: var(--accent)`, `opacity: 0.5`, `font-size: 16px`
- Active dot: `var(--accent)` (`#fb923c`); inactive: `#222`
- Strip background: `var(--bg)` (`#0a0a0a`)
- Top border: `1px solid #111`
- Padding: `10px 28px 14px`

### 3. `testimonials.js` — standalone quotes file

New file in repo root. Defines a global `const TESTIMONIALS` array. Included in `index.html` via `<script src="testimonials.js"></script>` before the main `<script>` block.

**Format:**
```js
const TESTIMONIALS = [
  {
    quote: "Quote text here.",
    author: "First Last",
    role: "Job Title · Company"
  },
  // ...
];
```

**To add a new testimonial:** copy one object, paste at the end of the array, fill in the three fields.

**Initial quotes (10 total, shuffled on load):**

| Quote | Author | Role |
|---|---|---|
| "The best PM I've ever worked with. His technical background makes him really know what he's doing." | Mert Duzgun | Engineer · Builder.ai |
| "There is always one person steering the ship and that, my friend, is you." | Nathan Ziabek | Engineer · Builder.ai |
| "You are the most talented technical project manager I have ever met. I have been working for 15 years in this industry." | Jerry Thimothy J | Colleague |
| "You know a lot about what's done here, have a great attitude and get actual shit done." | Pedro Dias | Colleague · Builder.ai |
| "Forward thinking and driven to deliver. Always looking to optimise and support operational roadmaps. A great asset to any company." | Michelle Oliveira Dos Santos | Head of Sales Ops Digital Transformation |
| "I admire your work ethic. You find fulfilment in your work, which is something you should cherish." | Istvan Hoka | Colleague · Builder.ai |
| "Best managerial skills you have. I had gone through lot of managers in my career. Never seen a person like you." | Dharani Arun | Colleague |
| "Thank you for being a great PM." | Raphael Damasceno | Engineer · Builder.ai |
| "I have seen him develop from a conversational analyst to a Product Owner with ease and great expertise. The projects I have worked on with him have all been extremely successful." | Jaspreet Dhaliwal | Reporting Lead (Global OTT) · Sky |
| "Really great to see the progress you've made and the comfort level you have now across the Bx org!" | Rohan Patel | Colleague · Builder.ai |

## Architecture

- Zero new dependencies
- Single new file: `testimonials.js`
- `index.html` gets two new HTML blocks and one new `<script>` tag
- No build step changes

## Files

| File | Change |
|---|---|
| `testimonials.js` | **Create** — global `TESTIMONIALS` array |
| `index.html` | **Modify** — add role header, testimonial strip HTML + CSS, load `testimonials.js`, add shuffle + rotation JS |
