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
  const [isFullscreenZoom, setIsFullscreenZoom] = useState<boolean>(false);
  const [fullscreenScale, setFullscreenScale] = useState<number>(1.0);
  const [fullscreenPos, setFullscreenPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isMarked, setIsMarked] = useState<boolean>(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const fullscreenStageRef = useRef<HTMLDivElement | null>(null);

  // Extract all distinct images for gallery (Cover + extra angles)
  const allImages: string[] = React.useMemo(() => {
    if (!product) return [];
    const list: string[] = [];
    if (product.image) list.push(product.image);
    if (Array.isArray(product.galleryImages)) {
      product.galleryImages.forEach((img) => {
        if (img && !list.includes(img)) {
          list.push(img);
        }
      });
    }
    return list.length > 0 ? list : ['/images/hero-poster.webp'];
  }, [product]);

  const currentDisplayImage = allImages[selectedImageIndex] || product?.image || '/images/hero-poster.webp';

  // Detect video availability and posters
  const videoUrl = product?.youtubeUrl || (product as any)?.video_url || '';
  const youtubeEmbedUrl = videoUrl ? getYouTubeEmbedUrl(videoUrl, true) : null;
  const videoPoster = (videoUrl ? getYouTubeThumbnailUrl(videoUrl) : null) || currentDisplayImage;
  const isDirectVideo = Boolean(videoUrl && (videoUrl.endsWith('.mp4') || videoUrl.endsWith('.webm') || videoUrl.includes('/videos/')));
  const hasVideo = Boolean(youtubeEmbedUrl || isDirectVideo);

  // Sync selection state with inquiry cart and reset media tab on product change
  useEffect(() => {
    setMediaTab('photo');
    setIsVideoLoading(true);
    setSelectedImageIndex(0);
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


  const openFullscreen = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setFullscreenScale(1.0);
    setFullscreenPos({ x: 50, y: 50 });
    setIsFullscreenZoom(true);
  }, []);

  const handleToggleMark = () => {
    if (!product) return;
    const nextState = toggleProductSelection(product.id, product);
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
                className={`lightbox-img-stage ${mediaTab === 'video' ? 'is-video-active' : ''}`}
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
                      src={currentDisplayImage} 
                      alt={`${product.title} - Ángulo ${selectedImageIndex + 1}`} 
                      className="lightbox-img main-product-img"
                    />

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
                  </>
                )}
              </div>

              {/* Luxury Multi-Angle Thumbnails Gallery Strip */}
              {allImages.length > 1 && (
                <div className="product-angle-thumbnails-strip" role="group" aria-label="Selector de ángulos y vistas">
                  <div className="thumbnails-scroll-container">
                    {allImages.map((imgUrl, idx) => {
                      const isSelected = selectedImageIndex === idx && mediaTab === 'photo';
                      return (
                        <button
                          key={idx}
                          type="button"
                          className={`angle-thumb-btn ${isSelected ? 'active' : ''}`}
                          onClick={() => {
                            setSelectedImageIndex(idx);
                            setMediaTab('photo');
                          }}
                          aria-label={`Ver ángulo ${idx + 1} de ${allImages.length}`}
                          title={`Ver vista / ángulo ${idx + 1}`}
                        >
                          <img src={imgUrl} alt={`${product.title} ángulo ${idx + 1}`} loading="lazy" />
                          <span className="angle-thumb-pill">
                            {idx === 0 ? 'Portada' : `Ángulo ${idx + 1}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
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
              src={currentDisplayImage} 
              alt={`${product.title} - Ángulo ${selectedImageIndex + 1}`}
              className="fullscreen-hd-img"
              style={{
                transformOrigin: `${fullscreenPos.x}% ${fullscreenPos.y}%`,
                transform: `scale(${fullscreenScale})`,
              }}
            />
          </div>

          <footer className="fullscreen-hd-controls" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
            </div>

            {/* Quick Angle switcher in Fullscreen */}
            {allImages.length > 1 && (
              <div className="fullscreen-hd-angles-row">
                {allImages.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`fullscreen-angle-dot ${selectedImageIndex === idx ? 'active' : ''}`}
                    onClick={() => setSelectedImageIndex(idx)}
                    title={`Ver Ángulo ${idx + 1}`}
                  >
                    {idx === 0 ? 'Portada' : `Ángulo ${idx + 1}`}
                  </button>
                ))}
              </div>
            )}
          </footer>
        </div>
      )}
    </>
  );
}
