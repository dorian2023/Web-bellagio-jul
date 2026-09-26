'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { STORES_DATA } from '@/src/data/stores';
import { StoreLocation } from '@/src/types/catalog';
import { getStoreLiveStatus } from '@/src/utils/storeStatus';
import ShowroomModal from '@/src/components/stores/ShowroomModal';

interface StoreGridProps {
  isStandalonePage?: boolean;
}

type SectorFilter = 'todos' | 'oeste' | 'este';

export default function StoreGrid({ isStandalonePage = false }: StoreGridProps) {
  const [activeSector, setActiveSector] = useState<SectorFilter>('todos');
  const [activeModalStore, setActiveModalStore] = useState<StoreLocation | null>(null);
  const [, setClockTick] = useState(0);

  // Dynamic time calculation refresh
  useEffect(() => {
    const timer = setInterval(() => setClockTick((prev) => prev + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  // Preload video buffer when hovering or focusing on store card
  const handleStoreWarmup = (videoUrl?: string) => {
    if (!videoUrl || typeof window === 'undefined') return;
    const existing = document.querySelector(`link[data-warmup="${videoUrl}"]`);
    if (!existing) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'video';
      link.href = videoUrl;
      link.setAttribute('data-warmup', videoUrl);
      document.head.appendChild(link);
    }
  };

  const filteredStores = useMemo(() => {
    if (activeSector === 'oeste') {
      return STORES_DATA.filter((s) => s.id === 'tienda-comercio' || s.id === 'tienda-mobili');
    }
    if (activeSector === 'este') {
      return STORES_DATA.filter((s) => s.id === 'tienda-casamall');
    }
    return STORES_DATA;
  }, [activeSector]);

  return (
    <section id="tiendas" className="section-wrapper stores-section-wrapper" aria-label="Nuestras Tiendas en Caracas">
      <div className="container">
        {/* Breadcrumb for Standalone Page */}
        {isStandalonePage && (
          <nav className="catalog-breadcrumb" aria-label="Navegación de migas de pan">
            <Link href="/" className="breadcrumb-back-btn">
              <span aria-hidden="true">←</span> Volver al Inicio
            </Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Showrooms en Caracas</span>
          </nav>
        )}

        <header className="section-header">
          <h1 className="section-title">
            Nuestras Tiendas &amp; <span className="gold-text">Showrooms en Caracas</span>
          </h1>
          <p className="section-subtitle">
            Descubre la alta ebanistería de Muebles Bellagio en persona. Tres espacios exclusivos diseñados para inspirar tus proyectos de interiorismo con asesoría de maestros artesanos.
          </p>
        </header>

        {/* Geographic Sector Selector Tabs (Standalone Page) */}
        {isStandalonePage && (
          <div className="stores-sector-filter" role="tablist" aria-label="Filtrar por sector de Caracas">
            <button
              type="button"
              role="tab"
              aria-selected={activeSector === 'todos'}
              className={`sector-tab-btn ${activeSector === 'todos' ? 'active' : ''}`}
              onClick={() => setActiveSector('todos')}
            >
              Todas las Sedes ({STORES_DATA.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeSector === 'oeste'}
              className={`sector-tab-btn ${activeSector === 'oeste' ? 'active' : ''}`}
              onClick={() => setActiveSector('oeste')}
            >
              Caracas Oeste — San Martín &amp; Bella Vista (2)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeSector === 'este'}
              className={`sector-tab-btn ${activeSector === 'este' ? 'active' : ''}`}
              onClick={() => setActiveSector('este')}
            >
              Caracas Este — Casa Mall Los Naranjos (1)
            </button>
          </div>
        )}

        {/* Stores Grid */}
        <div className={`stores-grid ${filteredStores.length === 1 ? 'single-store-view' : ''} ${filteredStores.length === 2 ? 'two-stores-view' : ''}`}>
          {filteredStores.map((store) => {
            const isFlagship = store.id === 'tienda-comercio';
            const sectorLabel = store.id === 'tienda-casamall' ? 'Caracas Este' : 'Caracas Oeste';
            const status = getStoreLiveStatus(store.id);
            const storeWhatsAppMsg = encodeURIComponent(
              `Hola Muebles Bellagio, deseo solicitar asesoría e información para visitar la tienda ${store.name}.`
            );

            return (
              <article
                key={store.id}
                className={`luxury-card store-card interactive-store-card ${isFlagship ? 'is-flagship' : ''}`}
                onClick={() => setActiveModalStore(store)}
                onMouseEnter={() => handleStoreWarmup(store.videoUrl)}
                onTouchStart={() => handleStoreWarmup(store.videoUrl)}
                onFocus={() => handleStoreWarmup(store.videoUrl)}
                role="button"
                tabIndex={0}
                aria-label={`Ver detalles y video del showroom de ${store.name}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveModalStore(store);
                  }
                }}
              >
                {/* Store image header */}
                <div className="store-video-container">
                  <img
                    src={store.posterUrl || '/images/hero-poster.webp'}
                    alt={`Fachada de ${store.name}`}
                    className="store-video-media"
                    loading="lazy"
                  />
                  <div className="store-video-gradient"></div>

                  <div className="store-top-badges">
                    <div className="store-badges-left">
                      <span
                        className={`store-status-beacon ${status.isOpen ? 'beacon-open' : 'beacon-closed'}`}
                        title={`Showroom ${status.statusLabel} (${status.statusDetail})`}
                        aria-label={`Showroom ${status.statusLabel}`}
                      >
                        <span className="beacon-core"></span>
                        <span className="beacon-ring"></span>
                      </span>
                      <span className="store-sector-badge">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {sectorLabel}
                      </span>
                    </div>
                    <span className={`store-badge-tag ${isFlagship ? 'flagship-tag' : ''}`}>
                      {store.badge}
                    </span>
                  </div>
                </div>

                <div className="store-card-body">
                  <h3 className="store-title">
                    {store.name}
                  </h3>

                  <ul className="store-info-list">
                    <li className="store-info-item">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <div>
                        <strong className="store-address-text">{store.address}</strong>
                        <div className="store-landmark-text">
                          {store.landmark}
                        </div>
                      </div>
                    </li>

                    <li className="store-info-item">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <div className="store-schedule-box">
                        <div className="store-schedule-live-row">
                          <span className={`store-schedule-dot ${status.isOpen ? 'dot-open' : 'dot-closed'}`}></span>
                          <strong className={`store-schedule-status ${status.isOpen ? 'text-open' : 'text-closed'}`}>
                            {status.statusLabel}
                          </strong>
                          <span className="store-schedule-hint">· {status.statusDetail}</span>
                        </div>
                        <span className="store-schedule-hours-text">{store.schedule}</span>
                      </div>
                    </li>

                    <li className="store-info-item">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      <a
                        href={`tel:${store.mobile}`}
                        className="store-phone-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {store.mobile}
                      </a>
                    </li>
                  </ul>

                  {/* Amenity Chips Row */}
                  <div className="store-features-row">
                    {store.features.map((feature, i) => (
                      <span key={i} className="store-feature-chip">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons Pinned at Bottom */}
                  <div className="store-actions" onClick={(e) => e.stopPropagation()}>
                    <a
                      href={store.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-gold btn-store-action btn-maps-action"
                      aria-label={`Ver ubicación en Google Maps de ${store.name}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                      </svg>
                      <span>Cómo Llegar</span>
                    </a>
                    <a
                      href={`https://wa.me/${store.whatsapp}?text=${storeWhatsAppMsg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp btn-store-action"
                      aria-label={`Escribir por WhatsApp a ${store.name}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-5.805 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                      </svg>
                      <span>Asesoría VIP</span>
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* VIP Experience & Concierge Banner for Standalone Page */}
        {isStandalonePage && (
          <div className="stores-vip-banner">
            <div className="stores-vip-content">
              <span className="stores-vip-label">Servicio de Ambientación &amp; Diseño Visual</span>
              <h3 className="stores-vip-title">¿Tienes la foto y las medidas de tu espacio? Nosotros le ponemos los muebles</h3>
              <p className="stores-vip-desc">
                Tómale una foto a tu sala, habitación o comedor con las medidas de tu área. En nuestros showrooms (o directo por WhatsApp) montamos digitalmente el modelo que te gusta para que veas exactamente cómo lucirá con las telas, colores y proporciones reales antes de fabricarlo.
              </p>
              <div className="stores-vip-perks">
                <div className="vip-perk-item">
                  <span className="vip-perk-icon">✓</span>
                  <span>Montaje digital a escala con tus medidas reales</span>
                </div>
                <div className="vip-perk-item">
                  <span className="vip-perk-icon">✓</span>
                  <span>Muestrario de más de 120 telas, linos y acabados</span>
                </div>
                <div className="vip-perk-item">
                  <span className="vip-perk-icon">✓</span>
                  <span>Asesoría personalizada y cotización formal sin costo</span>
                </div>
              </div>
            </div>
            <div className="stores-vip-cta-box">
              <a
                href="https://wa.me/584141536516?text=Hola%20Muebles%20Bellagio%2C%20tengo%20la%20foto%20y%20las%20medidas%20de%20mi%20espacio%20y%20deseo%20asesor%C3%ADa%20para%20ver%20c%C3%B3mo%20quedar%C3%ADan%20sus%20muebles."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp stores-vip-btn"
              >
                Enviar Foto y Medidas por WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Showroom Interactive Modal with Video Walkthrough */}
      {activeModalStore && (
        <ShowroomModal
          store={activeModalStore}
          onClose={() => setActiveModalStore(null)}
        />
      )}
    </section>
  );
}

