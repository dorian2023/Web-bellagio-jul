/**
 * @file hero.js
 * @description Hero Option 3: Cinematic Fullscreen Video Background with Luxury Glassmorphism Floating Centerpiece.
 */

export function renderHero() {
  return `
    <section id="inicio" class="hero-cinematic-section" aria-label="Inicio - Muebles Bellagio">
      <!-- Fullscreen Video & Poster Background -->
      <div class="hero-video-wrapper">
        <video 
          id="heroBackgroundVideo"
          class="hero-video-bg" 
          autoplay 
          loop 
          muted 
          playsinline 
          webkit-playsinline="true"
          x5-playsinline="true"
          preload="auto"
          poster="/images/hero-poster.jpg"
          disablepictureinpicture
          disableremoteplayback
          aria-hidden="true"
        >
          <source src="/videos/tienda-principal.mp4" type="video/mp4" />
        </video>
        <div class="hero-video-overlay"></div>
        <div class="hero-particles-glow"></div>
      </div>

      <div class="container hero-cinematic-container">
        <!-- Floating Glassmorphism Centerpiece Card -->
        <div class="hero-glass-card reveal-item">
          
          <!-- Bellagio Logo -->
          <div class="hero-logo-wrapper">
            <img 
              src="/logo.jpg" 
              alt="Muebles Bellagio" 
              class="hero-logo-circle"
              width="90"
              height="90"
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
            Desde Caracas para hogares de distinción. Piezas exclusivas de alta gama fabricadas con mármol noble, maderas selectas y tapicería europea contemporánea.
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
              <strong class="gold-text">+2,500</strong>
              <span>Espacios Amoblados</span>
            </div>
            <div class="strip-separator"></div>
            <div class="strip-stat-item">
              <strong class="gold-text">17</strong>
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

/**
 * Ensures mobile browsers play the background video immediately,
 * handling browser energy/data-saver policies with interaction fallbacks.
 */
export function setupHeroEvents() {
  const video = document.getElementById('heroBackgroundVideo');
  if (!video) return;

  video.muted = true;
  video.defaultMuted = true;

  const tryPlay = () => {
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback: trigger playback on first user touch/scroll
        const triggerOnFirstInteraction = () => {
          video.play().catch(() => {});
          window.removeEventListener('touchstart', triggerOnFirstInteraction);
          window.removeEventListener('scroll', triggerOnFirstInteraction);
          window.removeEventListener('click', triggerOnFirstInteraction);
        };
        window.addEventListener('touchstart', triggerOnFirstInteraction, { once: true, passive: true });
        window.addEventListener('scroll', triggerOnFirstInteraction, { once: true, passive: true });
        window.addEventListener('click', triggerOnFirstInteraction, { once: true, passive: true });
      });
    }
  };

  // Immediate attempt
  tryPlay();

  // Retry when video data is ready
  if (video.readyState >= 2) {
    tryPlay();
  } else {
    video.addEventListener('loadeddata', tryPlay, { once: true });
  }
}
