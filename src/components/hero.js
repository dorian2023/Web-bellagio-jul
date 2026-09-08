/**
 * @file hero.js
 * @description Hero Option 3: Cinematic Fullscreen Video Background with Luxury Glassmorphism Floating Centerpiece.
 */

import { setupBackgroundVideo } from '../utils/background-video.js';

import { getCatalogCategories } from '../services/catalog-store.js';

export function renderHero() {
  const categoryCount = Math.max(getCatalogCategories().length - 1, 0);
  return `
    <section id="inicio" class="hero-cinematic-section" aria-label="Inicio - Muebles Bellagio">
      <!-- Fullscreen Video & Poster Background -->
      <div class="hero-video-wrapper">
        <video 
          id="heroBackgroundVideo"
          class="hero-video-bg" 
          loop 
          muted 
          playsinline 
          webkit-playsinline="true"
          x5-playsinline="true"
          preload="none"
          data-src="/videos/tienda-principal.mp4"
          poster="/images/hero-video-poster.webp"
          disablepictureinpicture
          disableremoteplayback
          aria-hidden="true"
        >
        </video>
        <div class="hero-video-overlay"></div>
        <div class="hero-particles-glow"></div>
      </div>

      <div class="container hero-cinematic-container">
        <!-- Floating Glassmorphism Centerpiece Card -->
        <div class="hero-glass-card">
          
          <!-- Bellagio Logo -->
          <div class="hero-logo-wrapper">
            <img 
              src="/logo.png" 
              alt="Muebles Bellagio" 
              class="hero-logo-circle"
              width="156"
              height="156"
              loading="eager"
            />
          </div>

          <!-- Main Headlines -->
          <span class="hero-kicker-tag">Colección Exclusiva 2026</span>
          
          <h1 class="hero-cinematic-title">
            Muebles Bellagio <br />
            <span class="gold-text-glow">Bienvenidos a casa</span>
          </h1>

          <p class="hero-cinematic-subtitle">
            Desde Caracas para hogares de distinción. Piezas exclusivas de alta gama fabricadas con los materiales de más alto estándar en el mercado venezolano. Así como productos importados de excelente calidad.
          </p>

          <!-- Action Buttons Group -->
          <div class="hero-cinematic-cta-group">
            <a href="#/catalogo" class="btn btn-primary btn-lg hero-main-cta">
              <span>Explorar Colecciones 2026</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>

            <a href="#tiendas" class="btn btn-glass btn-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>Nuestras Tiendas</span>
            </a>
          </div>

          <!-- Quick Highlights Bar -->
          <div class="hero-stats-strip">
            <div class="strip-stat-item">
              <strong class="gold-text">+10.000</strong>
              <span>Espacios Amoblados</span>
            </div>
            <div class="strip-separator"></div>
            <div class="strip-stat-item">
              <strong class="gold-text" id="heroCategoryCount">${categoryCount}</strong>
              <span>Categorías</span>
            </div>
            <div class="strip-separator"></div>
            <div class="strip-stat-item">
              <strong class="gold-text">3</strong>
              <span>Showrooms en Caracas</span>
            </div>
          </div>

        </div>
      </div>

      <!-- Animated Scroll Prompt -->
      <a href="#sobre-nosotros" class="hero-scroll-indicator" aria-label="Desplazarse hacia abajo">
        <span class="scroll-mouse-icon">
          <span class="scroll-wheel"></span>
        </span>
        <span class="scroll-text">Descubrir</span>
      </a>
    </section>
  `;
}

let disposeHeroVideo = () => {};

export function cleanupHeroEvents() {
  disposeHeroVideo();
  disposeHeroVideo = () => {};
}

export function setupHeroEvents() {
  cleanupHeroEvents();
  const video = document.getElementById('heroBackgroundVideo');
  if (video) disposeHeroVideo = setupBackgroundVideo(video);
}
