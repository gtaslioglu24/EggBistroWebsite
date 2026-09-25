#!/usr/bin/env node
/*
 * Builds dist/index.html (TR) and dist/en/index.html (EN) from one source,
 * plus robots.txt, sitemap.xml, 404.html and site.webmanifest.
 *
 *   node build/build.mjs
 *
 * CSS, JS and images in dist/ are hand-authored and left untouched.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

/* =========================================================== site config ==
 * Everything environment-specific lives here and nowhere else.
 * ======================================================================== */
const SITE = {
  // The intended domain. Not registered yet — canonical, hreflang, OG and the
  // sitemap all point here, so they only resolve once it is live.
  origin: 'https://eggbistro.com.tr',

  phoneDisplay: '0501 000 03 22',
  phoneE164: '+905010000322',

  menuURL: 'https://view.qrall.co/tr?tenantId=3a16e69d-7ecb-bc36-0c3f-3e7cbc0a5348&channelId=3a16e69d-854a-0b35-c52c-68af1455f6ba',
  instagram: 'https://www.instagram.com/eggbistroo/',
  maps: 'https://yandex.com.tr/maps/org/egg_bistro/144951610350/',

  street: 'Türkmen Caddesi No: 26/7',
  district: 'Zekeriyaköy, Sarıyer',
  city: 'İstanbul',
  postalCode: '34450',
  lat: 41.2246,
  lon: 29.0386,
  opens: '12:00',
  closes: '02:00',
  themeColor: '#211e1b',
  ogImage: '/assets/og-image.jpg',   // 1200x630 landscape crop, for link previews
};

/* ================================================================ strings ==
 * One entry per language. Adding a third language means adding one object
 * and one entry to PAGES.
 * ======================================================================== */
