'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface FabricSwatch {
  id: string;
  name: string;
  type: string;
  colorHex: string;
  imgUrl: string;
  dimensions: string;
}

const FABRIC_SWATCHES: FabricSwatch[] = [
  {
    id: 'boucle-crema',
    name: 'Bouclé Premium Marfil',
    type: 'Pet Friendly & Antifluido',
    colorHex: '#EAE5D9',
    imgUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85',
    dimensions: '3.20m × 2.10m'
  },
  {
    id: 'lino-tostado',
    name: 'Lino Italiano Arena',
    type: 'Frescura & Alta Resistencia',
    colorHex: '#C5B59E',
    imgUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=85',
    dimensions: '2.80m × 1.90m'
  },
  {
    id: 'cuero-cognac',
    name: 'Cuero Genuino Coñac',
    type: 'Colección Alta Ebanistería',
    colorHex: '#8C5835',
    imgUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=85',
    dimensions: '3.00m × 2.20m'
  },
  {
    id: 'grafito-velvet',
    name: 'Gris Grafito Velvet',
    type: 'Tacto Sedoso Antimanchas',
    colorHex: '#3D4148',
    imgUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=85',
    dimensions: '2.90m × 2.00m'
  }
];

export default function SpaceVisualizer() {
  const [activeSwatch, setActiveSwatch] = useState<FabricSwatch>(FABRIC_SWATCHES[0]);

  const whatsappMessage = encodeURIComponent(
    `Hola Muebles Bellagio, tengo la foto y las medidas de mi espacio y deseo una asesoría con fotomontaje en acabado ${activeSwatch.name}.`
  );

  return (
    <section 
      className="section-wrapper space-visualizer-section" 
      id="servicio-ambientacion"
      aria-label="Servicio de Ambientación 3D y Medidas"
    >
      <div className="container">
        <div className="visualizer-split-grid">
          
          {/* Left Column: Persuasive Narrative & 3-Step Process */}
          <div className="visualizer-content-col">
            <span className="section-tag">
              Experiencia Virtual Bellagio
            </span>

            <h2 className="section-title">
              Míralo en tu espacio <br />
              <span className="gold-text">Antes de Fabricarlo</span>
            </h2>

            <p className="visualizer-lead-desc">
              ¿Tienes la foto y las medidas de tu sala, habitación o comedor? En <strong>Muebles Bellagio</strong> eliminamos la incertidumbre: montamos digitalmente nuestros diseños a escala real sobre la foto de tu casa para que aprecies los colores, texturas y dimensiones exactas antes de tomar tu decisión.
            </p>

            {/* 3 Step Interactive Process Cards */}
            <div className="visualizer-steps-list">
              <div className="visualizer-step-item">
                <div className="step-badge-num">1</div>
                <div className="step-info">
                  <h4>Toma la Foto &amp; Medidas</h4>
                  <p>Tómale una foto a tu pared o espacio con tu teléfono y anota el ancho y largo disponible.</p>
                </div>
              </div>

              <div className="visualizer-step-item">
                <div className="step-badge-num">2</div>
                <div className="step-info">
                  <h4>Escoge Telas &amp; Materiales</h4>
                  <p>Elige entre más de 120 opciones: linos, cueros, piedras sinterizadas o telas Pet Friendly.</p>
                </div>
              </div>

              <div className="visualizer-step-item">
                <div className="step-badge-num">3</div>
                <div className="step-info">
                  <h4>Recibe tu Montaje &amp; Presupuesto</h4>
                  <p>Te mostramos cómo lucirá exactamente en tu hogar con cotización directa de fábrica sin costo.</p>
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="visualizer-cta-group">
              <a
                href={`https://wa.me/584141536516?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp visualizer-main-btn"
                aria-label="Enviar Foto y Medidas por WhatsApp"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-5.805 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                </svg>
                <span>Enviar Foto y Medidas por WhatsApp</span>
              </a>

              <Link href="/tiendas" className="btn btn-outline">
                Ver Showrooms en Caracas
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Living Canvas (3D Visualizer Stage) */}
          <div className="visualizer-stage-col">
            <div className="visualizer-3d-frame">
              
              {/* Main Ambient Stage Image */}
              <div className="visualizer-image-container">
                <img
                  src={activeSwatch.imgUrl}
                  alt={`Ambientación Bellagio en acabado ${activeSwatch.name}`}
                  className="visualizer-canvas-img"
                  width={680}
                  height={520}
                  loading="lazy"
                />
                
                {/* Architectural Measurement Dimension Callouts */}
                <div className="dimension-line dimension-top" aria-hidden="true">
                  <span className="dimension-tick left"></span>
                  <span className="dimension-label">Ancho: {activeSwatch.dimensions.split('×')[0]?.trim()}</span>
                  <span className="dimension-tick right"></span>
                </div>

                <div className="dimension-line dimension-side" aria-hidden="true">
                  <span className="dimension-tick top"></span>
                  <span className="dimension-label">Fondo: {activeSwatch.dimensions.split('×')[1]?.trim()}</span>
                  <span className="dimension-tick bottom"></span>
                </div>

                {/* Floating Scale Accuracy Badge */}
                <div className="visualizer-floating-badge">
                  <div className="pulse-beacon-dot"></div>
                  <div className="badge-text-box">
                    <span className="badge-tag-mini">Simulación en Vivo</span>
                    <strong className="badge-title-mini">{activeSwatch.name}</strong>
                  </div>
                </div>

                <div className="visualizer-glass-pill">
                  <span>📐 Montaje digital 100% a escala real</span>
                </div>
              </div>

              {/* Interactive Material & Fabric Swatches Control */}
              <div className="visualizer-swatches-control">
                <div className="swatches-header-row">
                  <span className="swatches-title">Muestra de Acabado en Pantalla:</span>
                  <span className="swatches-active-type">{activeSwatch.type}</span>
                </div>

                <div className="swatches-buttons-row">
                  {FABRIC_SWATCHES.map((swatch) => {
                    const isActive = activeSwatch.id === swatch.id;
                    return (
                      <button
                        key={swatch.id}
                        type="button"
                        className={`swatch-picker-btn ${isActive ? 'is-active' : ''}`}
                        onClick={() => setActiveSwatch(swatch)}
                        aria-label={`Ver en acabado ${swatch.name}`}
                      >
                        <span 
                          className="swatch-color-dot" 
                          style={{ backgroundColor: swatch.colorHex }}
                        />
                        <span className="swatch-name-label">{swatch.name.split(' ')[0]} {swatch.name.split(' ')[1] || ''}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
