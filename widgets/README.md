# Widgets

Standalone, drop-in copies of the site-chrome pieces built for AddFrame —
kept here so they can be pulled into future static sites without
rewriting or re-encoding anything each time. This folder is a reference
library, not part of the live AddFrame build: `index.html`/`style.css`/
`script.js` at the repo root have these features inlined already and
don't read from here.

| Widget | What it does | Config needed |
|---|---|---|
| [`theme-toggle/`](theme-toggle) | Light/dark toggle, defaults to system preference, persists choice, no flash on load | None |
| [`share-widget/`](share-widget) | Floating share button → native share sheet or a menu (X/Facebook/LinkedIn/Reddit/WhatsApp/Email/copy link) | 2 constants (URL, text) |
| [`analytics-goatcounter/`](analytics-goatcounter) | Free, cookieless pageview analytics | 1 placeholder (account slug) |
| [`buy-me-a-coffee/`](buy-me-a-coffee) | Plain link + badge image, no floating widget script | 1 placeholder (username), used twice |
| [`seo-meta/`](seo-meta) | Title/description/canonical/OG/Twitter/JSON-LD template, robots.txt, sitemap.xml, OG-image generator | Fill-in-the-blank template, not a config knob — see its own README |

## Using one in a new project

Each widget's own `README.md` says exactly which file goes where
(`<head>` vs `<body>` vs stylesheet vs script). Two widgets touch multiple
places — `theme-toggle` (4 files) and `share-widget` (3 files) — because
they need markup, styling, and behavior; the other two are one or two
files. `seo-meta` is a different kind of thing entirely: it's almost all
site-specific content rather than shared logic, so treat it as a
checklist to fill in, not a component to configure.

## Shared assumption

`share-widget` and the general button/card styles across this site lean
on a small set of CSS custom properties: `--bg`, `--surface`, `--fg`,
`--muted`, `--border`, `--accent`, `--accent-fg`, `--radius`. The
`theme-toggle` widget's `style.css` defines these (light + dark). If a
new project already has its own token system, remap instead of copying
that block wholesale — just keep the same three-tier structure (bare
`:root` → media-guarded dark → `[data-theme]` override) so the manual
toggle keeps working.

## Why these aren't wired up as includes

This is a plain static site with no build step. There's no native way to
`<include>` an HTML fragment without a runtime `fetch()` call — and for
`theme-toggle` specifically, that would reintroduce the flash-of-wrong-
theme problem the blocking inline script exists to avoid. So: copy at
project-creation time, not include at runtime. Each site stays fully
self-contained, and a bug in one doesn't propagate to (or get silently
inherited by) the others.
