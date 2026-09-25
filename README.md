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

## Two things still need real values

Both are at the top of `build/build.mjs`, in `SITE`. Change them and re-run the build.

| Field | Current | Note |
|---|---|---|
| `origin` | `https://eggbistro.com.tr` | Placeholder. Feeds canonical, hreflang, OG tags and the sitemap — all of which are wrong until the real domain is set. |
| `phoneDisplay` / `phoneE164` | `0501 000 03 22` | **Placeholder.** This is the site's only conversion path; it appears in the header, hero, call bar, footer, JSON-LD and the meta description. |

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
