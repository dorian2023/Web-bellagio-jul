import { getCatalogProducts, subscribeCatalog } from '../services/catalog-store.js';
import { escapeHTML } from '../utils/security.js';
import { openProductModal } from '../utils/lightbox.js';

export function selectGalleryProducts(products) {
  const seen = new Set();
  return [...products].sort((a, b) => (Date.parse(b.created_at) || 0) - (Date.parse(a.created_at) || 0))
    .filter(product => {
      if (!product.id || seen.has(product.id) || !product.image || product.published === false) return false;
      seen.add(product.id);
      return true;
    }).slice(0, 7);
}

function renderCards() {
  return selectGalleryProducts(getCatalogProducts()).map(product => `
    <button class="collection-orbit-card" type="button" data-orbit-product="${escapeHTML(String(product.id))}" aria-label="Ver ${escapeHTML(product.title)}">
      <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.title)}" loading="lazy" decoding="async" width="640" height="480">
      <span class="collection-orbit-caption"><small>${escapeHTML(product.categoryName)}</small><strong>${escapeHTML(product.title)}</strong><span aria-hidden="true">↗</span></span>
    </button>`).join('');
}

export function renderCatalogs() {
  return `
    <section id="catalogos" class="section-wrapper catalog-entrance-section" aria-label="Acceso al catálogo">
      <div class="container collection-showcase">
        <div class="catalog-entrance reveal-item">
          <div class="catalog-entrance-mark" aria-hidden="true"><span></span><img src="/logo.png" alt="" width="72" height="72"><span></span></div>
          <span class="section-tag">Colección Bellagio</span>
          <h2 class="section-title">Descubre nuestro <span class="gold-text">catálogo completo</span></h2>
          <p class="section-subtitle">Explora todas nuestras piezas, categorías y novedades en una experiencia creada para encontrar el mobiliario ideal para tus espacios.</p>
          <a href="#/catalogo" class="btn btn-primary btn-lg catalog-entrance-cta"><span>Explorar el catálogo</span><span aria-hidden="true">→</span></a>
        </div>
        <div class="collection-orbit" role="group" aria-label="Productos del catálogo">${renderCards()}</div>
      </div>
    </section>`;
}

let dispose = () => {};
export function cleanupCatalogsEvents() { dispose(); dispose = () => {}; }

export function setupCatalogsEvents() {
  cleanupCatalogsEvents();
  const gallery = document.querySelector('.collection-orbit');
  if (!gallery) return;
  const controller = new AbortController();
  const options = { signal: controller.signal };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let cards = [...gallery.children];
  let phase = 0, frame = 0, previous = 0, visible = false, hovered = false;
  let width = gallery.clientWidth, height = gallery.clientHeight;
  function paint() {
    gallery.classList.toggle('is-static', reduced.matches || cards.length < 2);
    if (reduced.matches || cards.length < 2) {
      cards.forEach(card => card.removeAttribute('style'));
      return;
    }
    cards.forEach((card, index) => {
      const angle = phase + index * Math.PI * 2 / cards.length;
      const depth = (Math.cos(angle) + 1) / 2;
      const x = (1 - Math.cos(angle)) * width * .62;
      const y = Math.sin(angle) * height * .62;
      card.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${.64 + .36 * depth})`;
      card.style.zIndex = String(Math.round(depth * 100));
    });
  }
  function tick(now) {
    if (previous) phase += Math.min(now - previous, 50) * Math.PI * 2 / 42000;
    previous = now;
    paint();
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame); previous = 0;
    if (visible && !document.hidden && !reduced.matches && !hovered && !gallery.contains(document.activeElement) && cards.length > 1) frame = requestAnimationFrame(tick);
  }
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
  observer.observe(gallery);
  const resize = new ResizeObserver(() => { width = gallery.clientWidth; height = gallery.clientHeight; paint(); });
  resize.observe(gallery);
  gallery.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') { hovered = true; sync(); } }, options);
  gallery.addEventListener('pointerleave', () => { hovered = false; sync(); }, options);
  gallery.addEventListener('focusin', event => {
    const index = cards.indexOf(event.target.closest('.collection-orbit-card'));
    if (index >= 0) { phase = -index * Math.PI * 2 / cards.length; paint(); }
    sync();
  }, options);
  gallery.addEventListener('focusout', () => queueMicrotask(() => { if (!controller.signal.aborted) sync(); }), options);
  gallery.addEventListener('click', event => {
    const id = event.target.closest('[data-orbit-product]')?.dataset.orbitProduct;
    const product = getCatalogProducts().find(item => String(item.id) === id);
    if (product) openProductModal(product);
  }, options);
  gallery.addEventListener('error', event => {
    if (event.target.tagName === 'IMG') event.target.style.visibility = 'hidden';
  }, { ...options, capture: true });
  reduced.addEventListener('change', () => { paint(); sync(); }, options);
  document.addEventListener('visibilitychange', sync, options);
  const unsubscribe = subscribeCatalog(() => {
    gallery.innerHTML = renderCards(); cards = [...gallery.children]; paint(); sync();
  });
  paint();
  dispose = () => { cancelAnimationFrame(frame); observer.disconnect(); resize.disconnect(); controller.abort(); unsubscribe(); };
}
