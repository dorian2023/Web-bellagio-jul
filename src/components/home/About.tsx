'use client';

import React from 'react';
import Link from 'next/link';
import { STATS_DATA } from '@/src/data/stats';

export default function About() {
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
              <div className="inset-img-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=450&q=85"
                  alt="Tapicería fina Pet Friendly y acabados modernos"
                  className="inset-detail-img"
                  width={180}
                  height={130}
                  loading="lazy"
                />
              </div>
              <div className="inset-caption">
                <span className="inset-tag">TECNOLOGÍA & CONFORT</span>
                <p className="inset-text">Telas Pet Friendly, antifluido y piedras sinterizadas</p>
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

        {/* Brand Live Stats Counters */}
        <div className="stats-grid" style={{ marginTop: 'var(--space-12)' }}>
          {STATS_DATA.map((stat, idx) => (
            <div key={idx} className="stat-card">
              <div className="stat-number">
                {stat.displayValue}{stat.suffix}
              </div>
              <div className="stat-label">{stat.label}</div>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
