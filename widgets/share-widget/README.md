# Share widget

A share icon fixed at the bottom right. On devices with the native Web
Share API (most mobile browsers), tapping it opens the OS share sheet
directly. Everywhere else it opens a small menu: X, Facebook, LinkedIn,
Reddit, WhatsApp, Email, and a "Copy link" action.

## Files

| File | Goes where |
|---|---|
| `style.css` | Your stylesheet |
| `body.html` | Near the end of `<body>` |
| `script.js` | After `body.html`'s markup exists in the DOM (end of `<body>`) |

## Config

Edit the two constants at the top of `script.js`:

```js
const SHARE_URL = 'https://example.com/';
const SHARE_TEXT = 'Your site name — a one-line description';
```

That's it — every share link (X, Facebook, LinkedIn, Reddit, WhatsApp,
Email) is generated from those two values at load time via the
`data-network` attributes in `body.html`. You never hand-encode a URL.

## Dependencies

Uses `--bg`, `--surface`, `--fg`, `--muted`, `--border`, `--accent`,
`--accent-fg` custom properties (see the theme-toggle widget) with a
fallback for `--radius`. Drop it into a page with no design tokens at all
and it'll still render reasonably via that fallback, but it'll look best
alongside the theme-toggle widget's token set.

## Notes

- Icons are plain monochrome glyphs, not brand logos — keeps it
  consistent with a minimal design instead of clashing brand colors.
- Closes on outside click or Escape.
- "Copy link" uses the Clipboard API and fails silently if unavailable
  (e.g. very old browsers, insecure/non-HTTPS context).
