# AddFrame

A minimalistic, static, browser-only tool that adds a border around your photo. Set the border's width, color, and corner rounding, and independently round the corners of the photo itself. Export as PNG (transparent corners) or JPG (white corners).

No build step, no backend — everything runs client-side with the Canvas API. Your image never leaves your browser.

## Run locally

Open [index.html](index.html) directly in a browser, or serve the folder with any static file server, e.g.:

```
npx serve .
```

## Deploy to GitHub Pages

1. Push this repo to GitHub (already wired to `hipeilin/addframe`).
2. In the repo settings, go to **Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`.
4. Save. The site will be published at `https://hipeilin.github.io/addframe/`.

## Files

- [index.html](index.html) — page structure
- [style.css](style.css) — styling
- [script.js](script.js) — image loading, canvas rendering, and export logic
