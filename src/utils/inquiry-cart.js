/**
 * @file inquiry-cart.js
 * @description State manager and UI for the WhatsApp Inquiry Cart (Option 3: Inline Select & Review).
 * Allows customers to select products of interest and send a consolidated inquiry via WhatsApp.
 */

import { getCatalogProducts } from '../services/catalog-store.js';
import { escapeHTML } from '../utils/security.js';
import { getOptimizedImageUrl } from './image-optimization.js';

/** @type {Set<string>} Selected product IDs */
const selectedProducts = new Set();

/** WhatsApp number for Bellagio */
const WHATSAPP_NUMBER = '584141536516';

/**
 * Toggles a product's selection state.
 * @param {string} productId 
 * @returns {boolean} Whether the product is now selected
 */
export function toggleProductSelection(productId) {
  if (selectedProducts.has(productId)) {
    selectedProducts.delete(productId);
  } else {
    selectedProducts.add(productId);
  }

  updateProductCardStates();
  updateFAB();
  return selectedProducts.has(productId);
}

/**
 * Returns the current count of selected products.
 * @returns {number}
 */
export function getSelectionCount() {
  return selectedProducts.size;
}

/**
 * Checks if a product is selected.
 * @param {string} productId
 * @returns {boolean}
 */
export function isProductSelected(productId) {
  return selectedProducts.has(productId);
}

/**
 * Clears all selections.
 */
export function clearAllSelections() {
  selectedProducts.clear();
  updateProductCardStates();
  updateFAB();
}

/**
 * Updates the visual state of all product cards based on selection.
 */
function updateProductCardStates() {
  document.querySelectorAll('.product-card').forEach(card => {
    const id = card.getAttribute('data-product-id');
    if (!id) return;
    const isSelected = selectedProducts.has(id);
    card.classList.toggle('product-selected', isSelected);

    const checkbox = card.querySelector('.product-select-check');
    if (checkbox) {
      checkbox.classList.toggle('checked', isSelected);
      checkbox.setAttribute('aria-checked', String(isSelected));
    }
  });
}

/**
 * Updates the Floating Action Button visibility and count.
 */
function updateFAB() {
  const fab = document.getElementById('inquiryCartFAB');
  if (!fab) return;

  const count = selectedProducts.size;
  const badge = fab.querySelector('.fab-count-badge');

  if (count > 0) {
    fab.classList.add('visible');
    if (badge) badge.textContent = String(count);
    // Bounce animation on update
    fab.classList.remove('fab-bounce');
    void fab.offsetWidth; // Force reflow
    fab.classList.add('fab-bounce');
  } else {
    fab.classList.remove('visible');
  }
}

/**
 * Renders the FAB button HTML (injected into the page shell).
 * @returns {string}
 */
export function renderInquiryFAB() {
  return `
    <button 
      type="button" 
      class="inquiry-cart-fab" 
      id="inquiryCartFAB" 
      aria-label="Ver mi selección de productos"
      title="Ver mi selección"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
      </svg>
      <span class="fab-count-badge">0</span>
    </button>
  `;
}

/**
 * Renders the full-screen Review Modal HTML.
 * @returns {string}
 */
export function renderInquiryModal() {
  return `
    <div class="inquiry-modal-backdrop" id="inquiryModalBackdrop" role="dialog" aria-modal="true" aria-label="Resumen de selección">
      <div class="inquiry-modal-container">
        
        <!-- Modal Header -->
        <header class="inquiry-modal-header">
          <div class="inquiry-modal-header-text">
            <h2>Tu Selección Personal</h2>
            <p id="inquiryModalCount">0 piezas seleccionadas</p>
          </div>
          <button type="button" class="inquiry-modal-close-btn" id="closeInquiryModalBtn" aria-label="Cerrar">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>

        <!-- Modal Body -->
        <div class="inquiry-modal-body" id="inquiryModalBody">
          <!-- Populated dynamically -->
        </div>

        <!-- Modal Footer -->
        <footer class="inquiry-modal-footer">
          <div class="inquiry-modal-footer-left">
            <button type="button" class="btn btn-secondary btn-sm" id="clearAllSelectionsBtn">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Vaciar Lista
            </button>
          </div>

          <!-- Optional message textarea -->
          <div class="inquiry-message-box">
            <textarea 
              id="inquiryCustomMessage" 
              class="inquiry-textarea" 
              placeholder="Mensaje adicional (opcional): medidas, colores, presupuesto..."
              rows="2"
              maxlength="500"
            ></textarea>
          </div>

          <a 
            href="#" 
            class="btn btn-whatsapp btn-lg inquiry-send-btn" 
            id="sendInquiryWhatsAppBtn"
            target="_blank" 
            rel="noopener noreferrer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-5.805 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
            </svg>
            <span>Consultar Disponibilidad y Precios</span>
          </a>
        </footer>
      </div>
    </div>
  `;
}

