# PM Identity Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make PM identity land immediately on absieee.github.io by adding a role-first header and a rotating testimonials strip, without touching any existing terminal functionality.

**Architecture:** Two new HTML blocks are inserted into the existing `#terminal` div in `index.html` — a role header above `#output` and a testimonial strip below `#input-line`. Testimonials live in a standalone `testimonials.js` file loaded before the main script. The strip shuffles on load and auto-advances every 6s.

**Tech Stack:** Vanilla HTML/CSS/JS, zero dependencies, single-page, no build step.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `testimonials.js` | **Create** | Global `TESTIMONIALS` array — the only place quotes are edited |
| `index.html` | **Modify** | Add `<script src>` tag, CSS rules, two HTML blocks, JS init logic |

---

### Task 1: Create `testimonials.js`

**Files:**
- Create: `testimonials.js` (repo root, alongside `index.html`)

- [ ] **Step 1: Create the file**

```js
const TESTIMONIALS = [
  {
    quote: "The best PM I've ever worked with. His technical background makes him really know what he's doing.",
    author: "Mert Duzgun",
    role: "Engineer · Builder.ai"
  },
  {
    quote: "There is always one person steering the ship and that, my friend, is you.",
    author: "Nathan Ziabek",
    role: "Engineer · Builder.ai"
  },
  {
    quote: "You are the most talented technical project manager I have ever met. I have been working for 15 years in this industry.",
    author: "Jerry Thimothy J",
    role: "Colleague"
  },
  {
    quote: "You know a lot about what's done here, have a great attitude and get actual shit done.",
    author: "Pedro Dias",
    role: "Colleague · Builder.ai"
  },
  {
    quote: "Forward thinking and driven to deliver. Always looking to optimise and support operational roadmaps. A great asset to any company.",
    author: "Michelle Oliveira Dos Santos",
    role: "Head of Sales Ops Digital Transformation"
  },
  {
    quote: "I admire your work ethic. You find fulfilment in your work, which is something you should cherish.",
    author: "Istvan Hoka",
    role: "Colleague · Builder.ai"
  },
  {
    quote: "Best managerial skills you have. I had gone through lot of managers in my career. Never seen a person like you.",
    author: "Dharani Arun",
    role: "Colleague"
  },
  {
    quote: "Thank you for being a great PM.",
    author: "Raphael Damasceno",
    role: "Engineer · Builder.ai"
  },
  {
    quote: "I have seen him develop from a conversational analyst to a Product Owner with ease and great expertise. The projects I have worked on with him have all been extremely successful.",
    author: "Jaspreet Dhaliwal",
    role: "Reporting Lead (Global OTT) · Sky"
  },
  {
    quote: "Really great to see the progress you've made and the comfort level you have now across the Bx org!",
    author: "Rohan Patel",
    role: "Colleague · Builder.ai"
  },
];
```

- [ ] **Step 2: Verify the file is valid JS**

Run: `node -e "$(cat testimonials.js); console.log(TESTIMONIALS.length + ' quotes loaded')"`

Expected output: `10 quotes loaded`

- [ ] **Step 3: Commit**

```bash
git add testimonials.js
git commit -m "add testimonials data file"
```

---

### Task 2: Load `testimonials.js` in `index.html`

**Files:**
- Modify: `index.html:195` (after `</div>` that closes `#terminal`, before `<script>`)

Current line 195-196:
```html
  </div>
  <script>
```

- [ ] **Step 1: Add the script tag**

Replace those two lines with:
```html
  </div>
  <script src="testimonials.js"></script>
  <script>
```

- [ ] **Step 2: Verify it loads**

Open `index.html` in a browser (or `python3 -m http.server 8080` from repo root, visit `http://localhost:8080`). Open DevTools console. Type `TESTIMONIALS.length`. Expected: `10`.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "load testimonials.js before main script"
```

---

### Task 3: Add CSS for role header and testimonial strip

**Files:**
- Modify: `index.html:180-185` — add new CSS rules inside the existing `<style>` block, before the closing `@media` block

Current lines 180-185:
```css
    /* ── Mobile ── */
    @media (max-width: 480px) {
      #terminal { padding: 20px 16px 16px; }
      .sumfetch { flex-direction: column; gap: 16px; }
      .sumfetch-ascii { display: none; }
    }
```

- [ ] **Step 1: Insert CSS before the mobile media query**

Insert these rules immediately before `/* ── Mobile ── */`:

```css
    /* ── Role header ── */
    #role-header {
      padding: 18px 0 14px;
      border-bottom: 1px solid #161616;
      flex-shrink: 0;
      margin-bottom: 0;
    }

    #role-header .role-title {
      font-size: 20px;
      font-weight: 700;
      color: var(--strong);
      letter-spacing: -0.3px;
      line-height: 1.2;
    }

    #role-header .role-sub {
      font-size: 12px;
      color: var(--dimmed);
      margin-top: 2px;
    }

    /* ── Testimonial strip ── */
    #testimonial-strip {
      flex-shrink: 0;
      padding: 10px 0 14px;
      border-top: 1px solid #111;
    }

    .t-inner {
      display: flex;
      gap: 8px;
      align-items: flex-start;
    }

    .t-mark {
      color: var(--accent);
      font-size: 18px;
      line-height: 1;
      margin-top: 1px;
      opacity: 0.4;
      flex-shrink: 0;
    }

    .t-body { flex: 1; }

    .t-quote {
      font-size: 11px;
      color: #525252;
      font-style: italic;
      line-height: 1.55;
    }

    .t-author {
      font-size: 10px;
      color: #383838;
      margin-top: 3px;
    }

    .t-dots {
      display: flex;
      gap: 5px;
      align-items: center;
      margin-top: 6px;
    }

    .t-dot {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #222;
      cursor: pointer;
      transition: background 0.2s;
    }

    .t-dot.active { background: var(--accent); }
