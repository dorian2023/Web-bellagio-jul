import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: Brand Info */}
          <div>
            <Link href="/" className="gold-text" style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block', marginBottom: 'var(--space-3)' }}>
              Muebles Bellagio
            </Link>
            <p>
              Diseño, fabricación y distribución de mobiliario de alta gama en Caracas, Venezuela. Pasión por los detalles y el confort premium.
            </p>
            <div className="footer-social-links">
              {/* WhatsApp */}
              <a href="https://wa.me/584141536516" target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label="WhatsApp directo">
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
              <li><Link href="/">Inicio</Link></li>
              <li><Link href="/tiendas">Nuestras Tiendas en Caracas</Link></li>
              <li><Link href="/catalogo">Catálogo Completo (17 Colecciones)</Link></li>
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
          <p className="footer-author">Mobiliario de Autor · Caracas, Venezuela</p>
        </div>
      </div>
    </footer>
  );
}
