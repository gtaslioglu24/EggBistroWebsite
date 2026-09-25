# Original photographs

Full-size sources. These are **not deployed** — `build/images.sh` resizes them into
`dist/assets/<name>-<width>.webp` (plus `og-image.jpg`), which is what the pages load.

`fire.webp`, `interior.webp`, `logo.webp`, `wine.webp` and `oven.webp` are currently
unused by the site; they are kept here in case a future section needs them.

To add or replace a photograph: drop the full-size file here, add it to `build/images.sh`,
run that script, then `node build/build.mjs`.
