import React from 'react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section id="inicio" className="hero-cinematic-section" aria-label="Inicio - Muebles Bellagio">
      {/* Fullscreen Video & Poster Background */}
      <div className="hero-video-wrapper">
        <video 
          id="heroBackgroundVideo"
          className="hero-video-bg" 
          autoPlay 
          loop 
          muted 
          playsInline 
          preload="auto"
          poster="/images/hero-poster.webp"
          aria-hidden="true"
        >
          <source src="/videos/tienda-principal.mp4" type="video/mp4" />
        </video>
        <div className="hero-video-overlay"></div>
        <div className="hero-particles-glow"></div>
      </div>

      <div className="container hero-cinematic-container">
        {/* Floating Glassmorphism Centerpiece Card */}
        <div className="hero-glass-card">
          
          {/* Bellagio Logo */}
          <div className="hero-logo-wrapper">
            <img 
              src="/logo.png" 
              alt="Muebles Bellagio Caracas" 
              className="hero-logo-circle"
              width={190}
              height={190}
              loading="eager"
            />
          </div>

          {/* Main Headlines */}
          <h1 className="hero-cinematic-title">
            Muebles Bellagio <br />
            <span className="gold-text-glow">Bienvenidos a casa</span>
          </h1>

          <p className="hero-cinematic-subtitle">
            Desde Caracas para hogares de distinción. Piezas exclusivas de alta gama fabricadas con los materiales de más alto estándar en el mercado venezolano. Así como productos importados de excelente calidad.
          </p>

          {/* Action Buttons Group */}
          <div className="hero-cinematic-cta-group">
            <Link href="/catalogo" prefetch={true} className="btn btn-primary btn-lg hero-main-cta">
              <span>Explorar Colecciones 2026</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>

        </div>
      </div>

      {/* Animated Scroll Prompt */}
      <a href="#sobre-nosotros" className="hero-scroll-indicator" aria-label="Desplazarse hacia abajo">
        <div className="scroll-mouse-icon">
          <span className="scroll-wheel"></span>
        </div>
        <span className="scroll-text">Descubrir</span>
      </a>
    </section>
  );
}
