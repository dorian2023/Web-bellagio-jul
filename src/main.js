/**
 * @file main.js
 * @description Main application entry point for Muebles Bellagio with SPA routing.
 */

import './styles/main.css';

import { renderNavbar, setupNavbarEvents } from './components/navbar.js';
import { renderScrollTopButton } from './components/scroll-top.js';
import { renderWhatsAppWidget } from './components/whatsapp-widget.js';
import { renderFooter } from './components/footer.js';

import { initTheme } from './utils/theme.js';
import { initScrollEffects } from './utils/scroll.js';
import { initLightbox } from './utils/lightbox.js';
import { initRouter } from './utils/router.js';

/**
 * Bootstraps the application.
 */
function initApp() {
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  // Build semantic application shell
  appContainer.innerHTML = `
    <a href="#inicio" class="skip-to-content">Saltar al contenido principal</a>
    ${renderNavbar()}
    <main id="mainContent">
      <!-- Routed views dynamically injected by router.js -->
    </main>
    ${renderScrollTopButton()}
    ${renderWhatsAppWidget()}
    ${renderFooter()}
  `;

  // Initialize lightbox modal
  initLightbox();

  // Initialize theme manager (Dark / Light)
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  initTheme(themeToggleBtn);

  // Initialize navbar interactions
  setupNavbarEvents();

  // Initialize SPA dynamic routing (Home vs Dedicated Catalog Page)
  initRouter();

  // Initialize global scroll effects
  initScrollEffects();
}

// Start application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
