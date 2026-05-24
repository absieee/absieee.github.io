# Terminal Site Design

**Date:** 2026-05-24  
**Branch:** `terminal`  
**Status:** Approved

## Goal

Replace the current newspaper-style `index.html` with a terminal-style personal site inspired by LiveTerm. The current site stays live on `main` and is not touched until the new version is approved and ready to ship.

## Theme — Bun-style

| Token | Value |
|---|---|
| Background | `#0a0a0a` |
| Text (output) | `#a3a3a3` |
| Text (strong) | `#f5f5f5` |
| Prompt `$` | `#525252` |
| Accent / links | `#fb923c` (orange) |
| Dimmed / meta | `#404040` |
| Gradient (name) | `#fb923c → #f43f5e → #a855f7` |
| Font | `'SF Mono', 'Fira Code', 'Cascadia Code', monospace` |
| Font size | `13px` |
| Line height | `1.75` |

The orange gradient on the name is the centrepiece. Everything else is deliberately quiet so it pops.

## Architecture

- Single `index.html` file, vanilla HTML/CSS/JS
- Zero dependencies, zero build step
- Deploys to GitHub Pages identically to the current site
- Branch: `terminal` — `main` is untouched until merge

## Page Structure

Full-viewport terminal. No scrollbars on the body — the terminal div itself scrolls. Input is pinned to the bottom.

```
┌─ viewport ───────────────────────────────────────┐
│  #terminal                                        │
│  ├── #output   (scrollable, flex-col)             │
│  │   ├── .sumfetch  (renders on load)             │
│  │   └── .entry*   (command + response pairs)     │
│  └── #input-line                                  │
│      ├── .prompt  "$"                             │
│      ├── #input   (text input, always focused)    │
│      └── .cursor  (hidden when input focused)     │
└───────────────────────────────────────────────────┘
```

## Sumfetch Block (on load)

Renders automatically on page load — no command required. Visitor gets name, role, location, and blog link before touching the keyboard.

```
ABHI  (block ASCII, orange)     absieee
                                 absieee@github.io
                                 ──────────────────────
                                 role     : Product Manager
                                 based    : Swindon, UK
                                 building : absieee.github.io/blog
                                 contact  : abs_sh@hotmail.co.uk
                                 ──────────────────────
                                 type 'help' to see all commands
```

ASCII art: `ABHI` rendered in a standard block font (box-drawing chars). Orange (`#fb923c`).

## Commands

All commands are plain JS functions that return an HTML string rendered into `#output`.

| Command | Output |
|---|---|
| `help` | Grid of all available commands with one-line descriptions |
| `about` | Bio paragraph; pointers to `work` and `blog` at the end |
| `blog` | Fetches `https://absieee.github.io/blog/feed.xml`, renders up to 3 posts as clickable links with dates; graceful fallback if fetch fails |
| `work` | PM skills and day-to-day breakdown (product strategy, technical depth, communication) |
| `interests` | Tennis, other interests — written with personality |
| `socials` | GitHub, X, Instagram, LinkedIn as `→ label  url` clickable lines |
| `email` | Opens `mailto:abs_sh@hotmail.co.uk`; prints confirmation |
| `clear` | Clears `#output`, re-renders sumfetch |

Unknown input prints: `command not found: <input> — type 'help' for available commands`

## Terminal Behaviour

- **Focus:** `#input` gains focus on page load and on any click anywhere on the terminal
- **History:** ↑ / ↓ arrows cycle through command history (session-only, no persistence needed)
- **Tab completion:** Tab autocompletes if input matches exactly one command name; does nothing if ambiguous
- **Enter:** Runs command, appends `$ <cmd>` + response as a new `.entry` block, scrolls to bottom
- **Ctrl+L:** Alias for `clear`
- **Mobile:** Input is still functional; sumfetch stacks vertically (ASCII art hidden below 480px to avoid wrapping)

## Links

All links open in `_blank` with `rel="noreferrer"`. Orange (`#fb923c`) with a subtle underline on hover.

## Social handles

| Platform | Handle / URL |
|---|---|
| GitHub | github.com/absieee |
| LinkedIn | linkedin.com/in/abssh |
| Instagram | instagram.com/theproductjesus |

## Blog RSS

Feed URL: `https://absieee.github.io/blog/feed.xml`  
Parse `<entry>` elements (Atom format). Show title, link, published date. Cap at 3 posts. On network error, show: `couldn't fetch feed — visit absieee.github.io/blog directly`.

## Branch & Deploy

1. Create branch `terminal` off `main`
2. Build the new `index.html` on `terminal`
3. Current `main` (newspaper site) stays live throughout
4. Merge to `main` only when Abhishek approves the live result
