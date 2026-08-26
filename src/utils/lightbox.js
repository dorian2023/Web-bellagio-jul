/**
 * @file lightbox.js
 * @description Interactive visual modal/lightbox for detailed catalog exploration and inquiry.
 */

import { CATALOGS_DATA } from '../data/catalogs.js';
import { escapeHTML } from './security.js';

let modalElement = null;

/**
 * Initializes the modal container into the DOM and sets up listeners.
 */
export function initLightbox() {
  if (document.getElementById('catalogModal')) return;

  const modalHTML = `
    <div id="catalogModal" class="modal-overlay" role="dialog" aria-modal="true" aria-hidden="true">
      <div class="modal-content">
        <button type="button" class="modal-close-btn" id="modalCloseBtn" aria-label="Cerrar ventana">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div id="modalBody" class="modal-inner-grid">
          <!-- Injected dynamically -->
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
  modalElement = document.getElementById('catalogModal');

  // Close handlers
  document.getElementById('modalCloseBtn')?.addEventListener('click', closeModal);
  
  modalElement?.addEventListener('click', (e) => {
    // If clicked on backdrop or on any element with data-action="close-modal"
    if (e.target === modalElement || (e.target instanceof Element && e.target.closest('[data-action="close-modal"]'))) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalElement?.classList.contains('active')) {
      closeModal();
    }
  });

  // Ensure scroll is free initially
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
}

/**
 * Opens the lightbox modal with specific catalog details.
 * @param {string|object} productOrId 
 */
export function openProductModal(productOrId) {
  const item = typeof productOrId === 'string' 
    ? CATALOGS_DATA.find(c => c.id === productOrId)
    : productOrId;
  if (!item || !modalElement) return;

  openCatalogModal(item.id);
}

export function openCatalogModal(catalogId) {
  const item = CATALOGS_DATA.find(c => c.id === catalogId);
  if (!item || !modalElement) return;

  const modalBody = document.getElementById('modalBody');
  if (!modalBody) return;

  const colorsHTML = item.availableColors.map(c => `
    <span style="display:inline-block; font-size:0.8rem; background:rgba(197,165,90,0.15); border:1px solid rgba(197,165,90,0.3); color:var(--gold-400); padding:3px 10px; border-radius:9999px; font-weight:600;">
      ${escapeHTML(c)}
    </span>
  `).join(' ');

  const whatsappMessage = encodeURIComponent(`Hola Muebles Bellagio, deseo consultar disponibilidad y precio de la ${item.title} (${item.categoryName}).`);

  modalBody.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--space-8); padding: var(--space-8);">
      <div style="border-radius: var(--radius-md); overflow: hidden; background: #000; border: 1px solid var(--color-border); max-height: 420px;">
        <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.title)}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy" />
      </div>
      <div style="display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <span class="section-tag" style="margin-bottom: var(--space-3);">${escapeHTML(item.categoryName)}</span>
          <h3 style="font-size: 1.85rem; margin-bottom: var(--space-2);">${escapeHTML(item.title)}</h3>
          <p style="color: var(--gold-400); font-weight: 600; font-size: 1rem; margin-bottom: var(--space-4);">${escapeHTML(item.subtitle)}</p>
          <p style="margin-bottom: var(--space-5); font-size: 0.95rem;">${escapeHTML(item.description)}</p>
          
          <div style="background: var(--color-bg-surface); padding: var(--space-4); border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle); margin-bottom: var(--space-5);">
            <p style="font-size: 0.85rem; margin-bottom: 6px;"><strong style="color: var(--color-text-primary);">Materiales:</strong> ${escapeHTML(item.materials)}</p>
            <p style="font-size: 0.85rem; margin-bottom: 8px;"><strong style="color: var(--color-text-primary);">Dimensiones:</strong> ${escapeHTML(item.dimensions)}</p>
            <div>
              <strong style="color: var(--color-text-primary); font-size: 0.85rem; display:block; margin-bottom: 4px;">Colores & Acabados:</strong>
              <div style="display:flex; flex-wrap:wrap; gap:6px;">${colorsHTML}</div>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: var(--space-3); flex-wrap: wrap; margin-top: var(--space-4);">
          <a href="https://wa.me/584141536516?text=${whatsappMessage}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp" style="flex: 1;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-5.805 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
            </svg>
            Consultar por WhatsApp
          </a>
          <button type="button" class="btn btn-secondary" data-action="close-modal">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  `;

  modalElement.classList.add('active');
  modalElement.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

/**
 * Closes the modal and completely restores window scrolling.
 */
export function closeModal() {
  if (!modalElement) return;
  modalElement.classList.remove('active');
  modalElement.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
}
