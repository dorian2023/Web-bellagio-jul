import React from 'react';
import { STATS_DATA } from '@/src/data/stats';

export default function About() {
  return (
    <section className="section-wrapper about-section" aria-label="Sobre Muebles Bellagio">
      <div className="container">
        <div className="about-grid">
          {/* Image */}
          <div className="about-image-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80" 
              alt="Mobiliario de diseño Bellagio en Caracas" 
              className="about-img"
              width={600}
              height={420}
              loading="lazy"
            />
          </div>

          {/* Content */}
          <div className="about-content">
            <span className="section-tag">Nuestra Tradición</span>
            <h2 className="section-title">
              Creando Espacios de <br />
              <span className="gold-text">Distinción & Confort</span>
            </h2>
            <p style={{ marginBottom: 'var(--space-4)' }}>
              En <strong>Muebles Bellagio</strong> concebimos cada pieza como una obra de arte funcional. Combinamos técnicas de ebanistería tradicional con las últimas tendencias de diseño internacional en mármol, pieles seleccionadas y maderas finas.
            </p>

            {/* Stats Grid */}
            <div className="stats-grid">
              {STATS_DATA.map((stat, idx) => (
                <div key={idx} className="stat-card">
                  <div className="stat-number">
                    {stat.value.toLocaleString()}{stat.suffix}
                  </div>
                  <div className="stat-label">{stat.label}</div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
                    {stat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
