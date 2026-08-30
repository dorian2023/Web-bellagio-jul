/**
 * @file navbar.js
 * @description Header navigation component with sticky behavior, theme toggle, and SPA routing links.
 */

export function renderNavbar() {
  return `
    <nav class="navbar" id="mainNav" role="navigation" aria-label="Navegación Principal">
      <div class="container navbar-inner">
        <!-- Desktop Menu Links (Exact 4 items: Inicio, Tiendas, Catálogos, Contáctanos) -->
        <ul class="navbar-nav" role="menubar">
          <li role="none"><a href="#/" class="nav-link" role="menuitem">Inicio</a></li>
          <li role="none"><a href="#tiendas" class="nav-link" role="menuitem">Tiendas</a></li>
          <li role="none"><a href="#/catalogo" class="nav-link" role="menuitem">Catálogos</a></li>
          <li role="none"><a href="#contactanos" class="nav-link" role="menuitem">Contáctanos</a></li>
        </ul>

        <!-- Action Controls -->
        <div class="navbar-actions">
          <!-- Dark/Light Mode Switcher -->
          <button type="button" class="theme-toggle-btn" id="themeToggleBtn" aria-label="Alternar modo de color">
            <!-- Injected via theme.js -->
          </button>

          <!-- WhatsApp CTA Button -->
          <a href="https://wa.me/584141536516?text=Hola%20Muebles%20Bellagio%2C%20deseo%20m%C3%A1s%20informaci%C3%B3n." 
             target="_blank" 
             rel="noopener noreferrer" 
             class="btn btn-whatsapp btn-sm navbar-cta-desktop" 
             aria-label="Contactar por WhatsApp">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-5.805 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
            </svg>
            <span>WhatsApp</span>
          </a>

          <!-- Mobile Hamburger -->
          <button type="button" class="hamburger-btn" id="mobileMenuBtn" aria-label="Abrir menú" aria-expanded="false">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Drawer -->
      <div class="mobile-drawer" id="mobileDrawer">
        <a href="#/" class="mobile-nav-link">Inicio</a>
        <a href="#tiendas" class="mobile-nav-link">Tiendas</a>
        <a href="#/catalogo" class="mobile-nav-link">Catálogos</a>
        <a href="#contactanos" class="mobile-nav-link">Contáctanos</a>
        <a href="https://wa.me/584141536516?text=Hola%20Muebles%20Bellagio%2C%20deseo%20m%C3%A1s%20informaci%C3%B3n." 
           target="_blank" 
           rel="noopener noreferrer" 
           class="btn btn-whatsapp" 
           style="margin-top: var(--space-4);">
          WhatsApp (+58 414 1536516)
        </a>
      </div>
    </nav>
  `;
}

/**
 * Attaches event listeners for mobile drawer.
 */
export function setupNavbarEvents() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  menuBtn?.addEventListener('click', () => {
    const isOpen = drawer?.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer?.classList.remove('open');
      menuBtn?.setAttribute('aria-expanded', 'false');
    });
  });
}
