# Terminal Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Bun-style terminal personal site as a single `index.html` on a `terminal` branch, keeping `main` (the newspaper site) completely untouched until approved.

**Architecture:** Single `index.html` — all HTML, CSS, and JS inline. No dependencies, no build step, deploys to GitHub Pages identically to the current site. Terminal is full-viewport with a scrollable output area and a pinned input line. All commands are plain JS functions returning HTML strings.

**Tech Stack:** Vanilla HTML5, CSS3, JavaScript (ES2020). No libraries. No build tooling.

---

## File Structure

| File | Action | Purpose |
|---|---|---|
| `index.html` | Create | The entire site — structure, styles, and behaviour in one file |

---

### Task 1: Create `terminal` branch and HTML skeleton

**Files:**
- Create: `index.html`

- [ ] **Step 1: Create the branch**

```bash
git checkout -b terminal
```

Expected: `Switched to a new branch 'terminal'`

- [ ] **Step 2: Create `index.html` with the full skeleton**

Create `index.html` with this exact content — this is the complete structural scaffold everything else builds on:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>absieee</title>
  <meta name="description" content="Abhishek Sharma — Product Manager, builder, tennis menace.">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <style>
    /* styles go here in Task 2 */
  </style>
</head>
<body>
  <div id="terminal">
    <div id="output"></div>
    <div id="input-line">
      <span class="prompt">$</span>
      <input id="input" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-label="terminal input">
    </div>
  </div>
  <script>
    // JS goes here in later tasks
  </script>
</body>
</html>
```

- [ ] **Step 3: Open in browser and verify structure exists**

Open `index.html` in a browser (double-click or `open index.html`). You should see a blank page. Open DevTools → Elements and confirm `#terminal`, `#output`, and `#input-line` exist in the DOM.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Add terminal site skeleton"
```

---

### Task 2: CSS — layout and Bun theme

**Files:**
- Modify: `index.html` (inside `<style>`)

- [ ] **Step 1: Replace the `/* styles go here */` comment with the full CSS**

```css
/* ── Reset & base ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:       #0a0a0a;
  --text:     #a3a3a3;
  --strong:   #f5f5f5;
  --prompt:   #525252;
  --accent:   #fb923c;
  --dimmed:   #404040;
  --sep:      #2a2a2a;
  --font:     'SF Mono', 'Fira Code', 'Cascadia Code', 'Courier New', monospace;
}

html, body {
  height: 100%;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font);
  font-size: 13px;
  line-height: 1.75;
  -webkit-font-smoothing: antialiased;
}

/* ── Terminal wrapper ── */
#terminal {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 860px;
  margin: 0 auto;
  padding: 32px 28px 20px;
}

/* ── Output area ── */
#output {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 12px;
}

#output::-webkit-scrollbar { width: 4px; }
#output::-webkit-scrollbar-track { background: transparent; }
#output::-webkit-scrollbar-thumb { background: var(--sep); border-radius: 2px; }

/* ── Entry blocks (command + response) ── */
.entry { margin-bottom: 16px; }

.entry-cmd {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--strong);
  font-weight: 500;
  margin-bottom: 4px;
}

.entry-cmd .prompt { color: var(--prompt); }

.entry-response {
  padding-left: 20px;
  color: var(--text);
}

/* ── Input line ── */
#input-line {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 8px;
  border-top: 1px solid var(--sep);
  flex-shrink: 0;
}

#input-line .prompt { color: var(--prompt); }

#input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--strong);
  font-family: var(--font);
  font-size: 13px;
  line-height: 1.75;
  caret-color: var(--accent);
}

/* ── Links ── */
a {
  color: var(--accent);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.15s;
}
a:hover { border-bottom-color: var(--accent); }

/* ── Sumfetch ── */
.sumfetch {
  display: flex;
  gap: 32px;
  margin-bottom: 24px;
}

.sumfetch-ascii {
  color: var(--accent);
  line-height: 1.2;
  font-size: 11px;
  flex-shrink: 0;
}

.sumfetch-info { flex: 1; }

