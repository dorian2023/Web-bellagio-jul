/**
 * @file catalog-page.js
 * @description Dedicated Luxury Catalog Page view with Mega-Selector Dropdown (Option 1), quick filters, real-time search, and product modal.
 */

import { getCatalogCategories, getCatalogProducts } from '../services/catalog-store.js';
import { escapeHTML } from '../utils/security.js';
import { openProductModal, openProductVideo } from '../utils/lightbox.js';
import { isProductSelected, toggleProductSelection } from '../utils/inquiry-cart.js';
import { getOptimizedImageUrl } from '../utils/image-optimization.js';
import { extractYouTubeId } from '../utils/media.js';

let currentFilter = 'todos';
let currentSearch = '';

/**
 * Category SVG icon resolver.
 * @param {string} categoryId 
 * @returns {string} SVG markup
 */
function getCategoryIcon(categoryId) {
  const icons = {
    'todos': `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
    'box-spring': `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16M2 8h20v12H2zM2 17h20M6 8v9M10 8v9M14 8v9M18 8v9"/></svg>`,
    'ceibos': `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 4v16M3 10h18M8 14v2M16 14v2"/></svg>`,
    'closet': `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 3v18M8 12h.01M16 12h.01"/></svg>`,
    'comedores': `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="7" rx="9" ry="3"/><path d="M5 7v10M19 7v10M12 10v10M2 17h20"/></svg>`,
    'dormitorios': `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4M2 19h20M2 14h20v5H2zM4 9h16v5H4z"/></svg>`,
    'espejos': `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>`,
    'gaveteros': `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M11 6h2M11 12h2M11 18h2"/></svg>`,
    'mesas-de-centro': `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="8" rx="8" ry="3"/><path d="M7 10v8M17 10v8M12 11v9"/></svg>`,
    'mesas-de-noche': `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="6" width="16" height="14" rx="2"/><path d="M4 12h16M11 9h2M11 16h2M12 2v4"/></svg>`,
    'mesas-tv': `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="11" rx="2"/><path d="M17 2l-5 5-5-5M8 21h8M12 18v3"/></svg>`,
    'peinadoras': `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="12" width="18" height="9" rx="1"/><circle cx="12" cy="7" r="4"/><path d="M12 15v3"/></svg>`,
    'poltronas': `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3M4 11v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6M4 15h16M6 19v2M18 19v2"/></svg>`,
    'sillas': `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h10M7 4v8h10V4M6 12h12v4H6zM6 16v5M18 16v5"/></svg>`,
    'sofacamas': `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5M2 13v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5M2 17h20"/></svg>`,
    'sofas': `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 9V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2M2 11v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6M2 15h20M5 19v2M19 19v2"/></svg>`,
    'taburete': `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="6" ry="2"/><path d="M8 7l-2 14M16 7l2 14M7 16h10"/></svg>`,
    'zapateras': `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M7 8h1M11 8h1M15 8h1M7 13h1M11 13h1M15 13h1"/></svg>`
  };

  return icons[categoryId] || icons['todos'];
}

/**
 * Renders the dedicated catalog page HTML structure.
 * @returns {string}
 */
