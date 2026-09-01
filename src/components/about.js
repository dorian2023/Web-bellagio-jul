/**
 * @file about.js
 * @description About Bellagio section with brand heritage and animated stats counters.
 */

import { STATS_DATA } from '../data/stats.js';
import { escapeHTML } from '../utils/security.js';

export function renderAbout() {
  const statsHTML = STATS_DATA.map(stat => `
    <div class="stat-card">
      <div class="stat-number" data-target="${stat.value}" data-suffix="${stat.suffix}">0</div>
      <div class="stat-label">${escapeHTML(stat.label)}</div>
      <p style="font-size: 0.82rem; color: var(--color-text-muted); margin-top: var(--space-2);">${escapeHTML(stat.description)}</p>
    </div>
  `).join('');

  return `
    <section class="section-wrapper about-section" aria-label="Sobre Muebles Bellagio">
      <div class="container">
        <div class="about-grid">
          <!-- Image -->
          <div class="about-image-wrapper reveal-item">
            <img 
              src="/logo.png" 
              alt="Logo de Muebles Bellagio" 
              class="about-img about-logo-img"
              width="600"
              height="420"
              loading="lazy"
            />
          </div>

          <!-- Content -->
          <div class="about-content reveal-item reveal-delay-2">
            <span class="section-tag">Nuestra Tradición</span>
            <h2 class="section-title">
              Creando Espacios de <br />
              <span class="gold-text">Distinción & Confort</span>
            </h2>
            <p style="margin-bottom: var(--space-4);">
              En <strong>Muebles Bellagio</strong> concebimos cada pieza como una obra de arte funcional. Combinamos técnicas de ebanistería tradicional con las últimas tendencias de diseño internacional y una selección de productos importados de excelente calidad.
            </p>


            <!-- Stats Grid -->
            <div class="stats-grid">
              ${statsHTML}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
