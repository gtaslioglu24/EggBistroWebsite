/* Progressive enhancement only — the page is fully usable without this file. */

/* Keep the copyright year correct even if the page is served from a stale cache. */
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

/* Give the fixed header a background once the hero is no longer behind it.
   An IntersectionObserver instead of a scroll listener: no work per frame. */
const header = document.querySelector('.header');
const hero = document.querySelector('.hero');

if (header && hero && 'IntersectionObserver' in window) {
  const sentinel = document.createElement('div');
  sentinel.setAttribute('aria-hidden', 'true');
  sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;pointer-events:none;'
    + 'height:var(--solid-after, calc(100% - 140px))';
  hero.appendChild(sentinel);

  new IntersectionObserver(
    ([entry]) => header.classList.toggle('is-solid', !entry.isIntersecting),
    { threshold: 0 }
  ).observe(sentinel);
} else if (header) {
  header.classList.add('is-solid');
}