const STRINGS = {
  tr: {
    lang: 'tr', path: '/', dir: '',
    title: 'Egg Bistro — Zekeriyaköy, İstanbul',
    description: `Zekeriyaköy’de taş fırın pizza, kokteyller ve sıcak bir atmosfer. Egg Bistro menüsünü keşfedin. Her gün 12.00–02.00. Rezervasyon: ${SITE.phoneDisplay}.`,
    skip: 'İçeriğe geç',
    navLabel: 'Ana menü',
    navPlace: 'Mekân', navMenu: 'Mutfak & bar', navVisit: 'İletişim',
    book: 'Rezervasyon',
    eyebrow: 'ZEKERİYAKÖY, İSTANBUL',
    heroCopy: 'Taş fırın mutfağı, kokteyl ve şarap.',
    heroMenu: 'Menüye bakın',
    heroCall: 'Rezervasyon için ara',
    heroDiscover: 'Mekânı keşfedin',
    hours: 'HER GÜN 12.00 — 02.00',
    introTitle: 'Şömine<br>sıcaklığında',
    introCopy: 'Bahçede ateşin etrafında veya içeride bir masada. Öğle yemeğinden akşamın son kadehine, Egg Bistro’da buluşalım.',
    introLink: 'Konum & iletişim',
    kitchenTitle: 'Mutfak <em>&</em> bar',
    fullMenu: 'Menünün tamamı',
    capPizza: 'Taş fırın pizza', capOven: 'Fırının başında',
    capCocktail: 'Kokteyller', capDinner: 'Yemek ve şarap',
    ambienceTitle: 'İçeriden<br>bir bakış.',
    ambienceCopy: 'Ahşap şarap rafları, bar masaları ve sıcak ışıklar. İçerideki oturma alanımızdan birkaç detay.',
    visitTitle: 'Rezervasyon',
    addressLabel: 'Adres', hoursLabel: 'Saatler',
    directions: 'Yol tarifi alın ↗',
    hoursLine: 'Her gün · 12.00–02.00',
    footerMenu: 'Menü ↗',
    rights: 'Tüm hakları saklıdır.',
    barMenu: 'Menü', barCall: 'Ara',
    notFoundTitle: 'Sayfa bulunamadı',
    notFoundCopy: 'Aradığınız sayfa taşınmış veya hiç var olmamış olabilir.',
    notFoundBack: 'Ana sayfaya dönün',
    alt: {
      hero: 'Egg Bistro’nun sıcak ışıklı bahçesinde şömineli masa',
      pizza: 'Egg Bistro’da masaya servis edilen pizza',
      oven: 'Taş fırında pişen pizza',
      cocktail: 'Şöminenin yanında kokteyl',
      dinner: 'Yemek ve beyaz şarap',
      shelves: 'Egg Bistro’nun ahşap şarap rafları ve iç mekânı',
      bar: 'Egg Bistro bar masası ve sandalyeleri',
    },
  },
  en: {
    lang: 'en', path: '/en/', dir: 'en',
    title: 'Egg Bistro — Zekeriyaköy, Istanbul',
    description: `Stone-oven pizza, cocktails and a warm atmosphere in Zekeriyaköy, Istanbul. Open daily 12:00–02:00. Reservations: ${SITE.phoneE164}.`,
    skip: 'Skip to content',
    navLabel: 'Main navigation',
    navPlace: 'The place', navMenu: 'Kitchen & bar', navVisit: 'Visit us',
    book: 'Reservations',
    eyebrow: 'ZEKERİYAKÖY, ISTANBUL',
    heroCopy: 'Stone-oven cooking, cocktails & wine.',
    heroMenu: 'Menu (TR)',
    heroCall: 'Call to reserve',
    heroDiscover: 'Discover the bistro',
    hours: 'DAILY 12:00 — 02:00',
    introTitle: 'By the warmth<br>of the fire',
    introCopy: 'Around the garden fire or at a table inside. From lunch to an evening glass, meet us at Egg Bistro.',
    introLink: 'Location & contact',
    kitchenTitle: 'Kitchen <em>&</em> bar',
    fullMenu: 'Full menu (TR)',
    capPizza: 'Stone-oven pizza', capOven: 'At the oven',
    capCocktail: 'Cocktails', capDinner: 'Dinner and wine',
    ambienceTitle: 'A look<br>inside.',
    ambienceCopy: 'Wooden wine shelves, bar tables and warm lighting. A few details from our indoor seating area.',
    visitTitle: 'Reservations',
    addressLabel: 'Address', hoursLabel: 'Hours',
    directions: 'Get directions ↗',
    hoursLine: 'Every day · 12:00–02:00',
    footerMenu: 'Menu (TR) ↗',
    rights: 'All rights reserved.',
    barMenu: 'Menu', barCall: 'Call',
    notFoundTitle: 'Page not found',
    notFoundCopy: 'The page you are looking for may have moved, or never existed.',
    notFoundBack: 'Back to the home page',
    alt: {
      hero: 'A fireside table in Egg Bistro’s warmly lit garden',
      pizza: 'Pizza served at the table at Egg Bistro',
      oven: 'Pizza baking in the stone oven',
      cocktail: 'A cocktail by the fire',
      dinner: 'Dinner and white wine',
      shelves: 'Wooden wine shelves inside Egg Bistro',
      bar: 'Bar table and seating at Egg Bistro',
    },
  },
};
const PAGES = Object.values(STRINGS);

