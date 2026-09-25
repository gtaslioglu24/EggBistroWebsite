# Egg Bistro — eggbistro.com.tr

Static bilingual site for Egg Bistro, Zekeriyaköy / Sarıyer, İstanbul.
No framework, no runtime dependencies. `dist/` is what gets deployed.

## Layout

```
assets-src/        full-size photographs (NOT deployed) — see its README
build/
  build.mjs        generates the HTML pages + robots/sitemap/manifest/404
  images.sh        regenerates the responsive image set from assets-src/
  serve.mjs        local preview server on :8777 (no-cache, serves 404.html)
dist/              the deployed folder
  index.html       Turkish   (generated)
  en/index.html    English   (generated)
  style.css        hand-authored
  script.js        hand-authored, progressive enhancement only
  fonts/           self-hosted Cormorant Garamond + Manrope
  assets/          responsive derivatives + og-image.jpg
```

## Commands

```bash
node build/build.mjs     # rebuild the HTML and the SEO files
./build/images.sh        # rebuild the image derivatives (needs ImageMagick)
node build/serve.mjs     # preview at http://localhost:8777
```

Copy, wording and language handling all live in `STRINGS` in `build/build.mjs`.
Adding a language means adding one object there — the nav, `hreflang`, sitemap
and language switcher all derive from it.

## Before launch

The only outstanding item is the domain. `eggbistro.com.tr` is set as `SITE.origin`
in `build/build.mjs`, but it is not registered yet — so the canonical URL, `hreflang`
alternates, Open Graph URLs and the sitemap all point at a host that does not resolve.
Nothing needs changing once it is live; if the domain ends up different, edit that one
field and re-run `node build/build.mjs`.

The phone number (`0501 000 03 22`) is confirmed correct.

## Deploying (Vercel)

Import the repo and set:

| Setting | Value |
|---|---|
| Framework Preset | Other |
| Root Directory | `./` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | leave default (there are no dependencies) |

`vercel.json` adds the security headers (CSP, HSTS, `nosniff`, `Referrer-Policy`,
`Permissions-Policy`, `frame-ancestors`) and the cache policy. Static hosting cannot
set headers from the HTML, so this file is the only place they exist — keep it.

Cache policy: fonts are immutable for a year; `/assets/*` is 30 days and deliberately
**not** immutable, because derivative filenames carry a width (`hero-1200.webp`) rather
than a content hash — a replaced photograph reuses its name. HTML, CSS and JS always
revalidate.

The CSP allows no inline styles or scripts. `build/serve.mjs` sends the same policy
locally, so a violation shows up before deploying rather than after.

## Notes

- **The hero photograph is portrait (1201×1800) used as a wide banner.** It is the
  largest element on screen and the only image the site cannot serve sharply: on a
  1440px desktop it is upscaled, and worse on a Retina display. Everything else is
  already served at the right size. A landscape original, ideally 2400px wide, is the
  single biggest remaining quality win — drop it in `assets-src/hero.webp` and run
  `./build/images.sh`.
- Fonts are self-hosted on purpose: no visitor IP reaches Google (KVKK/GDPR), and no
  render-blocking request to a third-party domain.
- The menu links out to a third-party QR menu (qrall.co) that is Turkish-only. The
  English page labels it "Menu (TR)" so guests are not misled.