```

- [ ] **Step 2: Verify the page still renders correctly**

Open/refresh in browser. The page should look identical to before — no new elements are visible yet (HTML not added yet). No console errors.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "add css for role header and testimonial strip"
```

---

### Task 4: Add HTML blocks for role header and testimonial strip

**Files:**
- Modify: `index.html:189-194`

Current HTML inside `<body>`:
```html
  <div id="terminal">
    <div id="output"></div>
    <div id="input-line">
      <span class="prompt">$</span>
      <input id="input" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-label="terminal input">
    </div>
  </div>
```

- [ ] **Step 1: Replace the `#terminal` div contents**

```html
  <div id="terminal">
    <div id="role-header">
      <div class="role-title">Product Manager</div>
      <div class="role-sub">who still gets close to the work</div>
    </div>
    <div id="output"></div>
    <div id="input-line">
      <span class="prompt">$</span>
      <input id="input" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-label="terminal input">
    </div>
    <div id="testimonial-strip">
      <div class="t-inner">
        <div class="t-mark">"</div>
        <div class="t-body">
          <div class="t-quote" id="t-quote"></div>
          <div class="t-author" id="t-author"></div>
          <div class="t-dots" id="t-dots"></div>
        </div>
      </div>
    </div>
  </div>
```

- [ ] **Step 2: Verify in browser**

Open/refresh. You should now see:
- "Product Manager / who still gets close to the work" at the top in white/dimmed text
- The testimonial strip area at the bottom (empty text for now — JS not wired yet)
- The terminal sumfetch and input line in between, unchanged

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "add role header and testimonial strip html"
```

---

### Task 5: Add testimonial rotation JS

**Files:**
- Modify: `index.html` — add JS at the end of the existing `<script>` block, after all existing code and before the closing `</script>` tag

Find the closing `</script>` tag at the very end of the file and insert the following block immediately before it:

- [ ] **Step 1: Find the end of the script block**

Run: `grep -n "</script>" index.html`

Note the line number of the closing `</script>`.

- [ ] **Step 2: Insert the testimonial init function before `</script>`**

```js
    function initTestimonials() {
      const quotes = [...TESTIMONIALS];
      // Fisher-Yates shuffle
      for (let i = quotes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [quotes[i], quotes[j]] = [quotes[j], quotes[i]];
      }

      let current = 0;
      const quoteEl = document.getElementById('t-quote');
      const authorEl = document.getElementById('t-author');
      const dotsEl = document.getElementById('t-dots');

      // Build dots
      quotes.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 't-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => show(i));
        dotsEl.appendChild(dot);
      });

      function show(i) {
        current = i;
        quoteEl.textContent = quotes[i].quote;
        authorEl.textContent = '— ' + quotes[i].author + ', ' + quotes[i].role;
        dotsEl.querySelectorAll('.t-dot').forEach((d, j) => {
          d.classList.toggle('active', j === i);
        });
      }

      show(0);
      setInterval(() => show((current + 1) % quotes.length), 6000);
    }

    initTestimonials();
```

- [ ] **Step 3: Verify in browser**

Open/refresh. The testimonial strip should now:
- Show the first (randomly ordered) quote and attribution
- Have dot indicators at the bottom matching the number of quotes (10 dots)
- Auto-advance every 6 seconds
- Jump to the right quote when a dot is clicked

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "add testimonial shuffle and rotation logic"
```

---

### Task 6: Final verification and push

- [ ] **Step 1: Check terminal padding**

`#terminal` currently has `padding: 32px 28px 20px`. The role header and testimonial strip should inherit this horizontal padding naturally since they sit inside `#terminal`. Confirm in browser that left/right alignment matches the rest of the terminal content.

If the role header or strip looks misaligned, check that neither `#role-header` nor `#testimonial-strip` has conflicting padding. The CSS added in Task 3 uses `padding: 18px 0 14px` (zero horizontal) intentionally — horizontal padding comes from the parent `#terminal`.

- [ ] **Step 2: Check mobile**

Resize browser to under 480px. The role header should still be visible and readable. The testimonial strip should still show. The sumfetch ASCII hides (existing behaviour) but everything else stays.

- [ ] **Step 3: Push**

```bash
git push
```

Expected: branch `main` updated on GitHub, GitHub Pages deploys within ~60 seconds.
