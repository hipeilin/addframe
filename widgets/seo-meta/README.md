# SEO meta

Unlike the other widgets, this isn't shared logic with a couple of config
knobs — almost every line here is site-specific content (title,
description, URLs). Think of it as a fill-in-the-blank template plus a
checklist, not a component.

## Files

| File | Goes where |
|---|---|
| `head.html` | Inside `<head>`, after charset/viewport meta tags |
| `robots.txt` | Site root (`/robots.txt`) |
| `sitemap.xml` | Site root (`/sitemap.xml`) |
| `og-image-template.html` | Not deployed — used once to generate `og-image.png` (see below) |

## Placeholders

One pass, fill these in (the same value is reused across several tags —
get each one right once):

| Placeholder | Example | Used in |
|---|---|---|
| `YOUR_PAGE_TITLE` | `AddFrame — Add a Border to Your Photo Online, Free` | `head.html` (title, og:title, twitter:title, og:image:alt) |
| `YOUR_META_DESCRIPTION` | `Add a border to your photo online for free. ...` (~150-160 chars) | `head.html` (description, og:description, twitter:description, JSON-LD) |
| `YOUR_SITE_NAME` | `AddFrame` | `head.html` (og:site_name, JSON-LD name), `og-image-template.html` |
| `YOUR_SITE_URL` | `https://you.github.io/project/` (trailing slash) | `head.html` (canonical, og:url, JSON-LD url), `sitemap.xml` |
| `YOUR_OG_IMAGE_URL` | `https://you.github.io/project/og-image.png` | `head.html` (og:image, twitter:image) |
| `YOUR_SITEMAP_URL` | `https://you.github.io/project/sitemap.xml` | `robots.txt` |

Title: keep it under ~60 characters or Google truncates it. Description:
keep it under ~155-160 characters for the same reason.

The JSON-LD block defaults to `@type: WebApplication`, which fits a free
browser-based tool. For other content (a blog post, a product, an
organization page) swap the `@type` and its fields for the matching
[schema.org](https://schema.org/) type instead — don't just leave
`WebApplication` on something that isn't one.

## Regenerating the OG preview image

`og-image-template.html` is a plain HTML page sized to exactly 1200×630
(the standard OG/Twitter preview size). Edit `YOUR_SITE_NAME` and the
tagline `<p>` inside it, then turn it into a PNG one of two ways:

**No install — Chrome/Edge DevTools:**
1. Open the file directly in the browser (drag it in, or File → Open).
2. DevTools (F12) → toggle device toolbar (Ctrl+Shift+M) → set a custom
   viewport of exactly `1200 x 630`, DPR `1`.
3. DevTools kebab menu (⋮) → "Capture screenshot".
4. Save it as `og-image.png` at your site root — it has to match wherever
   `YOUR_OG_IMAGE_URL` in `head.html` points.

**Scripted — if you already have Node/Playwright:**
```bash
npx playwright screenshot --viewport-size=1200,630 og-image-template.html og-image.png
```
(or drive it yourself with `chromium.launch()` + `page.screenshot()` for
more control — that's how this project's own `og-image.png` was made.)

## Checklist for a new site

- [ ] Title and description filled in, both under the length limits above
- [ ] `YOUR_SITE_URL` consistent across `head.html`, `sitemap.xml`, and
      `robots.txt` (same domain, same trailing slash convention)
- [ ] `og-image.png` generated and deployed at the URL `og:image` points to
- [ ] JSON-LD `@type` matches what the page actually is
- [ ] A favicon exists (not covered by this template — separate concern,
      but Google does show it in search results now too)
- [ ] After deploying: submit the site + `sitemap.xml` in
      [Google Search Console](https://search.google.com/search-console) —
      none of the above gets you indexed on its own, it just makes the
      page correct once a crawler visits
