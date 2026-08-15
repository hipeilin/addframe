# Theme toggle

A fixed sun/moon button (top right) that switches between light and dark,
defaulting to the OS preference until the visitor overrides it. The choice
persists in `localStorage` and survives reload with no flash of the wrong
theme.

## Files

| File | Goes where |
|---|---|
| `head.html` | First thing inside `<head>`, before your stylesheet `<link>` |
| `style.css` | Your stylesheet |
| `body.html` | Right after `<body>` opens |
| `script.js` | End of `<body>`, or any script that runs after the DOM is parsed |

## Config

None — this one is fully generic. The only thing you might want to edit is
the palette hex values at the top of `style.css` (see the comment block
there). If your project already uses its own `--bg`/`--surface`/`--fg`/etc.
tokens, skip that block and just make sure the same three-tier structure
(bare `:root`, media-guarded dark, `[data-theme]` override) wraps your
existing tokens instead.

## Why the inline `<script>` in `<head>`

Reading `localStorage` and setting `data-theme` has to happen before the
browser paints anything, or you get a flash of the default theme followed
by a snap to the saved one. That's why `head.html` is a plain blocking
`<script>` (not `defer`/`async`) placed before the stylesheet — it's a few
bytes and runs before CSS is even parsed.

## Behavior notes

- First visit (no saved preference): follows `prefers-color-scheme`.
- After a click: explicit choice saved to `localStorage`, overrides system
  preference from then on (including after OS theme changes).
- The button always shows the icon for what clicking it will switch *to*
  (moon in light mode, sun in dark mode).
