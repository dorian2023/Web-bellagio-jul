/**
 * @file router.js
 * @description Lightweight SPA router managing seamless view switching between Home and Dedicated Catalog Page.
 * After each route change, re-attaches IntersectionObservers for reveal animations.
 */

import { renderHero, setupHeroEvents } from '../components/hero.js';
import { renderAbout } from '../components/about.js';
import { renderStores } from '../components/stores.js';
import { renderCatalogs, setupCatalogsEvents } from '../components/catalogs.js';
import { renderContact, setupContactEvents } from '../components/contact.js';
import { renderCatalogPage, setupCatalogPageEvents } from '../views/catalog-page.js';
import { renderAdminPage, setupAdminPageEvents } from '../views/admin-page.js';
import { fetchPublicCatalog } from '../services/products.js';
import { setCatalogData } from '../services/catalog-store.js';
import { reattachRevealObservers } from '../utils/scroll.js';

/**
 * Initializes hash routing listener and renders the current route.
 */
export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

/**
 * Handles route resolution based on window.location.hash.
 */
let catalogDataPromise;

export async function handleRoute() {
  const mainContent = document.getElementById('mainContent');
  if (!mainContent) return;

  const rawHash = window.location.hash || '#/';
  const normalizedHash = rawHash.replace(/^#\/?/, '').toLowerCase();

  // Update active state in Navbar
  updateNavbarActiveState(rawHash);

  if (normalizedHash.startsWith('admin')) {
    mainContent.innerHTML = '<div class="admin-loading">Cargando panel...</div>';
    mainContent.innerHTML = await renderAdminPage();
    setupAdminPageEvents();
    return;
  }

  if (!catalogDataPromise) catalogDataPromise = fetchPublicCatalog();
  setCatalogData(await catalogDataPromise);

  // Dedicated Catalog View
  if (normalizedHash.startsWith('catalogo')) {
    mainContent.innerHTML = renderCatalogPage();
    window.scrollTo({ top: 0, behavior: 'instant' });
    setupCatalogPageEvents();
    reattachRevealObservers();
    document.title = 'Catálogo Exclusivo 2026 | Muebles Bellagio';
    return;
  }

  // Home Landing Page View
  document.title = 'Muebles Bellagio | Muebles de Lujo & Diseño en Caracas';

  // Always rebuild the landing page sections when navigating to home
  const isShowingCatalog = mainContent.querySelector('.dedicated-catalog-page');
  if (isShowingCatalog || !mainContent.querySelector('#inicio')) {
    mainContent.innerHTML = `
      ${renderHero()}
      ${renderAbout()}
      ${renderStores()}
      ${renderCatalogs()}
      ${renderContact()}
    `;
    setupCatalogsEvents();
    setupContactEvents();
    setupHeroEvents();
    // Re-observe fresh reveal-items so animations trigger
    reattachRevealObservers();
  }

  // Handle in-page anchors (tiendas, contacto, inicio)
  if (normalizedHash === 'tiendas' || normalizedHash === 'contactanos' || normalizedHash === 'inicio') {
    const targetElement = document.getElementById(normalizedHash);
    if (targetElement) {
      setTimeout(() => {
        const navHeight = document.querySelector('.navbar')?.offsetHeight || 70;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }, 80);
    }
  } else if (!rawHash || rawHash === '#/' || rawHash === '#') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/**
 * Updates navbar active link highlight.
 * @param {string} currentHash 
 */
function updateNavbarActiveState(currentHash) {
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const isCatalog = currentHash.includes('catalogo');
  const isTiendas = currentHash.includes('tienda');
  const isContact = currentHash.includes('contact');
  const isInicio = !isCatalog && !isTiendas && !isContact;

  navLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    let isActive = false;

    if (isCatalog && href.includes('catalogo')) isActive = true;
    else if (isTiendas && href.includes('tienda')) isActive = true;
    else if (isContact && href.includes('contact')) isActive = true;
    else if (isInicio && (href.includes('inicio') || href === '#/' || href === '#')) isActive = true;

    link.classList.toggle('active', isActive);
  });
}
