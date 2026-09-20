'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [showThemeHint, setShowThemeHint] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const savedTheme = localStorage.getItem('bellagio-theme') as 'dark' | 'light' | null;
    const initialTheme = savedTheme || 'light';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);

    const hintAlreadySeen = localStorage.getItem('bellagio-theme-hint-seen');
    if (!hintAlreadySeen) {
      // Mark as seen immediately so it never shows again on subsequent page views or reloads
      localStorage.setItem('bellagio-theme-hint-seen', 'true');

      // Display hint after 1.2s
      const showTimer = setTimeout(() => {
        setShowThemeHint(true);
      }, 1200);

      // Auto-hide hint smoothly after 7 seconds if the user does not interact
      const autoHideTimer = setTimeout(() => {
        setShowThemeHint(false);
      }, 8200);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(autoHideTimer);
      };
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('bellagio-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    setShowThemeHint(false);
  };

  const dismissHint = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setShowThemeHint(false);
  };

  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <nav className="navbar" id="mainNav" role="navigation" aria-label="Navegación Principal">
      <div className="container navbar-inner">
        {/* Desktop Menu Links (Exact 4 items: Inicio, Tiendas, Catálogos, Contáctanos) */}
        <ul className="navbar-nav" role="menubar">
          <li role="none">
            <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`} role="menuitem">
              Inicio
            </Link>
          </li>
          <li role="none">
            <Link href="/tiendas" className={`nav-link ${pathname === '/tiendas' ? 'active' : ''}`} role="menuitem">
              Tiendas
            </Link>
          </li>
          <li role="none">
            <Link href="/catalogo" className={`nav-link ${pathname.startsWith('/catalogo') ? 'active' : ''}`} role="menuitem">
              Catálogos
            </Link>
          </li>
          <li role="none">
            <Link href="/#contactanos" className="nav-link" role="menuitem">
              Contáctanos
            </Link>
          </li>
        </ul>

        {/* Action Controls */}
        <div className="navbar-actions">
          {/* Dark/Light Mode Switcher with Interactive Hint Widget */}
          <div className="theme-toggle-wrapper">
            <button 
              type="button" 
              className="theme-toggle-btn" 
              onClick={toggleTheme} 
              aria-label="Alternar modo de color"
              title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>

            {/* Widget indicativo para cambiar fondo */}
            {showThemeHint && (
              <div 
                className="theme-hint-widget"
                role="status"
                onClick={toggleTheme}
                title="Haz clic para cambiar el fondo"
              >
                <div className="theme-hint-content">
                  <span className="theme-hint-badge">Fondo de Página</span>
                  <p className="theme-hint-text">
                    {theme === 'light' 
                      ? '¿Prefieres fondo oscuro? Haz clic aquí.' 
                      : '¿Prefieres fondo claro? Haz clic aquí.'}
                  </p>
                </div>
                <button 
                  type="button" 
                  className="theme-hint-close" 
                  onClick={dismissHint}
                  aria-label="Cerrar sugerencia de fondo"
                  title="Cerrar sugerencia"
                >
                  ✕
                </button>
                <div className="theme-hint-pointer" aria-hidden="true" />
              </div>
            )}
          </div>

          {/* WhatsApp CTA Button */}
          <a 
            href="https://wa.me/584141536516?text=Hola%20Muebles%20Bellagio%2C%20deseo%20m%C3%A1s%20informaci%C3%B3n." 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-whatsapp btn-sm navbar-cta-desktop" 
            aria-label="Contactar por WhatsApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-5.805 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
            </svg>
            <span>WhatsApp</span>
          </a>

          {/* Mobile Hamburger */}
          <button 
            type="button" 
            className="hamburger-btn" 
            onClick={() => setIsDrawerOpen(!isDrawerOpen)} 
            aria-label="Abrir menú" 
            aria-expanded={isDrawerOpen}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" width="24" height="24">
              <path strokeLinecap="round" strokeLinejoin="round" d={isDrawerOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      <div className={`mobile-drawer ${isDrawerOpen ? 'open' : ''}`} id="mobileDrawer">
        <Link href="/" className="mobile-nav-link" onClick={closeDrawer}>
          Inicio
        </Link>
        <Link href="/tiendas" className="mobile-nav-link" onClick={closeDrawer}>
          Tiendas en Caracas
        </Link>
        <Link href="/catalogo" className="mobile-nav-link" onClick={closeDrawer}>
          Catálogos (17 Categorías A-Z)
        </Link>
        <Link href="/#contactanos" className="mobile-nav-link" onClick={closeDrawer}>
          Contáctanos
        </Link>
        <a 
          href="https://wa.me/584141536516?text=Hola%20Muebles%20Bellagio%2C%20deseo%20m%C3%A1s%20informaci%C3%B3n." 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn btn-whatsapp" 
          style={{ marginTop: 'var(--space-4)' }}
          onClick={closeDrawer}
        >
          WhatsApp (+58 414 1536516)
        </a>
      </div>
    </nav>
  );
}
