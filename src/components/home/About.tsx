'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { STATS_DATA } from '@/src/data/stats';

/**
 * Animated number counter component that increments smoothly when entering the viewport
 */
function AnimatedCounter({ targetValue, suffix, isVisible }: { targetValue: number; suffix: string; isVisible: boolean }) {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const duration = 2000; // 2.0s luxury ease-out count animation

    const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = easeOutQuart(progress);
      
      setCount(Math.floor(easedProgress * targetValue));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(targetValue);
      }
    };

    const animFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrame);
  }, [isVisible, targetValue]);

  // Format with dot separator for numbers over 1000 (e.g. 10.000)
  const formattedNumber = count >= 1000 
    ? count.toLocaleString('de-DE') 
    : count.toString();

  return (
    <div className="card-metric-number">
      <span className="number-core">{formattedNumber}</span>
      {suffix && <span className="number-suffix">{suffix}</span>}
    </div>
  );
}

export default function About() {
  const [hasEnteredView, setHasEnteredView] = useState<boolean>(false);
  const statsSectionRef = useRef<HTMLDivElement | null>(null);

  // Trigger counters when scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    if (statsSectionRef.current) {
      observer.observe(statsSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="section-wrapper about-section" id="tradicion" aria-label="Sobre Muebles Bellagio">
      <div className="container">
        {/* Editorial Two-Column Showcase */}
        <div className="editorial-about-grid">
          {/* Left Column: Asymmetric Layered Editorial Visual */}
          <div className="editorial-visual-stage">
            {/* Main Architectural Hero Image */}
            <div className="editorial-main-frame">
              <img
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85"
                alt="Salón moderno con mobiliario Bellagio en Caracas"
                className="editorial-main-img"
                width={650}
                height={520}
                loading="lazy"
              />
              <div className="editorial-img-gradient" />

              {/* Floating Welcome Seal */}
              <div className="editorial-seal-badge">
                <img
                  src="/logo.png"
                  alt="Logo Muebles Bellagio"
                  className="seal-logo-img"
                  width={28}
                  height={28}
                />
                <div className="seal-text-group">
                  <span className="seal-title">Bienvenidos a Casa</span>
                  <span className="seal-sub">MUEBLES BELLAGIO · CARACAS</span>
                </div>
              </div>

              {/* Floating Dimension / Experience Pill */}
              <div className="editorial-experience-pill">
                <span className="exp-dot"></span>
                <span>Fabricación a Medida & Línea Importada</span>
              </div>
            </div>

            {/* Overlapping Floating Inset: Material & Comfort Detail */}
            <div className="editorial-inset-card">
              <div className="inset-img-wrapper" style={{ background: '#FAF9F6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <img
                  src="/images/about-sofa-inset.jpg"
                  alt="Sofá Seccional Bellagio en acabado lino y tapicería de autor"
                  className="inset-detail-img"
                  style={{ objectFit: 'contain', width: '100%', height: '100%', transform: 'scale(1.08)' }}
                  width={270}
                  height={140}
                  loading="lazy"
                />
              </div>
              <div className="inset-caption">
                <span className="inset-tag">TECNOLOGÍA &amp; CONFORT</span>
                <p className="inset-text">Telas Pet Friendly, antifluido y espumas indeformables</p>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Narrative & Pillars */}
          <div className="editorial-content-column">
            <span className="section-tag">Nuestro Compromiso</span>
            
            <h2 className="section-title">
              Diseñando el Hogar <br />
              <span className="gold-text">Que Siempre Soñaste</span>
            </h2>

            <p className="editorial-lead-p">
              En <strong>Muebles Bellagio</strong> creamos y seleccionamos piezas pensadas para el estilo de vida de los hogares venezolanos. Combinamos fabricación propia con materiales resistentes de primera calidad y una exclusiva línea de mobiliario importado con sistemas eléctricos de vanguardia.
            </p>

            {/* 3 Real Product Pillars */}
            <div className="editorial-pillars-list">
              {/* Pillar 01 */}
              <div className="editorial-pillar-item">
                <div className="pillar-number">01</div>
                <div className="pillar-info">
                  <h4>Pino Seco al Horno, MDF & Piedras Sinterizadas</h4>
                  <p>Estructuras sólidas curadas al horno para resistir la humedad sin deformarse, con topes modernos ultra resistentes a rayaduras y calor.</p>
                </div>
              </div>

              {/* Pillar 02 */}
              <div className="editorial-pillar-item">
                <div className="pillar-number">02</div>
                <div className="pillar-info">
                  <h4>Telas Inteligentes: Pet Friendly & Antifluido</h4>
                  <p>Gran variedad de texturas y colores de fácil limpieza, resistentes al agua, manchas y mascotas para disfrutar tu sala sin preocupaciones.</p>
                </div>
              </div>

              {/* Pillar 03 */}
              <div className="editorial-pillar-item">
                <div className="pillar-number">03</div>
                <div className="pillar-info">
                  <h4>Sistemas Eléctricos & Colecciones Importadas</h4>
                  <p>Sofás y poltronas reclinables con motores eléctricos, puertos de carga y diseños exclusivos listos para entrega inmediata.</p>
                </div>
              </div>
            </div>

            {/* Quick Action Link */}
            <div className="editorial-cta-row">
              <Link href="/tiendas" className="btn btn-outline btn-sm">
                Conocer Showrooms en Caracas
              </Link>
              <a
                href="https://wa.me/584141536516?text=Hola%20Muebles%20Bellagio%2C%20deseo%20asesor%C3%ADa%20para%20amoblar%20mi%20hogar."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-sm"
              >
                <span>Asesoría Personalizada</span>
              </a>
            </div>
          </div>
        </div>

        {/* Luxury 3D Interactive Brand Metric Cards with Big Dynamic Numbers on Top */}
        <div 
          ref={statsSectionRef}
          className="luxury-stats-stage" 
          style={{ marginTop: 'var(--space-12)' }}
        >
          <div className="luxury-stats-grid">
            {STATS_DATA.map((stat, idx) => {
              const icons = [
                // 17 Años de Trayectoria (Emblema de maestría / corona)
                <svg key="0" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>,
                // 100% Diseño Exclusivo (Gema / Diamante)
                <svg key="1" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 3H18L22 9L12 22L2 9L6 3Z"/>
                  <path d="M2 9H22"/>
                  <path d="M12 22L7 9L10 3"/>
                  <path d="M12 22L17 9L14 3"/>
                </svg>,
                // 10.000+ Espacios Transformados (Hogar arquitectónico)
                <svg key="2" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"/>
                  <path d="M9 22V12H15V22"/>
                  <path d="M12 7H12.01"/>
                </svg>,
                // 3 Meses Servicio Postventa (Escudo de garantía total)
                <svg key="3" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22S4 18 4 12V5L12 2L20 5V12C20 18 12 22 12 22Z"/>
                  <path d="M9 12L11 14L15 10"/>
                </svg>
              ];

              return (
                <div
                  key={idx}
                  className="luxury-3d-card"
                  style={{ animationDelay: `${idx * 120}ms` }}
                  onMouseMove={(e) => {
                    const card = e.currentTarget;
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    // Quiet Luxury: sutil y elegante inclinación máxima de 4.5 grados
                    const rx = -(y / (rect.height / 2)) * 4.5;
                    const ry = (x / (rect.width / 2)) * 4.5;
                    const lightX = ((e.clientX - rect.left) / rect.width) * 100;
                    const lightY = ((e.clientY - rect.top) / rect.height) * 100;
                    card.style.setProperty('--card-rx', `${rx.toFixed(2)}deg`);
                    card.style.setProperty('--card-ry', `${ry.toFixed(2)}deg`);
                    card.style.setProperty('--light-x', `${lightX.toFixed(1)}%`);
                    card.style.setProperty('--light-y', `${lightY.toFixed(1)}%`);
                    card.classList.add('is-tilting');
                  }}
                  onMouseLeave={(e) => {
                    const card = e.currentTarget;
                    card.style.removeProperty('--card-rx');
                    card.style.removeProperty('--card-ry');
                    card.style.removeProperty('--light-x');
                    card.style.removeProperty('--light-y');
                    card.classList.remove('is-tilting');
                  }}
                >
                  <div className="card-ambient-orb" aria-hidden="true" />
                  <div className="card-light-glare" aria-hidden="true" />
                  
                  <div className="card-3d-inner">
                    {/* Header Row: Big Animated Number on Left + Badge & Icon on Right */}
                    <div className="card-top-header">
                      <div className="card-number-spotlight">
                        <AnimatedCounter
                          targetValue={stat.value}
                          suffix={stat.suffix}
                          isVisible={hasEnteredView}
                        />
                      </div>

                      <div className="card-badge-emblem-cluster">
                        {stat.badge && (
                          <span className="card-category-tag">
                            {stat.badge}
                          </span>
                        )}
                        <div className="card-icon-emblem">
                          {icons[idx % icons.length]}
                        </div>
                      </div>
                    </div>

                    {/* Metric Label & Description */}
                    <div className="card-details-block">
                      <h3 className="card-metric-label">{stat.label}</h3>
                      <p className="card-metric-desc">
                        {stat.description}
                      </p>
                    </div>

                    {/* Bottom Dynamic Gold Shimmer Accent Line */}
                    <div className="card-bottom-accent">
                      <span className="accent-glow-line" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