export function renderCatalogPage() {
  const categories = getCatalogCategories();
  const products = getCatalogProducts();
  const activeCategoryObj = categories.find(c => c.id === currentFilter) || categories[0];

  // Mega-menu category buttons in alphabetical order plus Todos.
  const megaMenuCategoriesHTML = categories.map(cat => {
    const isActive = cat.id === currentFilter ? 'active' : '';
    return `
      <button 
        type="button" 
        class="mega-category-card ${isActive}" 
        data-category-id="${escapeHTML(cat.id)}"
        aria-pressed="${cat.id === currentFilter ? 'true' : 'false'}"
      >
        <div class="mega-cat-icon">
          ${getCategoryIcon(cat.id)}
        </div>
        <div class="mega-cat-details">
          <span class="mega-cat-name">${escapeHTML(cat.name)}</span>
          <span class="mega-cat-count">${cat.count} ${cat.count === 1 ? 'pieza' : 'piezas'}</span>
        </div>
        <div class="mega-cat-check">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      </button>
    `;
  }).join('');

  // 4 Top Quick-Access Categories (for instant 1-click filtering)
  const quickAccessList = ['todos', 'sofas', 'comedores', 'dormitorios', 'poltronas'];
  const quickAccessHTML = quickAccessList.map(catId => {
    const cat = categories.find(c => c.id === catId);
    if (!cat) return '';
    const isActive = cat.id === currentFilter ? 'active' : '';
    return `
      <button 
        type="button" 
        class="quick-pill-btn ${isActive}" 
        data-quick-cat="${escapeHTML(cat.id)}"
      >
        ${escapeHTML(cat.name)}
      </button>
    `;
  }).join('');

  return `
    <div class="dedicated-catalog-page">
      <!-- Catalog Page Header -->
      <header class="catalog-page-hero">
        <div class="container">
          <nav class="catalog-breadcrumb" aria-label="Migas de pan">
            <a href="#/" class="breadcrumb-back-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Volver al Inicio</span>
            </a>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-current">Catálogo Exclusivo 2026</span>
          </nav>

          <div class="catalog-hero-content">
            <div class="catalog-hero-brand-mark">
              <img src="/logo.svg" alt="Muebles Bellagio" width="76" height="76">
            </div>
            <h1 class="catalog-hero-title">
              Catálogo de <span class="gold-text">Muebles de Lujo</span>
            </h1>

            <!-- Real-time Search Box -->
            <div class="catalog-search-wrapper">
              <div class="catalog-search-box">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input 
                  type="text" 
                  id="catalogSearchInput" 
                  placeholder="Buscar por nombre, material (mármol, roble, piel...) o medidas..." 
                  autocomplete="off"
                  class="catalog-search-input"
                  aria-label="Buscar en el catálogo"
                />
                <button type="button" id="clearSearchBtn" class="clear-search-btn" aria-label="Limpiar búsqueda" style="display:none;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Option 1: Glassmorphism Mega-Selector Navigation Bar -->
      <section class="mega-filter-bar-wrapper" id="megaFilterBar">
        <div class="container">
          <div class="mega-filter-bar-inner">
            
            <!-- Main Mega-Selector Dropdown Trigger -->
            <div class="mega-selector-trigger-box">
              <button 
                type="button" 
                class="mega-selector-btn" 
                id="megaSelectorToggleBtn" 
                aria-expanded="false" 
                aria-haspopup="dialog"
              >
                <div class="mega-selector-icon">
                  ${getCategoryIcon(activeCategoryObj.id)}
                </div>
                <div class="mega-selector-text">
                  <span class="mega-selector-label">Categoría activa:</span>
                  <strong class="mega-selector-current" id="megaSelectorCurrentName">${escapeHTML(activeCategoryObj.name)}</strong>
                </div>
                <div class="mega-selector-arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </button>

              <!-- Mega Dropdown Curtain with all categories -->
              <div class="mega-dropdown-curtain" id="megaDropdownCurtain">
                <div class="mega-dropdown-header">
                  <div class="mega-dropdown-title-group">
                    <span class="section-tag" style="margin-bottom: 2px;">Directorio de Colecciones</span>
                    <h4>Selecciona una Categoría</h4>
                  </div>
                  <button type="button" class="mega-dropdown-close-btn" id="closeMegaDropdownBtn" aria-label="Cerrar menú de categorías">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>

                <div class="mega-categories-grid" id="megaCategoriesGrid">
                  ${megaMenuCategoriesHTML}
                </div>
              </div>
            </div>

            <!-- Quick Access Pills on Desktop/Tablet -->
            <div class="quick-access-pills-row">
              <span class="quick-access-label">Populares:</span>
              <div class="quick-pills-list" id="quickPillsList">
                ${quickAccessHTML}
              </div>
            </div>

            <!-- Live Results Counter Badge -->
            <div class="catalog-live-count-badge">
              <span id="catalogResultsCount" class="results-badge">Mostrando ${products.length} piezas</span>
            </div>

          </div>
        </div>
      </section>

      <!-- Products Grid Section -->
      <section class="catalog-products-section" aria-label="Listado de Muebles">
        <div class="container">
          <div class="dedicated-catalog-grid" id="dedicatedCatalogGrid">
            ${renderProductCards(getFilteredCatalog())}
          </div>
        </div>
      </section>
    </div>
  `;
}

/**
 * Filters the catalog data by category and search term.
 * @returns {Array}
 */
function getFilteredCatalog() {
  return getCatalogProducts().filter(item => {
    const matchesCategory = currentFilter === 'todos' || item.category === currentFilter;
    const query = currentSearch.toLowerCase().trim();
    const matchesSearch = !query || 
      item.title.toLowerCase().includes(query) ||
      item.subtitle.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.materials.toLowerCase().includes(query) ||
      item.categoryName.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });
}

/**
 * Generates HTML for product cards.
 * @param {Array} items 
 * @returns {string}
 */
