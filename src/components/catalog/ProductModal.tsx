'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Product } from '@/src/types/catalog';
import { isProductSelected, toggleProductSelection } from '@/src/utils/inquiry-cart.js';
import { getYouTubeEmbedUrl, getYouTubeThumbnailUrl } from '@/src/utils/media.js';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [mediaTab, setMediaTab] = useState<'photo' | 'video'>('photo');
  const [isVideoLoading, setIsVideoLoading] = useState<boolean>(true);
  const [isZooming, setIsZooming] = useState<boolean>(false);
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [zoomScale, setZoomScale] = useState<number>(2.8);
  const [isFullscreenZoom, setIsFullscreenZoom] = useState<boolean>(false);
  const [fullscreenScale, setFullscreenScale] = useState<number>(1.0);
  const [fullscreenPos, setFullscreenPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isMarked, setIsMarked] = useState<boolean>(false);

  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const fullscreenStageRef = useRef<HTMLDivElement | null>(null);

  // Detect video availability and posters
  const videoUrl = product?.youtubeUrl || (product as any)?.video_url || '';
  const youtubeEmbedUrl = videoUrl ? getYouTubeEmbedUrl(videoUrl, true) : null;
  const videoPoster = (videoUrl ? getYouTubeThumbnailUrl(videoUrl) : null) || product?.image;
  const isDirectVideo = Boolean(videoUrl && (videoUrl.endsWith('.mp4') || videoUrl.endsWith('.webm') || videoUrl.includes('/videos/')));
  const hasVideo = Boolean(youtubeEmbedUrl || isDirectVideo);

  // Sync selection state with inquiry cart and reset media tab on product change
  useEffect(() => {
    setMediaTab('photo');
    setIsVideoLoading(true);
    setIsZooming(false);
    if (product) {
      setIsMarked(isProductSelected(product.id));
    }

    const handleCartUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ selectedIds?: string[] }>;
      if (product && customEvent.detail?.selectedIds) {
        setIsMarked(customEvent.detail.selectedIds.includes(String(product.id)));
      }
    };

    window.addEventListener('bellagio:cart-updated', handleCartUpdate);
    return () => {
      window.removeEventListener('bellagio:cart-updated', handleCartUpdate);
    };
  }, [product]);

  // Handle escape key and body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreenZoom) {
          setIsFullscreenZoom(false);
        } else {
          onClose();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose, isFullscreenZoom]);

  // Handle desktop mouse movement
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (mediaTab !== 'photo') return;
    const container = imageContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
    setIsZooming(true);
  }, [mediaTab]);

  const handleMouseLeave = useCallback(() => {
    setIsZooming(false);
  }, []);

  // Handle mobile touch drag & pan
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (mediaTab !== 'photo') return;
    const container = imageContainerRef.current;
    if (!container || !e.touches[0]) return;

    const touch = e.touches[0];
    const rect = container.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;

    setZoomPos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
    if (!isZooming) setIsZooming(true);
  }, [isZooming, mediaTab]);

  // Handle mobile touch on fullscreen modal
  const handleFullscreenTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const container = fullscreenStageRef.current;
    if (!container || !e.touches[0]) return;

    const touch = e.touches[0];
    const rect = container.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;

    setFullscreenPos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  }, []);

  const toggleZoom = useCallback(() => {
    if (mediaTab === 'photo') {
      setIsZooming((prev) => !prev);
    }
  }, [mediaTab]);

  const openFullscreen = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setFullscreenScale(1.0);
    setFullscreenPos({ x: 50, y: 50 });
    setIsFullscreenZoom(true);
  }, []);

  const handleToggleMark = () => {
    if (!product) return;
    const nextState = toggleProductSelection(product.id);
    setIsMarked(nextState);
  };

  if (!product) return null;

  const quoteMsg = encodeURIComponent(
    `Hola Muebles Bellagio, solicito asesoría y cotización formal de: ${product.title} (${product.categoryName}). ¿Tienen disponibilidad o fabrican con medidas personalizadas?`
  );

  return (
    <>
      <div className="lightbox-overlay open" onClick={onClose} role="dialog" aria-modal="true">
        <div className="lightbox-modal vip-product-modal" onClick={(e) => e.stopPropagation()}>
          {/* Mobile Luxury Sheet Grab Handle */}
          <div className="sheet-drag-handle" aria-hidden="true">
            <span className="drag-pill"></span>
          </div>

          <button 
            type="button" 
            className="lightbox-close-btn" 
            onClick={onClose}
            aria-label="Cerrar detalles del producto"
            title="Cerrar (Esc)"
          >
            ✕
          </button>

          <div className="lightbox-grid">
            {/* Product Media Column (Photos / Video Switcher) */}
            <div className="lightbox-img-col vip-img-col">
              {/* Media Switcher Pills (Visible when product has video) */}
              {hasVideo && (
                <div className="product-media-switcher-tabs" role="tablist" aria-label="Selector de Foto y Video">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={mediaTab === 'photo'}
                    className={`media-tab-btn ${mediaTab === 'photo' ? 'active' : ''}`}
                    onClick={() => setMediaTab('photo')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <span>Foto HD</span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    aria-selected={mediaTab === 'video'}
                    className={`media-tab-btn ${mediaTab === 'video' ? 'active' : ''}`}
                    onClick={() => {
                      setMediaTab('video');
                      setIsVideoLoading(true);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                    <span>Ver Video</span>
                    <span className="media-video-dot" aria-hidden="true" />
                  </button>
                </div>
              )}

              <div 
                ref={imageContainerRef}
                className={`lightbox-img-stage ${isZooming ? 'is-inspecting' : ''} ${mediaTab === 'video' ? 'is-video-active' : ''}`}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onTouchMove={handleTouchMove}
                onClick={toggleZoom}
                title={mediaTab === 'photo' ? 'Pasa el cursor o arrastra el dedo para zoom HD' : undefined}
              >
                {mediaTab === 'video' ? (
                  <div className="product-modal-video-wrapper" onClick={(e) => e.stopPropagation()}>
                    {/* Instant Video Skeleton / Poster Facade (No blank/frozen screens) */}
                    {isVideoLoading && (
                      <div className="product-video-poster-overlay">
                        {videoPoster && (
                          <img 
                            src={videoPoster} 
                            alt={`Cargando video de ${product.title}`} 
                            className="product-video-poster-img"
                            loading="eager"
                          />
                        )}
                        <div className="product-video-loader-backdrop">
                          <div className="product-video-spinner" aria-hidden="true" />
                          <span className="product-video-loader-text">Conectando Video HD...</span>
                        </div>
                      </div>
                    )}

                    {youtubeEmbedUrl ? (
                      <iframe
                        src={youtubeEmbedUrl}
                        title={`Video del producto ${product.title}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        loading="eager"
                        onLoad={() => setIsVideoLoading(false)}
                        className={`product-modal-iframe ${isVideoLoading ? 'is-loading' : 'is-loaded'}`}
                      />
                    ) : isDirectVideo ? (
                      <video
                        src={videoUrl}
                        controls
                        autoPlay
                        playsInline
                        loop
                        preload="metadata"
                        poster={videoPoster || undefined}
                        onLoadedData={() => setIsVideoLoading(false)}
                        onCanPlay={() => setIsVideoLoading(false)}
                        className={`product-modal-direct-video ${isVideoLoading ? 'is-loading' : 'is-loaded'}`}
                      />
                    ) : null}
                  </div>
                ) : (
                  <>
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      className="lightbox-img main-product-img"
                      style={
                        isZooming
                          ? {
                              transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                              transform: `scale(${zoomScale})`,
                            }
                          : undefined
                      }
                    />

                    {/* Luxury Magnifier Badge */}
                    <div className={`hd-zoom-badge ${isZooming ? 'active' : ''}`} aria-hidden="true">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        <line x1="11" y1="8" x2="11" y2="14"></line>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                      </svg>
                      <span>{isZooming ? `Zoom HD ${zoomScale}x (Arrastra para mover)` : 'Toca para Zoom HD'}</span>
                    </div>

                    {/* Fullscreen HD Expand Button */}
                    <button
                      type="button"
                      className="hd-fullscreen-trigger-btn"
                      onClick={openFullscreen}
                      title="Ver imagen en pantalla completa HD"
                      aria-label="Ver imagen en pantalla completa HD"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <polyline points="9 21 3 21 3 15"></polyline>
                        <line x1="21" y1="3" x2="14" y2="10"></line>
                        <line x1="3" y1="21" x2="10" y2="14"></line>
                      </svg>
                      <span>Pantalla Completa</span>
                    </button>

                    {/* Zoom Scale Pill Controls (Visible when active) */}
                    {isZooming && (
                      <div className="hd-zoom-controls" onClick={(e) => e.stopPropagation()}>
                        <button 
                          type="button" 
                          className="zoom-ctrl-btn" 
                          onClick={() => setZoomScale((s) => Math.max(2.0, parseFloat((s - 0.4).toFixed(1))))}
                          title="Reducir aumento"
                        >
                          −
                        </button>
                        <span className="zoom-ctrl-scale">{zoomScale.toFixed(1)}x</span>
                        <button 
                          type="button" 
                          className="zoom-ctrl-btn" 
                          onClick={() => setZoomScale((s) => Math.min(3.8, parseFloat((s + 0.4).toFixed(1))))}
                          title="Aumentar zoom"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Product Details Column */}
            <div className="lightbox-info-col vip-info-col">
              <div className="vip-modal-header">
                <div className="vip-badge-row">
                  <span className="catalog-tag">
                    {product.categoryName}
                  </span>
                  <span className="vip-badge-pill">
                    ✨ Calidad Garantizada
                  </span>
                </div>
                <h2 className="lightbox-title">{product.title}</h2>
                {product.subtitle && (
                  <p className="lightbox-subtitle">{product.subtitle}</p>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="lightbox-description">
                  <p>{product.description}</p>
                </div>
              )}

              {/* Technical Specifications */}
              <div className="lightbox-specs vip-specs">
                {product.materials && (
                  <div className="lightbox-spec-item">
                    <strong>Materiales Nobles:</strong>
                    <span>{product.materials}</span>
                  </div>
                )}
                {product.dimensions && (
                  <div className="lightbox-spec-item">
                    <strong>Dimensiones:</strong>
                    <span>{product.dimensions}</span>
                  </div>
                )}
              </div>

              {/* Trust Value Badges */}
              <div className="vip-modal-features">
                <div className="vip-feature-chip">
                  <span className="vip-chip-icon">⚜️</span>
                  <span>Fabricación a Medida</span>
                </div>
                <div className="vip-feature-chip">
                  <span className="vip-chip-icon">🏬</span>
                  <span>Showrooms Caracas</span>
                </div>
                <div className="vip-feature-chip">
                  <span className="vip-chip-icon">🛡️</span>
                  <span>Garantía Bellagio</span>
                </div>
              </div>

              {/* Primary Action Controls */}
              <div className="lightbox-actions vip-modal-actions">
                <a 
                  href={`https://wa.me/584141536516?text=${quoteMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vip-whatsapp-btn"
                  title="Cotizar directamente este producto por WhatsApp"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-5.805 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                  </svg>
                  <span>Cotizar WhatsApp</span>
                </a>

                <button
                  type="button"
                  className={`vip-mark-btn ${isMarked ? 'is-marked' : ''}`}
                  onClick={handleToggleMark}
                  title={isMarked ? "Quitar de mi lista de cotización" : "Marcar producto para armar lista de cotización"}
                >
                  {isMarked ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                      </svg>
                      <span>✓ Marcado</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                      </svg>
                      <span>Marcar Producto</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dedicated Fullscreen HD Zoom Modal */}
      {isFullscreenZoom && (
        <div 
          className="fullscreen-hd-overlay" 
          onClick={() => setIsFullscreenZoom(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Inspección en Pantalla Completa HD"
        >
          <header className="fullscreen-hd-header" onClick={(e) => e.stopPropagation()}>
            <div className="fullscreen-hd-title-group">
              <span className="catalog-tag" style={{ marginBottom: 2 }}>{product.categoryName}</span>
              <h3 className="fullscreen-hd-title">{product.title}</h3>
            </div>

            <button
              type="button"
              className="fullscreen-hd-close"
              onClick={() => setIsFullscreenZoom(false)}
              aria-label="Cerrar vista de pantalla completa"
              title="Cerrar (Esc)"
            >
              ✕
            </button>
          </header>

          <div 
            ref={fullscreenStageRef}
            className="fullscreen-hd-stage"
            onClick={(e) => e.stopPropagation()}
            onTouchMove={handleFullscreenTouchMove}
            title="Arrastra para explorar la pieza en detalle"
          >
            <img 
              src={product.image} 
              alt={product.title}
              className="fullscreen-hd-img"
              style={{
                transformOrigin: `${fullscreenPos.x}% ${fullscreenPos.y}%`,
                transform: `scale(${fullscreenScale})`,
              }}
            />
          </div>

          <footer className="fullscreen-hd-controls" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="fullscreen-hd-btn"
              onClick={() => setFullscreenScale((s) => Math.max(1.0, parseFloat((s - 0.5).toFixed(1))))}
              title="Reducir"
            >
              −
            </button>

            <span className="fullscreen-hd-scale-text">{fullscreenScale.toFixed(1)}x</span>

            <button
              type="button"
              className="fullscreen-hd-btn"
              onClick={() => setFullscreenScale((s) => Math.min(4.5, parseFloat((s + 0.5).toFixed(1))))}
              title="Aumentar"
            >
              +
            </button>

            <button
              type="button"
              className="fullscreen-hd-reset-btn"
              onClick={() => {
                setFullscreenScale(1.0);
                setFullscreenPos({ x: 50, y: 50 });
              }}
              title="Restablecer tamaño original"
            >
              Ajustar 1x
            </button>
          </footer>
        </div>
      )}
    </>
  );
}