/* ================================================================ helpers ==*/
const esc = (s) => String(s).replace(/&(?![a-zA-Z#0-9]+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Responsive <img>. `widths` are the derivative files generated in dist/assets. */
function img(base, { widths, sizes, alt, cls = '', lazy = true, priority = false, w = 1201, h = 1800 }) {
  const srcset = widths.map((x) => `${P}assets/${base}-${x}.webp ${x}w`).join(', ');
  return `<img${cls ? ` class="${cls}"` : ''} src="${P}assets/${base}-${widths[widths.length - 1]}.webp"`
    + ` srcset="${srcset}" sizes="${sizes}" width="${w}" height="${h}" alt="${esc(alt)}"`
    + (priority ? ' fetchpriority="high" decoding="async"' : '')
    + (lazy ? ' loading="lazy" decoding="async"' : '')
    + '>';
}

// Asset/link prefix: root-relative, so the same markup works at / and /en/.
const P = '/';

const HERO_WIDTHS = [800, 1200];

/* ============================================================ page markup ==*/
function page(t) {
  const other = PAGES.find((p) => p.lang !== t.lang);
  const canonical = SITE.origin + t.path;
  const menu = esc(SITE.menuURL);
  const tel = `tel:${SITE.phoneE164}`;

  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': SITE.origin + '/#restaurant',
    name: 'Egg Bistro',
    url: canonical,
    image: [SITE.origin + '/assets/hero-1200.webp', SITE.origin + '/assets/pizza-960.webp'],
    logo: SITE.origin + '/assets/wordmark.svg',
    telephone: SITE.phoneE164,
    priceRange: '$$',
    servesCuisine: ['Pizza', 'Bistro', 'Cocktails'],
    hasMenu: SITE.menuURL,
    sameAs: [SITE.instagram, SITE.maps],
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.street,
      addressLocality: SITE.district,
      addressRegion: SITE.city,
      postalCode: SITE.postalCode,
      addressCountry: 'TR',
    },
    geo: { '@type': 'GeoCoordinates', latitude: SITE.lat, longitude: SITE.lon },
    openingHoursSpecification: [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: SITE.opens,
      closes: SITE.closes,
    }],
    acceptsReservations: 'True',
  };

  const alts = PAGES.map((p) => `<link rel="alternate" hreflang="${p.lang}" href="${SITE.origin}${p.path}">`).join('\n')
    + `\n<link rel="alternate" hreflang="x-default" href="${SITE.origin}/">`;

  return `<!doctype html>
<html lang="${t.lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.description)}">
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta name="theme-color" content="${SITE.themeColor}">
<link rel="canonical" href="${canonical}">
${alts}

<meta property="og:type" content="website">
<meta property="og:site_name" content="Egg Bistro">
<meta property="og:locale" content="${t.lang === 'tr' ? 'tr_TR' : 'en_US'}">
<meta property="og:title" content="${esc(t.title)}">
<meta property="og:description" content="${esc(t.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE.origin}${SITE.ogImage}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(t.alt.hero)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(t.title)}">
<meta name="twitter:description" content="${esc(t.description)}">
<meta name="twitter:image" content="${SITE.origin}${SITE.ogImage}">

<link rel="icon" href="${P}favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${P}apple-touch-icon.png">
<link rel="manifest" href="${P}site.webmanifest">

<link rel="preload" as="font" type="font/woff2" href="${P}fonts/manrope-400-latin.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="${P}fonts/cormorant-garamond-400-latin.woff2" crossorigin>
<link rel="preload" as="image" href="${P}assets/hero-1200.webp" imagesrcset="${HERO_WIDTHS.map((x) => `${P}assets/hero-${x}.webp ${x}w`).join(', ')}" imagesizes="100vw" fetchpriority="high">
<link rel="stylesheet" href="${P}style.css">
<script defer src="${P}script.js"></script>
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body>
<a class="skip" href="#main">${esc(t.skip)}</a>

<header class="header">
  <a class="brand" href="${t.path}" aria-label="Egg Bistro"><img src="${P}assets/wordmark.svg" alt="Egg Bistro" width="220" height="61"></a>
  <nav aria-label="${esc(t.navLabel)}">
    <a href="#atmosphere">${esc(t.navPlace)}</a>
    <a href="#menu">${esc(t.navMenu)}</a>
    <a href="#visit">${esc(t.navVisit)}</a>
  </nav>
  <div class="header-end">
    <div class="languages" role="group" aria-label="Language / Dil">
      ${PAGES.map((p) => `<a href="${p.path}" hreflang="${p.lang}" lang="${p.lang}"${p.lang === t.lang ? ' aria-current="true"' : ''}>${p.lang.toUpperCase()}</a>`).join('<span aria-hidden="true">/</span>')}
    </div>
    <a class="book" href="${tel}">${esc(t.book)}</a>
  </div>
</header>

<main id="main">

<section class="hero" id="home">
  ${img('hero', { widths: HERO_WIDTHS, sizes: '100vw', alt: t.alt.hero, cls: 'hero-img', lazy: false, priority: true })}
  <div class="hero-shade"></div>
  <div class="hero-content">
    <p class="eyebrow">${esc(t.eyebrow)}</p>
    <h1 class="hero-title">Egg <em>Bistro</em></h1>
    <p class="hero-copy">${esc(t.heroCopy)}</p>
    <div class="hero-actions">
      <a class="button" href="${menu}" target="_blank" rel="noopener noreferrer"><span>${esc(t.heroMenu)}</span><span aria-hidden="true">↗</span></a>
      <a class="hero-call" href="${tel}">${esc(t.heroCall)}</a>
    </div>
  </div>
  <div class="hero-bottom">
    <a href="#atmosphere">${esc(t.heroDiscover)}</a>
    <span>${esc(t.hours)}</span>
  </div>
</section>

<div class="surface">

<section class="intro section" id="atmosphere">
  <div class="intro-title"><h2>${t.introTitle}</h2></div>
  <div class="intro-text">
    <p>${esc(t.introCopy)}</p>
    <a class="text-link" href="#visit">${esc(t.introLink)}</a>
  </div>
</section>

<section class="menu-section section" id="menu">
  <div class="section-heading">
    <div><h2>${t.kitchenTitle}</h2></div>
    <div class="menu-heading-right">
      <a class="button" href="${menu}" target="_blank" rel="noopener noreferrer"><span>${esc(t.fullMenu)}</span><span aria-hidden="true">↗</span></a>
    </div>
  </div>
  <div class="kitchen-story">
    <figure class="kitchen-photo kitchen-lead">
      <div class="kitchen-frame">${img('pizza', { widths: [320, 480, 720, 960], sizes: '(max-width: 700px) 60vw, 41vw', alt: t.alt.pizza })}</div>
      <figcaption><h3>${esc(t.capPizza)}</h3></figcaption>
    </figure>
    <div class="kitchen-support">
      <div class="kitchen-pair">
        <figure class="kitchen-photo">
          <div class="kitchen-frame">${img('stone-oven', { widths: [320, 480, 640], sizes: '(max-width: 700px) 40vw, 20vw', alt: t.alt.oven })}</div>
          <figcaption><h3>${esc(t.capOven)}</h3></figcaption>
        </figure>
        <figure class="kitchen-photo">
          <div class="kitchen-frame">${img('cocktail', { widths: [320, 480, 640], sizes: '(max-width: 700px) 40vw, 20vw', alt: t.alt.cocktail })}</div>
          <figcaption><h3>${esc(t.capCocktail)}</h3></figcaption>
        </figure>
      </div>
      <figure class="kitchen-photo kitchen-dinner">
        <div class="kitchen-frame dinner-frame">${img('ekle', { widths: [320, 480, 640], sizes: '(max-width: 700px) 40vw, 20vw', alt: t.alt.dinner })}</div>
        <figcaption><h3>${esc(t.capDinner)}</h3></figcaption>
      </figure>
    </div>
  </div>
</section>

<section class="ambience">
  <div class="ambience-photo">${img('interior-shelves', { widths: [480, 720, 960, 1200], sizes: '(max-width: 600px) 86vw, 41vw', alt: t.alt.shelves })}</div>
  <div class="ambience-copy">
    <h2>${t.ambienceTitle}</h2>
    <p>${esc(t.ambienceCopy)}</p>
    <figure class="bar-detail">${img('bar', { widths: [480, 720, 960], sizes: '(max-width: 600px) 86vw, 33vw', alt: t.alt.bar })}</figure>
  </div>
</section>

<section class="visit section" id="visit">
  <div>
    <h2>${esc(t.visitTitle)}</h2>
    <a class="phone" href="${tel}">${esc(SITE.phoneDisplay)} <span aria-hidden="true">↗</span></a>
  </div>
  <div class="visit-details">
    <div>
      <h3>${esc(t.addressLabel)}</h3>
      <address>${esc(SITE.street)}<br>${esc(SITE.district)}, ${esc(SITE.city)}</address>
      <a class="text-link" href="${esc(SITE.maps)}" target="_blank" rel="noopener noreferrer">${esc(t.directions)}</a>
    </div>
    <div>
      <h3>${esc(t.hoursLabel)}</h3>
      <p>${esc(t.hoursLine)}</p>
    </div>
  </div>
</section>

</div></main>

<footer>
  <div class="footer-top">
    <a href="${t.path}" class="brand footer-brand" aria-label="Egg Bistro"><img src="${P}assets/wordmark.svg" alt="Egg Bistro" width="220" height="61" loading="lazy"></a>
    <div class="footer-links">
      <a href="${menu}" target="_blank" rel="noopener noreferrer">${esc(t.footerMenu)}</a>
      <a href="${esc(SITE.instagram)}" target="_blank" rel="noopener noreferrer">Instagram ↗</a>
      <a href="${tel}">${esc(t.book)}</a>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="studio-signature">
      <span>© <span id="year">${new Date().getFullYear()}</span> Skymoon Studios</span>
      <span>Made by Gökay Deniz Taslıoğlu</span>
    </div>
    <p class="rights">${esc(t.rights)}</p>
  </div>
</footer>

<nav class="callbar" aria-label="${esc(t.book)}">
  <a href="${menu}" target="_blank" rel="noopener noreferrer">${esc(t.barMenu)} ↗</a>
  <a class="callbar-primary" href="${tel}">${esc(t.barCall)} · ${esc(SITE.phoneDisplay)}</a>
</nav>

</body>
</html>
`;
}