function renderProductCards(items) {
  if (!items || items.length === 0) {
    return `
      <div class="catalog-empty-state">
        <div class="empty-icon-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </div>
        <h3>No encontramos piezas para esta búsqueda</h3>
        <p>Prueba seleccionando otra categoría o utilizando términos más generales como "sofa", "mármol" o "roble".</p>
        <button type="button" class="btn btn-primary" id="resetCatalogFiltersBtn">
          Ver Todo el Catálogo
        </button>
      </div>
    `;
  }

  return items.map(item => {
    const isSelected = isProductSelected(item.id);
    const hasVideo = Boolean(extractYouTubeId(item.youtubeUrl));
    const whatsappMsg = encodeURIComponent(
      `Hola Muebles Bellagio, deseo información y cotización de la pieza: "${item.title}" (${item.categoryName}).`
    );

    return `
      <article class="luxury-card product-card ${isSelected ? 'product-selected' : ''}" data-product-id="${escapeHTML(item.id)}">
        <div class="product-image-box">
          <img 
            src="${escapeHTML(getOptimizedImageUrl(item.image, 720, 540))}"
            alt="${escapeHTML(item.title)}" 
            class="product-img"
            loading="lazy"
            width="400"
            height="300"
          />
          ${hasVideo ? `
            <button type="button" class="product-video-button" data-video-product-id="${escapeHTML(item.id)}" aria-label="Ver video de ${escapeHTML(item.title)}" title="Ver video del producto">
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.14v13.72a1 1 0 0 0 1.53.85l10.04-6.86a1.03 1.03 0 0 0 0-1.7L9.53 4.29A1 1 0 0 0 8 5.14Z"></path></svg>
            </button>
          ` : ''}
          
          <!-- Interactive Luxury Checkmark Selection Button -->
          <button 
            type="button" 
            class="product-select-check ${isSelected ? 'checked' : ''}" 
            data-select-id="${escapeHTML(item.id)}"
            aria-label="${isSelected ? 'Quitar de mi selección' : 'Añadir a mi selección'}"
            title="${isSelected ? 'Quitar de mi selección' : 'Añadir a mi selección'}"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>
        </div>

        <div class="product-info">
          <div class="product-copy">
            <h3 class="product-title">${escapeHTML(item.title)}</h3>
            <p class="product-subtitle">${escapeHTML(item.subtitle)}</p>
          </div>
          <div class="product-card-actions">
            <button 
              type="button" 
              class="btn btn-secondary btn-sm open-details-btn" 
              data-product-id="${escapeHTML(item.id)}"
              aria-label="Ver ficha técnica de ${escapeHTML(item.title)}"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"></path>
                <circle cx="12" cy="12" r="2.5"></circle>
              </svg>
              Detalle
            </button>

            <button 
              type="button" 
              class="btn btn-outline-gold btn-sm toggle-select-btn" 
              data-select-id="${escapeHTML(item.id)}"
              aria-label="${isSelected ? 'Quitar de la consulta' : 'Añadir a la consulta'}"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span>${isSelected ? 'Seleccionado ✓' : 'Consultar'}</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

/**
 * Initializes interactive events for the Option 1 Mega-Selector dropdown and filters.
 */
export function setupCatalogPageEvents() {
  const searchInput = document.getElementById('catalogSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const gridContainer = document.getElementById('dedicatedCatalogGrid');
  const resultsBadge = document.getElementById('catalogResultsCount');

  // Mega-selector elements
  const megaToggleBtn = document.getElementById('megaSelectorToggleBtn');
  const megaCurtain = document.getElementById('megaDropdownCurtain');
  const closeCurtainBtn = document.getElementById('closeMegaDropdownBtn');
  const megaCategoriesGrid = document.getElementById('megaCategoriesGrid');
  const currentCategoryNameEl = document.getElementById('megaSelectorCurrentName');
  const quickPillsList = document.getElementById('quickPillsList');

  // Toggle Mega-Curtain
  function toggleMegaCurtain(forceOpen) {
    if (!megaCurtain || !megaToggleBtn) return;
    const shouldOpen = typeof forceOpen === 'boolean' 
      ? forceOpen 
      : !megaCurtain.classList.contains('open');

    megaCurtain.classList.toggle('open', shouldOpen);
    megaToggleBtn.classList.toggle('active', shouldOpen);
    megaToggleBtn.setAttribute('aria-expanded', String(shouldOpen));
  }

  // Update UI and active states
  function applyFilter(categoryId) {
    currentFilter = categoryId;
    const categories = getCatalogCategories();
    const categoryObj = categories.find(c => c.id === categoryId) || categories[0];

    // Update Mega-Selector trigger text and icon
    if (currentCategoryNameEl) {
      currentCategoryNameEl.textContent = categoryObj.name;
    }
    const iconContainer = megaToggleBtn?.querySelector('.mega-selector-icon');
    if (iconContainer) {
      iconContainer.innerHTML = getCategoryIcon(categoryId);
    }

    // Update active state in Mega-Menu cards
    megaCategoriesGrid?.querySelectorAll('.mega-category-card').forEach(card => {
      const isCurrent = card.getAttribute('data-category-id') === categoryId;
      card.classList.toggle('active', isCurrent);
      card.setAttribute('aria-pressed', isCurrent ? 'true' : 'false');
    });

    // Update active state in quick pills
    quickPillsList?.querySelectorAll('.quick-pill-btn').forEach(pill => {
      const isCurrent = pill.getAttribute('data-quick-cat') === categoryId;
      pill.classList.toggle('active', isCurrent);
    });

    // Refresh Product Grid
    refreshGrid();

    // Close Mega-Curtain smoothly
    toggleMegaCurtain(false);
  }

  function refreshGrid() {
    const filtered = getFilteredCatalog();
    if (gridContainer) {
      gridContainer.innerHTML = renderProductCards(filtered);
    }
    if (resultsBadge) {
      resultsBadge.textContent = `Mostrando ${filtered.length} piezas`;
    }
  }

  // Mega-selector trigger button click
  megaToggleBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMegaCurtain();
  });

  // Close button inside curtain
  closeCurtainBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMegaCurtain(false);
  });

  // Category card click inside Mega-Curtain
  megaCategoriesGrid?.addEventListener('click', (e) => {
    const card = e.target.closest('.mega-category-card');
    if (!card) return;
    const catId = card.getAttribute('data-category-id');
    if (catId) {
      applyFilter(catId);
    }
  });

  // Quick pills click
  quickPillsList?.addEventListener('click', (e) => {
    const pill = e.target.closest('.quick-pill-btn');
    if (!pill) return;
    const catId = pill.getAttribute('data-quick-cat');
    if (catId) {
      applyFilter(catId);
    }
  });

  // Close curtain when clicking outside
  document.addEventListener('click', (e) => {
    if (megaCurtain?.classList.contains('open')) {
      const insideSelector = e.target.closest('.mega-selector-trigger-box');
      if (!insideSelector) {
        toggleMegaCurtain(false);
      }
    }
  });

  // Search input live filtering
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      if (clearSearchBtn) {
        clearSearchBtn.style.display = currentSearch.length > 0 ? 'flex' : 'none';
      }
      refreshGrid();
    });
  }

  // Clear search button
  if (clearSearchBtn && searchInput) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      currentSearch = '';
      clearSearchBtn.style.display = 'none';
      searchInput.focus();
      refreshGrid();
    });
  }

  // Reset filters button in empty state
  if (gridContainer) {
    gridContainer.addEventListener('click', (e) => {
      if (e.target.closest('#resetCatalogFiltersBtn')) {
        currentSearch = '';
        if (searchInput) searchInput.value = '';
        if (clearSearchBtn) clearSearchBtn.style.display = 'none';
        applyFilter('todos');
      }

      // Toggle product selection (Checkmark or Consultar button)
      const selectBtn = e.target.closest('.product-select-check, .toggle-select-btn');
      if (selectBtn) {
        e.preventDefault();
        e.stopPropagation();
        const productId = selectBtn.getAttribute('data-select-id');
        if (productId) {
          const isNowSelected = toggleProductSelection(productId);
          
          // Update the button text if it's the action button
          const card = selectBtn.closest('.product-card');
          if (card) {
            const actionBtnText = card.querySelector('.toggle-select-btn span');
            if (actionBtnText) {
              actionBtnText.textContent = isNowSelected ? 'Seleccionado ✓' : 'Consultar';
            }
          }
        }
        return;
      }

      // Open details modal
      const videoBtn = e.target.closest('.product-video-button');
      if (videoBtn) {
        const product = getCatalogProducts().find(p => p.id === videoBtn.getAttribute('data-video-product-id'));
        if (product) openProductVideo(product);
        return;
      }

      const detailsBtn = e.target.closest('.open-details-btn');
      if (detailsBtn) {
        const productId = detailsBtn.getAttribute('data-product-id');
        const product = getCatalogProducts().find(p => p.id === productId);
        if (product) {
          openProductModal(product);
        }
      }
    });
  }
}