/**
 * Populates the modal body with the selected products grid and generates the WhatsApp link.
 */
function populateModal() {
  const body = document.getElementById('inquiryModalBody');
  const countEl = document.getElementById('inquiryModalCount');
  const sendBtn = document.getElementById('sendInquiryWhatsAppBtn');

  if (!body) return;

  const selected = getCatalogProducts().filter(p => selectedProducts.has(p.id));

  if (countEl) {
    countEl.textContent = `${selected.length} ${selected.length === 1 ? 'pieza seleccionada' : 'piezas seleccionadas'}`;
  }

  if (selected.length === 0) {
    body.innerHTML = `
      <div class="inquiry-empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
        <h3>Aún no has seleccionado piezas</h3>
        <p>Regresa al catálogo y marca las piezas que te interesen tocando el ícono <strong>☑</strong> en cada producto.</p>
      </div>
    `;
    if (sendBtn) sendBtn.style.display = 'none';
    return;
  }

  if (sendBtn) sendBtn.style.display = 'inline-flex';

  body.innerHTML = `
    <div class="inquiry-products-grid">
      ${selected.map(item => `
        <div class="inquiry-product-card" data-remove-id="${escapeHTML(item.id)}">
          <div class="inquiry-product-img-box">
            <img src="${escapeHTML(getOptimizedImageUrl(item.image, 240, 180))}" alt="${escapeHTML(item.title)}" loading="lazy" width="200" height="150" />
            <button type="button" class="inquiry-remove-btn" data-remove-id="${escapeHTML(item.id)}" aria-label="Quitar ${escapeHTML(item.title)}">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="inquiry-product-info">
            <span class="inquiry-product-category">${escapeHTML(item.categoryName)}</span>
            <h4>${escapeHTML(item.title)}</h4>
            <p>${escapeHTML(item.materials)}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  // Generate WhatsApp URL
  updateWhatsAppLink();
}

/**
 * Generates and updates the WhatsApp link with the selected products list.
 */
function updateWhatsAppLink() {
  const sendBtn = document.getElementById('sendInquiryWhatsAppBtn');
  const customMessageEl = document.getElementById('inquiryCustomMessage');
  if (!sendBtn) return;

  const selected = getCatalogProducts().filter(p => selectedProducts.has(p.id));
  const customMessage = customMessageEl?.value?.trim() || '';

  let message = `✨ *Consulta de Productos - Muebles Bellagio*\n\n`;
  message += `Hola, estoy interesado/a en las siguientes piezas:\n\n`;

  selected.forEach((item, i) => {
    message += `${i + 1}. *${item.title}*\n`;
    message += `   📂 ${item.categoryName} | 📐 ${item.dimensions}\n\n`;
  });

  message += `Total: ${selected.length} ${selected.length === 1 ? 'pieza' : 'piezas'}\n`;

  if (customMessage) {
    message += `\n💬 Mensaje adicional: ${customMessage}\n`;
  }

  message += `\nDeseo información de disponibilidad, precios y opciones de entrega. ¡Gracias!`;

  sendBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Opens the inquiry modal.
 */
function openInquiryModal() {
  const backdrop = document.getElementById('inquiryModalBackdrop');
  if (!backdrop) return;

  populateModal();
  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

/**
 * Closes the inquiry modal.
 */
function closeInquiryModal() {
  const backdrop = document.getElementById('inquiryModalBackdrop');
  if (!backdrop) return;

  backdrop.classList.remove('open');
  document.body.style.overflow = '';
}

/**
 * Sets up all event listeners for the Inquiry Cart system.
 * Called once from main.js after the app shell is rendered.
 */
export function setupInquiryCartEvents() {
  // FAB click → open modal
  const fab = document.getElementById('inquiryCartFAB');
  fab?.addEventListener('click', openInquiryModal);

  // Close modal
  const closeBtn = document.getElementById('closeInquiryModalBtn');
  closeBtn?.addEventListener('click', closeInquiryModal);

  // Close on backdrop click
  const backdrop = document.getElementById('inquiryModalBackdrop');
  backdrop?.addEventListener('click', (e) => {
    if (e.target === backdrop) closeInquiryModal();
  });

  // Clear all
  const clearBtn = document.getElementById('clearAllSelectionsBtn');
  clearBtn?.addEventListener('click', () => {
    clearAllSelections();
    populateModal();
  });

  // Remove individual product from modal
  const modalBody = document.getElementById('inquiryModalBody');
  modalBody?.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.inquiry-remove-btn');
    if (removeBtn) {
      const id = removeBtn.getAttribute('data-remove-id');
      if (id) {
        toggleProductSelection(id);
        populateModal();
      }
    }
  });

  // Update WhatsApp link when custom message changes
  const customMsg = document.getElementById('inquiryCustomMessage');
  customMsg?.addEventListener('input', updateWhatsAppLink);

  // ESC key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop?.classList.contains('open')) {
      closeInquiryModal();
    }
  });
}