/* ============================================================== 404 page ==*/
function notFound(t) {
  return `<!doctype html>
<html lang="${t.lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t.notFoundTitle)} — Egg Bistro</title>
<meta name="robots" content="noindex">
<meta name="theme-color" content="${SITE.themeColor}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/style.css">
<style>
 .nf { min-height: 100svh; display: grid; place-content: center; text-align: center; gap: 18px; padding: 40px 7%; }
 .nf img { width: 190px; margin: 0 auto 10px; }
 .nf p { color: var(--muted); }
 .nf .text-link { margin-top: 6px; }
</style>
</head>
<body>
<main class="nf">
  <img src="/assets/wordmark.svg" alt="Egg Bistro" width="220" height="61">
  <h1>${esc(t.notFoundTitle)}</h1>
  <p>${esc(t.notFoundCopy)}</p>
  <p><a class="text-link" href="${t.path}">${esc(t.notFoundBack)}</a></p>
</main>
</body>
</html>
`;
}

/* ================================================================== write ==*/
const write = (rel, body) => {
  const abs = join(DIST, rel);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, body);
  console.log(`  dist/${rel}  ${(Buffer.byteLength(body) / 1024).toFixed(1)} KB`);
};

console.log('Building Egg Bistro…');
for (const t of PAGES) write(join(t.dir, 'index.html'), page(t));
write('404.html', notFound(STRINGS.tr));

write('robots.txt', `User-agent: *
Allow: /

Sitemap: ${SITE.origin}/sitemap.xml
`);

const today = new Date().toISOString().slice(0, 10);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${PAGES.map((p) => `  <url>
    <loc>${SITE.origin}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${p.lang === 'tr' ? '1.0' : '0.8'}</priority>
${PAGES.map((q) => `    <xhtml:link rel="alternate" hreflang="${q.lang}" href="${SITE.origin}${q.path}"/>`).join('\n')}
  </url>`).join('\n')}
</urlset>
`);

write('site.webmanifest', JSON.stringify({
  name: 'Egg Bistro',
  short_name: 'Egg Bistro',
  description: STRINGS.tr.description,
  start_url: '/',
  scope: '/',
  display: 'standalone',
  background_color: SITE.themeColor,
  theme_color: SITE.themeColor,
  lang: 'tr',
  icons: [
    { src: '/favicon.svg', type: 'image/svg+xml', sizes: 'any', purpose: 'any' },
    { src: '/icon-192.png', type: 'image/png', sizes: '192x192' },
    { src: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    { src: '/icon-512-maskable.png', type: 'image/png', sizes: '512x512', purpose: 'maskable' },
  ],
}, null, 2) + '\n');

console.log('Done.');
