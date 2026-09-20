'use client';

import React, { useEffect, useRef, useState } from 'react';
import { StoreLocation } from '@/src/types/catalog';
import { getStoreLiveStatus } from '@/src/utils/storeStatus';

interface ShowroomModalProps {
  store: StoreLocation | null;
  onClose: () => void;
}

export default function ShowroomModal({ store, onClose }: ShowroomModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState<'video' | 'foto'>('video');
  const [isMuted, setIsMuted] = useState(true);
  const [isTilting, setIsTilting] = useState(false);

  // Handle ESC key and scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  // Autoplay video when modal opens or tab changes
  useEffect(() => {
    if (store && activeTab === 'video' && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = isMuted;
      videoRef.current.play().catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, [store, activeTab]);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  // 3D Parallax Mouse Tracking (Impeccable 3D Motion)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!modalRef.current) return;
    const rect = modalRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const normX = (x - centerX) / centerX;
    const normY = (y - centerY) / centerY;

    const maxDeg = 6.0; // Subtle luxury 6 degree angle
    const rotateY = normX * maxDeg;
    const rotateX = -normY * maxDeg;

    const lightX = (x / rect.width) * 100;
    const lightY = (y / rect.height) * 100;

    modalRef.current.style.setProperty('--modal-rx', `${rotateX.toFixed(2)}deg`);
    modalRef.current.style.setProperty('--modal-ry', `${rotateY.toFixed(2)}deg`);
    modalRef.current.style.setProperty('--light-x', `${lightX.toFixed(1)}%`);
    modalRef.current.style.setProperty('--light-y', `${lightY.toFixed(1)}%`);

    if (!isTilting) setIsTilting(true);
  };

  const handleMouseLeave = () => {
    if (!modalRef.current) return;
    modalRef.current.style.setProperty('--modal-rx', '0deg');
    modalRef.current.style.setProperty('--modal-ry', '0deg');
    modalRef.current.style.setProperty('--light-x', '50%');
    modalRef.current.style.setProperty('--light-y', '50%');
    setIsTilting(false);
  };

  if (!store) return null;

  const isFlagship = store.id === 'tienda-comercio';
  const isCasaMall = store.id === 'tienda-casamall';
  const sectorLabel = isCasaMall ? 'Caracas Este' : 'Caracas Oeste';
  const status = getStoreLiveStatus(store.id);

  const storeWhatsAppMsg = encodeURIComponent(
    `Hola Muebles Bellagio, deseo solicitar asesoría e información para visitar la sede ${store.name} (${store.address}).`
  );

  return (
    <div className="lightbox-overlay open luxury-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        ref={modalRef}
        className={`lightbox-modal luxury-showroom-modal ${isTilting ? 'is-3d-tilting' : ''}`} 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Specular 3D Lighting Glare */}
        <div className="luxury-modal-3d-glare" aria-hidden="true" />

        {/* Floating Close Button */}
        <button 
          type="button" 
          className="luxury-modal-close" 
          onClick={onClose}
          aria-label="Cerrar modal de sede"
          title="Cerrar (Esc)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="luxury-showroom-grid">
          {/* ============================================================
              LEFT: CINEMATIC MEDIA STAGE (Vertical Reel Player + Ambient Glow)
             ============================================================ */}
          <div className="luxury-showroom-stage">
            {/* Ambient Background Glow (eliminates dark empty bars) */}
            <div 
              className="luxury-stage-ambient-glow"
              style={{
                backgroundImage: `url(${store.posterUrl || '/images/hero-poster.webp'})`
              }}
              aria-hidden="true"
            />
            <div className="luxury-stage-ambient-overlay" aria-hidden="true" />

            {/* Floating Top Media Switcher */}
            <div className="luxury-stage-topbar">
              <div className="luxury-stage-tabs" role="tablist" aria-label="Selector de vista">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'video'}
                  className={`luxury-tab-pill ${activeTab === 'video' ? 'active' : ''}`}
                  onClick={() => setActiveTab('video')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polygon points="23 7 16 12 23 17 23 7"></polygon>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                  </svg>
                  <span>Video HD</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'foto'}
                  className={`luxury-tab-pill ${activeTab === 'foto' ? 'active' : ''}`}
                  onClick={() => setActiveTab('foto')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  <span>Fachada</span>
                </button>
              </div>

              {activeTab === 'video' && store.videoUrl && (
                <button
                  type="button"
                  className="luxury-sound-toggle-btn"
                  onClick={toggleSound}
                  aria-label={isMuted ? 'Activar audio' : 'Silenciar audio'}
                  title={isMuted ? 'Activar sonido' : 'Silenciar'}
                >
                  {isMuted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <line x1="23" y1="9" x2="17" y2="15"></line>
                      <line x1="17" y1="9" x2="23" y2="15"></line>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                  )}
                  <span>{isMuted ? 'Silenciado' : 'Audio On'}</span>
                </button>
              )}
            </div>

            {/* Sharp Centered Smartphone / Frame Media Container */}
            <div className="luxury-phone-frame-wrapper">
              <div className="luxury-phone-frame">
                {activeTab === 'video' && store.videoUrl ? (
                  <video
                    ref={videoRef}
                    src={store.videoUrl}
                    poster={store.posterUrl}
                    className="luxury-phone-video"
                    controls
                    playsInline
                    loop
                    muted={isMuted}
                    aria-label={`Recorrido en video de la sede ${store.name}`}
                  />
                ) : (
                  <img
                    src={store.posterUrl || '/images/hero-poster.webp'}
                    alt={`Fachada de ${store.name}`}
                    className="luxury-phone-photo"
                  />
                )}
              </div>
            </div>

            {/* Bottom Media Caption */}
            <div className="luxury-stage-footer-caption">
              <span className="caption-dot"></span>
              <span>{store.landmark}</span>
            </div>
          </div>

          {/* ============================================================
              RIGHT: EDITORIAL SHOWROOM ATELIER INFO
             ============================================================ */}
          <div className="luxury-showroom-info">
            {/* Live Status & Badges - Single elegant horizontal line */}
            <div className="luxury-info-top-strip">
              <div 
                className={`luxury-live-status ${status.isOpen ? 'is-open' : 'is-closed'}`}
                title={`Showroom ${status.statusLabel} · ${status.statusDetail}`}
                aria-label={`Showroom ${status.statusLabel}`}
              >
                <span className="live-status-pulse"></span>
                <span>{status.isOpen ? 'Abierto' : 'Cerrado'}</span>
              </div>
              <span className="luxury-sector-pill">{sectorLabel}</span>
              <span className={`luxury-badge-pill ${isFlagship ? 'gold-flagship' : ''}`}>
                {store.badge}
              </span>
            </div>

            {/* Title & Address */}
            <div className="luxury-info-main-head">
              <span className="luxury-kicker">Muebles Bellagio Caracas</span>
              <h2 className="luxury-modal-title">{store.name}</h2>
              <p className="luxury-modal-address">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{store.address}</span>
              </p>
            </div>

            {/* Key Visit Cards */}
            <div className="luxury-details-grid">
              <div className="luxury-detail-card">
                <div className="detail-card-icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div className="detail-card-text">
                  <span className="detail-card-title">Horario de Visitas</span>
                  <strong className="detail-card-val">{store.schedule}</strong>
                </div>
              </div>

              <div className="luxury-detail-card">
                <div className="detail-card-icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div className="detail-card-text">
                  <span className="detail-card-title">Atención Telefónica Directa</span>
                  <a href={`tel:${store.mobile}`} className="detail-card-phone">
                    {store.mobile}
                  </a>
                </div>
              </div>
            </div>

            {/* Exclusive Amenities & Services */}
            <div className="luxury-amenities-section">
              <span className="amenities-kicker">Servicios Exclusivos en Sede</span>
              <div className="luxury-amenities-chips">
                {store.features.map((feature, i) => (
                  <span key={i} className="luxury-amenity-chip">
                    <span className="amenity-chip-check">✓</span>
                    <span>{feature}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="luxury-modal-actions-box">
              <a 
                href={`https://wa.me/${store.whatsapp}?text=${storeWhatsAppMsg}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="luxury-action-btn luxury-btn-whatsapp"
                aria-label={`Contactar por WhatsApp a ${store.name}`}
              >
                <div className="action-btn-glow" aria-hidden="true" />
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-5.805 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                </svg>
                <div className="action-btn-text">
                  <span className="btn-main-label">Solicitar Asesoría VIP en Sede</span>
                  <span className="btn-sub-label">Atención Inmediata por WhatsApp</span>
                </div>
              </a>

              <a 
                href={store.mapsUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="luxury-action-btn luxury-btn-maps" 
                aria-label={`Abrir ubicación de ${store.name} en Google Maps`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                </svg>
                <span>Navegar con Google Maps / Waze</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

