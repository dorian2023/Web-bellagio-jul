/**
 * @file lightbox.js
 * @description Interactive visual modal/lightbox for detailed catalog exploration and inquiry.
 */

import { getCatalogProduct } from '../services/catalog-store.js';
import { escapeHTML } from './security.js';
import { getOptimizedImageUrl } from './image-optimization.js';
import { getYouTubeEmbedUrl, getYouTubeThumbnailUrl } from './media.js';

let modalElement = null;
let videoModalElement = null;
let lastFocusedElement = null;

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
  document.body.insertAdjacentHTML('beforeend', `
    <div id="productVideoModal" class="modal-overlay video-modal-overlay" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="productVideoTitle">
      <div class="video-modal-content">
        <button type="button" class="modal-close-btn" id="productVideoCloseBtn" aria-label="Cerrar video">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <div id="productVideoBody"></div>
      </div>
    </div>
  `);
  videoModalElement = document.getElementById('productVideoModal');

  // Close handlers
  document.getElementById('modalCloseBtn')?.addEventListener('click', closeModal);
  document.getElementById('productVideoCloseBtn')?.addEventListener('click', closeProductVideo);
  videoModalElement?.addEventListener('click', event => {
    const loadButton = event.target.closest('[data-video-load]');
    if (loadButton) {
      const frameShell = loadButton.closest('.video-frame-shell');
      const embedUrl = loadButton.dataset.videoEmbed;
      const title = loadButton.dataset.videoTitle || 'Video del producto';
      if (frameShell && embedUrl) {
        frameShell.innerHTML = `<iframe src="${escapeHTML(embedUrl)}" title="Video de ${escapeHTML(title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
      }
      return;
    }
    const ratioButton = event.target.closest('.video-ratio-toggle');
    if (!ratioButton) return;
    const isPortrait = videoModalElement.classList.toggle('is-portrait');
    ratioButton.textContent = isPortrait ? 'Formato horizontal 16:9' : 'Formato vertical 9:16';
    ratioButton.setAttribute('aria-pressed', String(isPortrait));
  });

  modalElement?.addEventListener('click', event => {
    const galleryButton = event.target.closest('[data-gallery-image]');
    if (galleryButton) {
      const image = document.getElementById('modalProductImage');
      if (image) image.src = galleryButton.dataset.galleryImage;
      modalElement.querySelectorAll('[data-gallery-image]').forEach(button => button.classList.remove('active'));
      galleryButton.classList.add('active');
      return;
    }

    const imageStage = event.target.closest('[data-image-action="toggle-zoom"]');
    if (imageStage) imageStage.classList.toggle('is-zoomed');
  });
  
  modalElement?.addEventListener('click', (e) => {
    // If clicked on backdrop or on any element with data-action="close-modal"
    if (e.target === modalElement || (e.target instanceof Element && e.target.closest('[data-action="close-modal"]'))) {
      closeModal();
    }
  });
  videoModalElement?.addEventListener('click', event => {
    if (event.target === videoModalElement) closeProductVideo();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModalElement?.classList.contains('active')) {
      closeProductVideo();
    } else if (e.key === 'Escape' && modalElement?.classList.contains('active')) {
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
    ? getCatalogProduct(productOrId)
    : productOrId;
  if (!item || !modalElement) return;

  openCatalogModal(item.id);
}

export function openCatalogModal(catalogId) {
  const item = getCatalogProduct(catalogId);
  if (!item || !modalElement) return;

  lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

  const modalBody = document.getElementById('modalBody');
  if (!modalBody) return;

  const colorsHTML = item.availableColors.map(c => `
    <span style="display:inline-block; font-size:0.8rem; background:rgba(197,165,90,0.15); border:1px solid rgba(197,165,90,0.3); color:var(--gold-400); padding:3px 10px; border-radius:9999px; font-weight:600;">
      ${escapeHTML(c)}
    </span>
  `).join(' ');

  const whatsappMessage = encodeURIComponent(`Hola Muebles Bellagio, deseo consultar disponibilidad y precio de la ${item.title} (${item.categoryName}).`);
  const galleryImages = [item.image, ...(item.galleryImages || [])].filter(Boolean);
  const galleryHTML = galleryImages.length > 1 ? `
    <div class="modal-gallery-strip" aria-label="Galería de imágenes">
      ${galleryImages.map((image, index) => `
        <button type="button" class="modal-gallery-thumb ${index === 0 ? 'active' : ''}" data-gallery-image="${escapeHTML(getOptimizedImageUrl(image, 240, 180, 78, 'contain'))}" aria-label="Ver imagen ${index + 1}">
          <img src="${escapeHTML(getOptimizedImageUrl(image, 240, 180, 78, 'contain'))}" alt="" loading="lazy">
        </button>
      `).join('')}
    </div>
  ` : '';

  modalBody.innerHTML = `
    <div class="product-modal-layout">
      <div class="modal-visual-column">
        <button type="button" class="modal-image-stage" data-image-action="toggle-zoom" aria-label="Ampliar imagen de ${escapeHTML(item.title)}">
          <img id="modalProductImage" src="${escapeHTML(getOptimizedImageUrl(item.image, 1200, 900, 86, 'contain'))}" alt="${escapeHTML(item.title)}" loading="eager" />
          <span class="modal-image-hint">Pasa el cursor para ampliar</span>
        </button>
        ${galleryHTML}
      </div>
      <div class="modal-product-details">
        <div>
          <span class="modal-product-category">${escapeHTML(item.categoryName)}</span>
          <h3 class="modal-product-title">${escapeHTML(item.title)}</h3>
          <p class="modal-product-subtitle">${escapeHTML(item.subtitle)}</p>
          <p class="modal-product-description">${escapeHTML(item.description)}</p>
          
          <div class="modal-specs-panel">
            <div class="modal-spec-row"><span>Materiales</span><strong>${escapeHTML(item.materials)}</strong></div>
            <div class="modal-spec-row"><span>Dimensiones</span><strong>${escapeHTML(item.dimensions)}</strong></div>
            <div class="modal-color-block">
              <span>Colores & Acabados</span>
              <div class="modal-color-list">${colorsHTML}</div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <a href="https://wa.me/584141536516?text=${whatsappMessage}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-5.805 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
            </svg>
            Consultar por WhatsApp
          </a>
          <button type="button" class="btn btn-secondary" data-action="close-modal">Cerrar</button>
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
  const focusedElement = document.activeElement;
  if (focusedElement instanceof HTMLElement && modalElement.contains(focusedElement)) {
    focusedElement.blur();
  }
  modalElement.classList.remove('active');
  modalElement.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
  lastFocusedElement?.focus?.();
  lastFocusedElement = null;
}

export function openProductVideo(productOrId) {
  const item = typeof productOrId === 'string' ? getCatalogProduct(productOrId) : productOrId;
  if (!item || !getYouTubeEmbedUrl(item.youtubeUrl, false) || !videoModalElement) return;

  const videoBody = document.getElementById('productVideoBody');
  if (!videoBody) return;
  const startsPortrait = /youtube\.com\/shorts\//i.test(item.youtubeUrl || '');
  videoModalElement.classList.toggle('is-portrait', startsPortrait);
  const thumbnailUrl = getYouTubeThumbnailUrl(item.youtubeUrl);
  const embedUrlWithAutoplay = getYouTubeEmbedUrl(item.youtubeUrl, true);
  videoBody.innerHTML = `
    <span class="modal-product-category">Video del producto</span>
    <h2 id="productVideoTitle">${escapeHTML(item.title)}</h2>
    <div class="video-frame-shell">
      <button type="button" class="video-load-button" data-video-load data-video-embed="${escapeHTML(embedUrlWithAutoplay)}" data-video-title="${escapeHTML(item.title)}" aria-label="Reproducir video de ${escapeHTML(item.title)}">
        <img src="${escapeHTML(thumbnailUrl)}" alt="Vista previa del video de ${escapeHTML(item.title)}" loading="eager">
        <span class="video-load-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v13.72a1 1 0 0 0 1.53.85l10.04-6.86a1.03 1.03 0 0 0 0-1.7L9.53 4.29A1 1 0 0 0 8 5.14Z"></path></svg></span>
        <span class="video-load-label">Reproducir video</span>
      </button>
    </div>
    <button type="button" class="video-ratio-toggle" aria-pressed="${startsPortrait}">${startsPortrait ? 'Formato horizontal 16:9' : 'Formato vertical 9:16'}</button>
  `;
  videoModalElement.classList.add('active');
  videoModalElement.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  document.getElementById('productVideoCloseBtn')?.focus();
}

export function closeProductVideo() {
  if (!videoModalElement) return;
  videoModalElement.classList.remove('active');
  videoModalElement.setAttribute('aria-hidden', 'true');
  const videoBody = document.getElementById('productVideoBody');
  if (videoBody) videoBody.innerHTML = '';
  if (!modalElement?.classList.contains('active')) {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }
}
