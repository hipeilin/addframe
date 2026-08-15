# Buy Me a Coffee button

A plain link + badge image — not the official embed widget (which adds
a floating sticky button and its own JS). This is just an `<a><img></a>`,
so it has zero runtime cost and matches whatever design you drop it into.

## Files

| File | Goes where |
|---|---|
| `body.html` | Wherever you want the button (e.g. footer) |
| `style.css` | Your stylesheet |

## Config

Replace `YOUR_USERNAME` in `body.html` — it appears **twice**: once in
the `href`, once in the image's `slug=` query param.

## Customizing the badge

The image is generated on the fly by Buy Me a Coffee's button API. Tweak
the query params in the `src` URL: `text`, `button_colour`, `font_colour`,
`font_family`, `outline_colour`, `coffee_colour`. See
[buymeacoffee.com/dashboard/setup/widget](https://www.buymeacoffee.com/dashboard/setup/widget)
for the full picker.

## Layout

Defaults to a standalone block (its own line). See the comment at the
bottom of `style.css` for the inline-with-text variant.
