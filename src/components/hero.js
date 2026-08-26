/**
 * @file hero.js
 * @description Hero section presentation component with luxury typography and action buttons.
 */

export function renderHero() {
  return `
    <section id="inicio" class="hero-section" aria-label="Inicio">
      <div class="hero-background-art"></div>
      
      <div class="container">
        <div class="hero-grid">
          <!-- Hero Text Content -->
          <div class="hero-content reveal-item">
            <div class="hero-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span>Colección Exclusiva 2026</span>
            </div>

            <h1 class="hero-title">
              Elegancia que <br />
              <span class="gold-text">Transforma Espacios</span>
            </h1>



            <div class="hero-cta-group">
              <a href="#/catalogo" class="btn btn-primary">
                <span>Explorar Catálogos</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>

              <a href="#tiendas" class="btn btn-secondary">
                <span>Visitar Nuestras Tiendas</span>
              </a>
            </div>

            <!-- Trust Badges -->
            <div class="hero-trust-badges">
              <div class="trust-item">
                <div class="trust-icon-box">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    <polyline points="2 17 12 22 22 17"></polyline>
                    <polyline points="2 12 12 17 22 12"></polyline>
                  </svg>
                </div>
                <div class="trust-text">
                  <h4>Alta Ebanistería</h4>
                  <p>Maderas nobles y mármol</p>
                </div>
              </div>

              <div class="trust-item">
                <div class="trust-icon-box">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <div class="trust-text">
                  <h4>Garantía Bellagio</h4>
                  <p>Calidad de exportación</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Hero Visual Showcase -->
          <div class="hero-visual reveal-item reveal-delay-2">
            <div class="hero-visual-card">
              <img 
                src="https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80" 
                alt="Comedor Extensible J-020" 
                class="hero-visual-img"
                width="600"
                height="480"
                loading="eager"
              />
              <div class="hero-floating-tag">
                <div>
                  <h4>Comedor Extensible J-020 6 puestos</h4>
                  <p>Muebles Bellagio</p>
                </div>
                <a href="#/catalogo" class="btn btn-primary btn-sm" aria-label="Ver detalles">
                  Ver Colección
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
