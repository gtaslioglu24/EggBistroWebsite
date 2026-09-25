#!/usr/bin/env bash
# Regenerates dist/assets/<name>-<width>.webp from the full-size originals in assets-src/.
# Run after replacing or adding a photograph, then `node build/build.mjs`.
set -euo pipefail
cd "$(dirname "$0")/.."
gen() { n=$1; shift; for w in "$@"; do magick "assets-src/$n.webp" -resize "${w}x" -strip -quality 78 -define webp:method=6 "dist/assets/$n-${w}.webp"; done; }
gen hero 800 1200
gen pizza 320 480 720 960
gen stone-oven 320 480 640
gen cocktail 320 480 640
gen ekle 320 480 640
gen interior-shelves 480 720 960 1200
gen bar 480 720 960
# 1200x630 landscape crop for link previews (WhatsApp, Twitter, Facebook).
magick assets-src/hero.webp -gravity North -crop 1201x630+0+639 +repage -resize 1200x630! \
  -strip -quality 82 dist/assets/og-image.jpg
echo "Images regenerated."
