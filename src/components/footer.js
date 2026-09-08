import { STORES_DATA } from '../data/stores.js';
import { escapeHTML } from '../utils/security.js';

/**
 * @file footer.js
 * @description Luxury footer presentation component with site links, brand story, circular logo, and social media.
 */

export function renderFooter() {
  const currentYear = new Date().getFullYear();

  return `
    <footer class="footer" role="contentinfo">
      <div class="container">
        <div class="footer-grid">

            <p>
              Diseño, fabricación y distribución de mobiliario de alta gama en Caracas, Venezuela. Pasión por los detalles y el confort premium.
            </p>
            <div class="footer-social-links">
              <!-- Instagram -->
              <a href="https://www.instagram.com/mueblesbellagio/" target="_blank" rel="noopener noreferrer" class="btn-icon" aria-label="Instagram de Bellagio">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <!-- Facebook -->
              <a href="https://www.facebook.com/mueblesbellagiostore/" target="_blank" rel="noopener noreferrer" class="btn-icon" aria-label="Facebook de Bellagio">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@mueblesbellagio" target="_blank" rel="noopener noreferrer" class="btn-icon" aria-label="TikTok de Bellagio">
                <svg width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
              </a>
              <!-- WhatsApp -->
              <a href="https://wa.me/584141536516" target="_blank" rel="noopener noreferrer" class="btn-icon" aria-label="WhatsApp directo">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-5.805 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Col 2: Navigation -->
          <div>
            <h4 class="footer-col-title">Navegación</h4>
            <ul class="footer-links">
              <li><a href="#inicio">Inicio</a></li>
              <li><a href="#tiendas">Nuestras Tiendas</a></li>
              <li><a href="#catalogos">Catálogos & Colecciones</a></li>
              <li><a href="#contactanos">Contáctanos</a></li>
            </ul>
          </div>

          <!-- Col 3: Categorías -->
          <div>
            <h4 class="footer-col-title">Colecciones</h4>
            <ul class="footer-links">
              <li><a href="#catalogos">Salas & Sofás</a></li>
              <li><a href="#catalogos">Comedores de Lujo</a></li>
              <li><a href="#catalogos">Recámaras Master</a></li>
              <li><a href="#catalogos">Línea Ejecutiva</a></li>
            </ul>
          </div>

          <!-- Col 4: Contact info -->
          <div>
            <h4 class="footer-col-title">Sede Caracas</h4>
            <p style="font-size: 0.9rem; margin-bottom: var(--space-3); color: var(--color-text-secondary);">
              Av. Comercio, Caracas, Distrito Capital, Venezuela.
            </p>
            <p style="font-size: 0.9rem; color: var(--gold-400); font-weight: 600; margin-bottom: 2px;">
              WhatsApp: +58 414 1536516
            </p>
            <p style="font-size: 0.85rem; color: var(--color-text-muted);">
              ${escapeHTML(STORES_DATA[0].schedule)}
            </p>
          </div>
        </div>

        <!-- Bottom Copyright -->
        <div class="footer-bottom">
          <p>© ${currentYear} Muebles Bellagio C.A. Todos los derechos reservados.</p>
          <p style="color: var(--color-text-muted); font-size: 0.8rem;">
            Diseñado con estándares de alta ingeniería y lujo contemporáneo.
          </p>
        </div>
      </div>
    </footer>
  `;
}
