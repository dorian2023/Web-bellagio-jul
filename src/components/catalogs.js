/**
 * @file catalogs.js
 * @description Elegant entrance to the dedicated catalog experience.
 */

export function renderCatalogs() {
  return `
    <section id="catalogos" class="section-wrapper catalog-entrance-section" aria-label="Acceso al catálogo">
      <div class="container">
        <div class="catalog-entrance reveal-item">
          <div class="catalog-entrance-mark" aria-hidden="true">
            <span></span>
            <img src="/logo.png" alt="" width="72" height="72">
            <span></span>
          </div>
          <span class="section-tag">Colección Bellagio</span>
          <h2 class="section-title">Descubre nuestro <span class="gold-text">catálogo completo</span></h2>
          <p class="section-subtitle">
            Explora todas nuestras piezas, categorías y novedades en una experiencia creada para encontrar el mobiliario ideal para tus espacios.
          </p>
          <a href="#/catalogo" class="btn btn-primary btn-lg catalog-entrance-cta">
            <span>Explorar el catálogo</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </section>
  `;
}

/** Kept for the router lifecycle; the section now uses a direct link. */
export function setupCatalogsEvents() {}
