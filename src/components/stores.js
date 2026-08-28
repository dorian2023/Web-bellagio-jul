/**
 * @file stores.js
 * @description Stores & Showrooms section presentation component for Caracas locations.
 */

import { STORES_DATA } from '../data/stores.js';
import { escapeHTML } from '../utils/security.js';

export function renderStores() {
  const storeCardsHTML = STORES_DATA.map((store, index) => {
    const delayClass = `reveal-delay-${(index % 3) + 1}`;

    const videoHTML = store.videoUrl ? `
      <div class="store-video-container">
        <video 
          data-src="${escapeHTML(store.videoUrl)}" 
          poster="${escapeHTML(store.posterUrl || '/images/hero-poster.jpg')}"
          class="store-video-media lazy-video" 
          loop 
          muted 
          playsinline 
          webkit-playsinline="true"
          preload="none"
          aria-label="Video del showroom ${escapeHTML(store.name)}"
        ></video>
      </div>
    ` : '';

    const featuresList = store.features.map(f => `
      <li style="display:flex; align-items:center; gap:6px; font-size:0.8rem; color:var(--gold-400);">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span style="color:var(--color-text-secondary);">${escapeHTML(f)}</span>
      </li>
    `).join('');

    const storeWhatsAppMsg = encodeURIComponent(`Hola Muebles Bellagio, deseo información de la tienda ${store.name}.`);

    return `
      <article class="luxury-card store-card reveal-item ${delayClass}">
        <div class="store-header">
          <div class="store-number-badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <span style="font-size:0.75rem; background:var(--badge-bg); color:var(--badge-text); border:1px solid var(--badge-border); padding:2px 8px; border-radius:var(--radius-full); font-weight:600;">
            ${escapeHTML(store.badge)}
          </span>
        </div>

        ${videoHTML}

        <h3 class="store-title">${escapeHTML(store.name)}</h3>

        <ul class="store-info-list">
          <li class="store-info-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <div>
              <strong>${escapeHTML(store.address)}</strong>
              <div style="font-size:0.8rem; color:var(--color-text-muted); margin-top:2px;">${escapeHTML(store.landmark)}</div>
            </div>
          </li>

          <li class="store-info-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>${escapeHTML(store.schedule)}</span>
          </li>

          <li class="store-info-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <a href="tel:${escapeHTML(store.mobile)}" style="color:var(--color-text-secondary);">${escapeHTML(store.mobile)}</a>
          </li>
        </ul>

        <div style="margin-bottom: var(--space-4);">
          <ul style="list-style:none; display:flex; flex-direction:column; gap:4px;">
            ${featuresList}
          </ul>
        </div>

        <div class="store-actions">
          <a href="${escapeHTML(store.mapsUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" aria-label="Ver ubicación en Google Maps">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
            </svg>
            Cómo Llegar
          </a>
          <a href="https://wa.me/${escapeHTML(store.whatsapp)}?text=${storeWhatsAppMsg}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm" aria-label="Escribir por WhatsApp a esta tienda">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-5.805 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
            </svg>
            Consultar
          </a>
        </div>
      </article>
    `;
  }).join('');

  return `
    <section id="tiendas" class="section-wrapper" aria-label="Nuestras Tiendas en Caracas">
      <div class="container">
        <header class="section-header reveal-item">
          <span class="section-tag">Presencia en Caracas</span>
          <h2 class="section-title">
            Nuestras <span class="gold-text">Tiendas</span>
          </h2>
          <p class="section-subtitle">
            Descubre nuestras exclusivas exhibiciones y recibe asesoría de interioristas certificados en nuestras sedes de Caracas.
          </p>
        </header>

        <div class="stores-grid">
          ${storeCardsHTML}
        </div>
      </div>
    </section>
  `;
}
