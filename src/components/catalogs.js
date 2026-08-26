/**
 * @file catalogs.js
 * @description Landing page flagship catalog preview showcase with direct link to the dedicated 17-category catalog page.
 */

import { CATALOGS_DATA } from '../data/catalogs.js';
import { escapeHTML } from '../utils/security.js';
import { openCatalogModal } from '../utils/lightbox.js';

export function renderCatalogs() {
  // Show 6 flagship highlight pieces on the landing page
  const featuredItems = CATALOGS_DATA.slice(0, 6);

  const catalogItemsHTML = featuredItems.map((item, idx) => {
    const delayClass = `reveal-delay-${(idx % 3) + 1}`;
    return `
      <div class="catalog-item-card reveal-item ${delayClass}">
        <div class="catalog-img-container">
          <img 
            src="${escapeHTML(item.image)}" 
            alt="${escapeHTML(item.title)}" 
            class="catalog-img"
            width="400"
            height="240"
            loading="lazy"
          />
          <span class="catalog-tag">${escapeHTML(item.categoryName)}</span>
        </div>

        <div class="catalog-body">
          <h3 class="catalog-title">${escapeHTML(item.title)}</h3>
          <p class="catalog-desc">${escapeHTML(item.subtitle)}</p>

          <div class="catalog-footer">
            <button type="button" class="btn btn-secondary btn-sm open-catalog-btn" data-catalog-id="${escapeHTML(item.id)}">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              Ver Detalles
            </button>

            <a href="https://wa.me/584141536516?text=${encodeURIComponent('Hola Muebles Bellagio, solicito cotización de ' + item.title)}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="btn btn-whatsapp btn-sm" 
               aria-label="Cotizar por WhatsApp">
              Cotizar
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <section id="catalogos" class="section-wrapper" style="background: var(--color-bg-surface);" aria-label="Catálogos y Colecciones">
      <div class="container">
        <header class="section-header reveal-item">
          <span class="section-tag">Colecciones Selectas</span>
          <h2 class="section-title">
            Nuestros <span class="gold-text">Catálogos de Lujo</span>
          </h2>
          <p class="section-subtitle">
            Explora una muestra destacada de nuestras 17 categorías de mobiliario de autor para residencias y oficinas.
          </p>
        </header>

        <!-- Catalogs Grid Preview -->
        <div class="catalogs-grid" id="catalogsGrid">
          ${catalogItemsHTML}
        </div>

        <!-- Big CTA Button to Dedicated Catalog Page -->
        <div class="reveal-item" style="text-align: center; margin-top: var(--space-10);">
          <a href="#/catalogo" class="btn btn-primary btn-lg" style="padding: 1.1rem 2.8rem; font-size: 1rem; box-shadow: var(--shadow-gold);">
            <span>Ver Catálogo Completo (17 Categorías A-Z)</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </section>
  `;
}

/**
 * Attaches modal handlers to preview cards.
 */
export function setupCatalogsEvents() {
  document.querySelectorAll('.open-catalog-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const catalogId = btn.getAttribute('data-catalog-id');
      if (catalogId) {
        openCatalogModal(catalogId);
      }
    });
  });
}