.sumfetch-name {
  background: linear-gradient(90deg, #fb923c, #f43f5e, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  font-size: 15px;
  margin-bottom: 1px;
}

.sumfetch-host { color: var(--dimmed); margin-bottom: 6px; }

.sumfetch-sep { color: var(--sep); margin: 4px 0; }

.sumfetch-row { display: flex; gap: 0; }
.sumfetch-key { color: #a855f7; min-width: 76px; }
.sumfetch-colon { color: var(--dimmed); margin-right: 8px; }
.sumfetch-val { color: var(--strong); }

.sumfetch-hint { color: var(--prompt); margin-top: 6px; font-size: 12px; }
.sumfetch-hint span { color: var(--text); }

/* ── Help grid ── */
.help-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 4px 16px;
}

.help-row { display: flex; gap: 8px; }
.help-cmd { color: var(--accent); min-width: 80px; }
.help-desc { color: var(--text); }

/* ── Socials list ── */
.social-row {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 4px;
}

.social-platform { color: var(--prompt); min-width: 72px; }

/* ── Blog entries ── */
.blog-row { margin-bottom: 6px; }
.blog-num { color: var(--prompt); margin-right: 8px; }
.blog-date { color: var(--dimmed); margin-left: 8px; font-size: 12px; }
.blog-footer { color: var(--dimmed); margin-top: 8px; font-size: 12px; }

/* ── Error text ── */
.err { color: #f43f5e; }

/* ── Mobile ── */
@media (max-width: 480px) {
  #terminal { padding: 20px 16px 16px; }
  .sumfetch { flex-direction: column; gap: 16px; }
  .sumfetch-ascii { display: none; }
}
```

- [ ] **Step 2: Reload in browser**

Hard-reload `index.html`. The page should now be pure black (`#0a0a0a`). The input at the bottom should be visible. There's nothing else yet — that's correct.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Add terminal layout and Bun theme CSS"
```

---

### Task 3: Sumfetch block

**Files:**
- Modify: `index.html` (inside `<script>`)

- [ ] **Step 1: Add the `renderSumfetch` function inside `<script>`**

```js
const ABHI_ASCII =
`█████╗ ██████╗ ██╗  ██╗██╗
██╔══██╗██╔══██╗██║  ██║██║
███████║██████╔╝███████║██║
██╔══██║██╔══██╗██╔══██║██║
██║  ██║██████╔╝██║  ██║██║
╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝`;

function renderSumfetch() {
  const asciiLines = ABHI_ASCII.split('\n').map(l => `<div>${l}</div>`).join('');
  return `
    <div class="sumfetch">
      <pre class="sumfetch-ascii">${asciiLines}</pre>
      <div class="sumfetch-info">
        <div class="sumfetch-name">absieee</div>
        <div class="sumfetch-host">absieee@github.io</div>
        <div class="sumfetch-sep">──────────────────────</div>
        <div class="sumfetch-row">
          <span class="sumfetch-key">role</span>
          <span class="sumfetch-colon">:</span>
          <span class="sumfetch-val">Product Manager</span>
        </div>
        <div class="sumfetch-row">
          <span class="sumfetch-key">based</span>
          <span class="sumfetch-colon">:</span>
          <span class="sumfetch-val">Swindon, UK</span>
        </div>
        <div class="sumfetch-row">
          <span class="sumfetch-key">building</span>
          <span class="sumfetch-colon">:</span>
          <span class="sumfetch-val"><a href="https://absieee.github.io/blog/" target="_blank" rel="noreferrer">absieee.github.io/blog</a></span>
        </div>
        <div class="sumfetch-row">
          <span class="sumfetch-key">contact</span>
          <span class="sumfetch-colon">:</span>
          <span class="sumfetch-val"><a href="mailto:abs_sh@hotmail.co.uk">abs_sh@hotmail.co.uk</a></span>
        </div>
        <div class="sumfetch-sep">──────────────────────</div>
        <div class="sumfetch-hint">type <span>'help'</span> to see all commands</div>
      </div>
    </div>`;
}
```

- [ ] **Step 2: Call `renderSumfetch` on load — add this after the function**

```js
const output = document.getElementById('output');
output.innerHTML = renderSumfetch();
```

- [ ] **Step 3: Reload in browser and verify**

You should see the orange `ABHI` ASCII block on the left and the key-value info on the right. `absieee` should render as an orange→pink→purple gradient. The separator lines and `type 'help'` hint should be visible. Resize below 480px — the ASCII block should disappear, leaving just the info.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Add sumfetch block with ABHI ASCII art"
```

---

### Task 4: Input handling — focus, enter, history, tab, Ctrl+L

**Files:**
- Modify: `index.html` (inside `<script>`, after the sumfetch setup)

- [ ] **Step 1: Add state variables after the `output.innerHTML` line**

```js
const input = document.getElementById('input');
const history = [];
let historyIndex = -1;
```

- [ ] **Step 2: Add focus management — clicking anywhere focuses the input**

```js
document.getElementById('terminal').addEventListener('click', () => input.focus());
input.focus();
```

- [ ] **Step 3: Add the `appendEntry` helper**

This function renders a command + response pair into `#output` and scrolls to the bottom.

```js
function appendEntry(cmd, responseHtml) {
  const entry = document.createElement('div');
  entry.className = 'entry';
  entry.innerHTML = `
    <div class="entry-cmd">
      <span class="prompt">$</span>
      <span>${escapeHtml(cmd)}</span>
    </div>
    <div class="entry-response">${responseHtml}</div>`;
  output.appendChild(entry);
  output.scrollTop = output.scrollHeight;
}

function escapeHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
```

- [ ] **Step 4: Add the `runCommand` stub (will be filled in Task 5)**

```js
function runCommand(cmd) {
  const trimmed = cmd.trim().toLowerCase();
  if (!trimmed) return;
  history.unshift(trimmed);
  historyIndex = -1;
  appendEntry(trimmed, `<span class="err">command not found: ${escapeHtml(trimmed)} — type 'help' for available commands</span>`);
}
```

- [ ] **Step 5: Add the keydown listener**

```js
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const val = input.value;
    input.value = '';
    runCommand(val);
  }

  if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (historyIndex < history.length - 1) {
      historyIndex++;
      input.value = history[historyIndex];
    }
  }

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      input.value = history[historyIndex];
    } else {
      historyIndex = -1;
      input.value = '';
    }
  }

  if (e.key === 'Tab') {
    e.preventDefault();
    const val = input.value.trim().toLowerCase();
    if (!val) return;
    const COMMANDS = ['help','about','blog','work','interests','socials','email','clear'];
    const matches = COMMANDS.filter(c => c.startsWith(val));
    if (matches.length === 1) input.value = matches[0];
  }

  if (e.key === 'l' && e.ctrlKey) {
    e.preventDefault();
    runCommand('clear');
  }
});
```

- [ ] **Step 6: Reload and test each behaviour in the browser**

- Type anything and press Enter → should show `command not found: <input>` error
- Press ↑ after a command → input should fill with last command
- Press ↑ repeatedly → should cycle through history
- Press ↓ → should go forward in history; at index -1, input clears
- Type `ab` then Tab → input should complete to `about`
- Type `bl` then Tab → input should complete to `blog`
- Type `e` then Tab → should do nothing (matches `email` only — actually completes to `email`)
- Press Ctrl+L → `runCommand('clear')` is called (clear not yet implemented, shows error — that's fine)

- [ ] **Step 7: Commit**

```bash
git add index.html
git commit -m "Add terminal input handling: enter, history, tab, ctrl+l"
```

---

### Task 5: Command registry and `help` + `clear`

**Files:**
- Modify: `index.html` (inside `<script>`)

- [ ] **Step 1: Add the `COMMANDS` registry object before `runCommand`**

```js
const COMMANDS = {
  help:      cmdHelp,
  about:     cmdAbout,
  blog:      cmdBlog,
  work:      cmdWork,
  interests: cmdInterests,
  socials:   cmdSocials,
  email:     cmdEmail,
  clear:     cmdClear,
};
```

Note: these functions are forward-declared — JS hoisting handles it since they'll be `function` declarations. Define them all before `COMMANDS` to be safe (tasks 5–8 add each one).

- [ ] **Step 2: Add `cmdHelp`**

```js
function cmdHelp() {
  return `
    <div class="help-grid">
      <div class="help-row"><span class="help-cmd">help</span><span class="help-desc">list all commands</span></div>
      <div class="help-row"><span class="help-cmd">about</span><span class="help-desc">who I am</span></div>
      <div class="help-row"><span class="help-cmd">blog</span><span class="help-desc">latest posts</span></div>
      <div class="help-row"><span class="help-cmd">work</span><span class="help-desc">what I do day-to-day</span></div>
      <div class="help-row"><span class="help-cmd">interests</span><span class="help-desc">outside of work</span></div>
      <div class="help-row"><span class="help-cmd">socials</span><span class="help-desc">find me elsewhere</span></div>
      <div class="help-row"><span class="help-cmd">email</span><span class="help-desc">get in touch</span></div>
      <div class="help-row"><span class="help-cmd">clear</span><span class="help-desc">clear the terminal</span></div>
    </div>
    <div style="color:var(--dimmed); margin-top:8px; font-size:12px;">[tab] autocomplete &nbsp;·&nbsp; [↑↓] history &nbsp;·&nbsp; [ctrl+l] clear</div>`;
}
```

- [ ] **Step 3: Add `cmdClear`**

```js
function cmdClear() {
  output.innerHTML = renderSumfetch();
  return null;
}
```

- [ ] **Step 4: Add stubs for the remaining commands (will be replaced in Tasks 6–8)**

```js
function cmdAbout()     { return '<span class="err">about: coming soon</span>'; }
function cmdBlog()      { return '<span class="err">blog: coming soon</span>'; }
function cmdWork()      { return '<span class="err">work: coming soon</span>'; }
function cmdInterests() { return '<span class="err">interests: coming soon</span>'; }
function cmdSocials()   { return '<span class="err">socials: coming soon</span>'; }
function cmdEmail()     { return '<span class="err">email: coming soon</span>'; }
```

- [ ] **Step 5: Replace the `runCommand` stub with the real implementation**

```js
function runCommand(cmd) {
  const trimmed = cmd.trim().toLowerCase();
  if (!trimmed) return;
  history.unshift(trimmed);
  historyIndex = -1;

  const fn = COMMANDS[trimmed];
  if (!fn) {
    appendEntry(trimmed, `<span class="err">command not found: ${escapeHtml(trimmed)} — type 'help' for available commands</span>`);
    return;
  }

  const result = fn();
  if (result !== null) {
    appendEntry(trimmed, result);
  }
}
```

- [ ] **Step 6: Verify in browser**

- Type `help` → should show the 8-command grid with keyboard shortcuts note
- Type `clear` → terminal wipes and sumfetch re-renders
- Type `about` → shows "coming soon" error (expected)
- Type `xyz` → shows "command not found" error
- Type `hel` then Tab → completes to `help`

- [ ] **Step 7: Commit**

```bash
git add index.html
git commit -m "Add command registry, help, and clear commands"
```

---

### Task 6: `about`, `work`, and `interests` commands

**Files:**
- Modify: `index.html` (replace stubs from Task 5)

- [ ] **Step 1: Replace `cmdAbout` stub**

```js
function cmdAbout() {
  return `
    Hi — I'm Abhishek. Product Manager who likes being close to the work:<br>
    strategy, systems thinking, execution, and the occasional prototype<br>
    when words are no longer enough.<br><br>
    I sit comfortably between product and engineering — usually where<br>
    the useful conversations happen. I write clearly, think commercially,<br>
    and enjoy turning fuzzy ideas into something shippable.<br><br>
    <span style="color:var(--dimmed)">→ </span><a onclick="runCommand('work'); return false;" href="#" style="color:var(--accent)">work</a>
    <span style="color:var(--dimmed)"> for what I do day-to-day &nbsp;·&nbsp; </span>
    <a onclick="runCommand('blog'); return false;" href="#" style="color:var(--accent)">blog</a>
    <span style="color:var(--dimmed)"> for what I'm writing</span>`;
}
```

- [ ] **Step 2: Replace `cmdWork` stub**

```js
function cmdWork() {
  return `
    <div style="margin-bottom:10px;">
      <span style="color:var(--strong)">Product Strategy & Execution</span><br>
      Roadmaps rooted in user problems, clear trade-offs, practical delivery.<br>
      Strong on discovery, prioritisation, and turning intent into shipped work.
    </div>
    <div style="margin-bottom:10px;">
      <span style="color:var(--strong)">Technical Depth</span><br>
      Comfortable in architecture, API, and data conversations. Technical enough<br>
      to ask sharper questions and spot risk early. Can prototype directly.
    </div>
    <div style="margin-bottom:10px;">
      <span style="color:var(--strong)">Entrepreneurial Bias</span><br>
      Thinks with a founder's lens: speed, clarity, commercial reality.<br>
      Interested in PMF, pricing, and useful MFPs.
    </div>
    <div>
      <span style="color:var(--strong)">Communication</span><br>
      Clear writing, tidy meetings, follow-through. Status updates that don't<br>
      ruin anyone's morning.
    </div>`;
}
```

- [ ] **Step 3: Replace `cmdInterests` stub**

```js
function cmdInterests() {
  return `
    <div style="margin-bottom:10px;">
      <span style="color:var(--strong)">Tennis</span><br>
      Plays with the same energy as product work: strategic intent, occasional<br>
      flashes of brilliance, regular post-match analysis. Forehand: useful.<br>
      Backhand: improving. Serve: a live experiment. Rackets broken: 2.5.
    </div>
    <div style="margin-bottom:10px;">
      <span style="color:var(--strong)">Building things</span><br>
      Side projects, prototypes, and the occasional website built out of<br>
      stubbornness. This one included.
    </div>
    <div>
      <span style="color:var(--strong)">Reading</span><br>
      Product, systems, strategy. Anything that helps make better decisions<br>
      or tells a good story about how things actually work.
    </div>`;
}
```

- [ ] **Step 4: Verify all three in browser**

- `about` → bio paragraph with clickable `work` and `blog` links
- Clicking `work` inside the `about` response → should run the `work` command
- `work` → four sections with bold headings
- `interests` → three sections (tennis, building, reading)

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Add about, work, and interests commands"
```

---

### Task 7: `socials` and `email` commands

**Files:**
- Modify: `index.html` (replace stubs from Task 5)

- [ ] **Step 1: Replace `cmdSocials` stub**

```js
function cmdSocials() {
  return `
    <div class="social-row">
      <span class="social-platform">github</span>
      <a href="https://github.com/absieee" target="_blank" rel="noreferrer">github.com/absieee</a>
    </div>
    <div class="social-row">
      <span class="social-platform">linkedin</span>
      <a href="https://www.linkedin.com/in/abssh/" target="_blank" rel="noreferrer">linkedin.com/in/abssh</a>
    </div>
    <div class="social-row">
      <span class="social-platform">instagram</span>
      <a href="https://www.instagram.com/theproductjesus/" target="_blank" rel="noreferrer">instagram.com/theproductjesus</a>
    </div>`;
}
```

- [ ] **Step 2: Replace `cmdEmail` stub**

```js
function cmdEmail() {
  window.location.href = 'mailto:abs_sh@hotmail.co.uk';
  return `opening <a href="mailto:abs_sh@hotmail.co.uk">abs_sh@hotmail.co.uk</a>…`;
}
```

- [ ] **Step 3: Verify in browser**

- `socials` → three rows (github, linkedin, instagram) with orange clickable links
- Click each link → should open in new tab to the correct profile
- `email` → prints confirmation and opens the mail client
- Check links: GitHub → github.com/absieee, LinkedIn → linkedin.com/in/abssh, Instagram → instagram.com/theproductjesus

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Add socials and email commands"
```

---

### Task 8: `blog` command with RSS fetch

**Files:**
- Modify: `index.html` (replace `cmdBlog` stub from Task 5)

- [ ] **Step 1: Replace `cmdBlog` stub with the async version**

`cmdBlog` must be async because it fetches the RSS feed. Update `runCommand` to handle promises, then replace the stub:

First, update `runCommand` to handle async commands:

```js
function runCommand(cmd) {
  const trimmed = cmd.trim().toLowerCase();
  if (!trimmed) return;
  history.unshift(trimmed);
  historyIndex = -1;

  const fn = COMMANDS[trimmed];
  if (!fn) {
    appendEntry(trimmed, `<span class="err">command not found: ${escapeHtml(trimmed)} — type 'help' for available commands</span>`);
    return;
  }

  const result = fn();
  if (result && typeof result.then === 'function') {
    appendEntry(trimmed, '<span style="color:var(--dimmed)">fetching…</span>');
    result.then(html => {
      if (html !== null) {
        const entries = output.querySelectorAll('.entry');
        const last = entries[entries.length - 1];
        if (last) last.querySelector('.entry-response').innerHTML = html;
      }
    });
  } else if (result !== null) {
    appendEntry(trimmed, result);
  }
}
```

Then replace `cmdBlog`:

```js
async function cmdBlog() {
  try {
    const res = await fetch('https://absieee.github.io/blog/feed.xml');
    if (!res.ok) throw new Error('bad response');
    const xml = new DOMParser().parseFromString(await res.text(), 'application/xml');
    const entries = Array.from(xml.querySelectorAll('entry')).slice(0, 3);
    if (!entries.length) throw new Error('no entries');

    const rows = entries.map((entry, i) => {
      const title = entry.querySelector('title')?.textContent || 'Untitled';
      const link = entry.querySelector('link[rel="alternate"]')?.getAttribute('href')
                || entry.querySelector('link')?.getAttribute('href')
                || 'https://absieee.github.io/blog/';
      const published = entry.querySelector('published')?.textContent || '';
      const date = published
        ? new Date(published).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        : '';
      return `
        <div class="blog-row">
          <span class="blog-num">[${i + 1}]</span>
          <a href="${link}" target="_blank" rel="noreferrer">${escapeHtml(title)}</a>
          ${date ? `<span class="blog-date">· ${date}</span>` : ''}
        </div>`;
    }).join('');

    return `${rows}
      <div class="blog-footer">
        <a href="https://absieee.github.io/blog/" target="_blank" rel="noreferrer">→ absieee.github.io/blog</a>
      </div>`;
  } catch {
    return `couldn't fetch feed — <a href="https://absieee.github.io/blog/" target="_blank" rel="noreferrer">visit absieee.github.io/blog directly</a>`;
  }
}
```

- [ ] **Step 2: Verify in browser**

- Type `blog` → shows "fetching…" briefly, then replaces with post list
- Each title is a clickable orange link that opens in a new tab
- Footer link → opens blog index
- To test the error path: temporarily change the feed URL to a bad one, reload, type `blog` → should show the fallback message. Change it back after.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Add blog command with live RSS fetch"
```

---

### Task 9: Meta, title, favicon, and final polish

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Verify the `<head>` meta tags are complete**

Ensure `index.html` `<head>` contains exactly these (edit as needed):

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>absieee</title>
<meta name="description" content="Abhishek Sharma — Product Manager, builder, tennis menace.">
<meta property="og:title" content="absieee">
<meta property="og:description" content="Abhishek Sharma — Product Manager, builder, tennis menace.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://absieee.github.io">
<link rel="icon" type="image/svg+xml" href="favicon.svg">
```

- [ ] **Step 2: Smoke-test the full command set**

Open `index.html`. Run every command in order and verify:

| Command | Expected |
|---|---|
| `help` | 8-row grid + keyboard shortcuts |
| `about` | Bio + clickable `work` and `blog` links |
| `work` | 4 sections with bold headings |
| `interests` | 3 sections (tennis, building, reading) |
| `socials` | 3 rows: github, linkedin, instagram — all links open in new tab |
| `email` | Confirmation + mail client opens |
| `blog` | Post list loads (or graceful error) |
| `clear` | Screen wipes, sumfetch re-renders |
| `xyz` | "command not found" error |
| Tab on `ab` | Completes to `about` |
| ↑↑↑ | Cycles back through history |

- [ ] **Step 3: Check mobile layout**

Resize browser to 375px wide. The ASCII art should be hidden, info block fills the width. Input should be usable. Links should be tappable.

- [ ] **Step 4: Final commit**

```bash
git add index.html
git commit -m "Final polish: meta tags, smoke-tested all commands"
```

- [ ] **Step 5: Push branch**

```bash
git push -u origin terminal
```

Expected: branch pushed to remote. GitHub Pages will NOT pick this up (it tracks `main`) — the newspaper site stays live until merge.

---

## Self-Review

**Spec coverage check:**
- ✅ Bun theme tokens — Task 2
- ✅ Sumfetch with ABHI ASCII art — Task 3
- ✅ Input focus management — Task 4
- ✅ History (↑↓), tab complete, Ctrl+L — Task 4
- ✅ Command registry + unknown command error — Task 5
- ✅ `help` — Task 5
- ✅ `clear` re-renders sumfetch — Task 5
- ✅ `about` with pointers to `work` and `blog` — Task 6
- ✅ `work` — Task 6
- ✅ `interests` — Task 6
- ✅ `socials` (GitHub, LinkedIn, Instagram) — Task 7
- ✅ `email` opens mailto — Task 7
- ✅ `blog` fetches RSS, graceful fallback — Task 8
- ✅ Mobile: ASCII hidden below 480px — Task 2 (CSS)
- ✅ All links `target="_blank" rel="noreferrer"` — Tasks 3, 7, 8
- ✅ Branch `terminal`, `main` untouched — Task 1
- ✅ Meta/OG tags — Task 9

**Placeholder scan:** None — all code blocks are complete.

**Type consistency:** `renderSumfetch`, `appendEntry`, `escapeHtml`, `runCommand`, `cmdHelp`, `cmdClear`, `cmdAbout`, `cmdWork`, `cmdInterests`, `cmdSocials`, `cmdEmail`, `cmdBlog` — all referenced names match their definitions. `COMMANDS` object references match function names. `output` and `input` are defined before first use.
