import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: Brand Info & Social Networks */}
          <div>
            <Link href="/" className="gold-text" style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block', marginBottom: 'var(--space-3)' }}>
              Muebles Bellagio
            </Link>
            <p style={{ marginBottom: 'var(--space-4)' }}>
              Diseño, fabricación y distribución de mobiliario de vanguardia en Caracas, Venezuela. Pasión por los detalles y el confort en tu hogar.
            </p>
            <div className="footer-social-links" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {/* Instagram */}
              <a href="https://www.instagram.com/mueblesbellagio/" target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label="Instagram de Bellagio" title="Instagram @mueblesbellagio">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              {/* TikTok */}
              <a href="https://www.tiktok.com/@mueblesbellagio" target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label="TikTok de Bellagio" title="TikTok @mueblesbellagio">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.46V12a8.28 8.28 0 0 0 5.77 2.31V10.8a4.87 4.87 0 0 1-3.8-1.57v-.03a4.78 4.78 0 0 1 3.8-2.51V6.69z"/>
                </svg>
              </a>

              {/* Facebook */}
              <a href="https://www.facebook.com/mueblesbellagiostore/" target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label="Facebook de Bellagio" title="Facebook Muebles Bellagio">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* WhatsApp */}
              <a href="https://wa.me/584141536516" target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label="WhatsApp directo" title="WhatsApp +58 414-1536516">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-5.805 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="footer-col-title">Navegación</h4>
            <ul className="footer-links">
              <li><Link href="/" prefetch={true}>Inicio</Link></li>
              <li><Link href="/tiendas" prefetch={true}>Nuestras Tiendas en Caracas</Link></li>
              <li><Link href="/catalogo" prefetch={true}>Catálogo Completo (17 Colecciones)</Link></li>
              <li><Link href="/#contactanos">Contáctanos</Link></li>
            </ul>
          </div>

          {/* Col 3: Categorías Top */}
          <div>
            <h4 className="footer-col-title">Colecciones Destacadas</h4>
            <ul className="footer-links">
              <li><Link href="/catalogo/sofas">Salas & Sofás</Link></li>
              <li><Link href="/catalogo/comedores">Comedores de Lujo</Link></li>
              <li><Link href="/catalogo/dormitorios">Recámaras Master</Link></li>
              <li><Link href="/catalogo/mesas-de-centro">Mesas de Centro</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact info */}
          <div>
            <h4 className="footer-col-title">Showrooms Caracas</h4>
            <p style={{ fontSize: '0.9rem', marginBottom: 'var(--space-3)', color: 'var(--color-text-secondary)' }}>
              Avenida Comercio · Bella Vista · C.C. Casa Mall
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--gold-400)', fontWeight: 600, marginBottom: '2px' }}>
              WhatsApp: +58 414 1536516
            </p>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
              Lunes a Sábado: 9:00 AM - 5:00 PM
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} Muebles Bellagio C.A. Todos los derechos reservados.</p>
          <p className="footer-author">Mobiliario de Vanguardia · Caracas, Venezuela</p>
        </div>
      </div>
    </footer>
  );
}
