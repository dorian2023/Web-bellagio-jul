'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { Product } from '@/src/types/catalog';
import { isProductSelected, toggleProductSelection } from '@/src/utils/inquiry-cart';
import { getYouTubeEmbedUrl, getYouTubeThumbnailUrl } from '@/src/utils/media';
import { VenezuelaFlagIcon, ImportedGlobeIcon } from '@/src/components/shared/FlagIcons';
import { fetchCatalog } from '@/src/lib/supabase';
import { CATALOGS_DATA } from '@/src/data/catalogs';

function CategoryIcon({ categoryId }: { categoryId: string }) {
  switch (categoryId) {
    case 'dormitorios':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 9V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4M2 19h20M2 14h20v5H2zM4 9h16v5H4z"/>
        </svg>
      );
    case 'comedores':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <ellipse cx="12" cy="7" rx="9" ry="3"/>
          <path d="M5 7v10M19 7v10M12 10v10M2 17h20"/>
        </svg>
      );
    case 'sofas':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 9V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2M2 11v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6M2 15h20M5 19v2M19 19v2"/>
        </svg>
      );
    case 'sofacamas':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 11V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5M2 13v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5M2 17h20"/>
        </svg>
      );
    case 'poltronas':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3M4 11v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6M4 15h16M6 19v2M18 19v2"/>
        </svg>
      );
    case 'sillas':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M7 4h10M7 4v8h10V4M6 12h12v4H6zM6 16v5M18 16v5"/>
        </svg>
      );
    case 'mesas-de-centro':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <ellipse cx="12" cy="8" rx="8" ry="3"/>
          <path d="M7 10v8M17 10v8M12 11v9"/>
        </svg>
      );
    case 'mesas-de-noche':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="4" y="6" width="16" height="14" rx="2"/>
          <path d="M4 12h16M11 9h2M11 16h2M12 2v4"/>
        </svg>
      );
    case 'mesas-tv':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="7" width="20" height="11" rx="2"/>
          <path d="M17 2l-5 5-5-5M8 21h8M12 18v3"/>
        </svg>
      );
    case 'closet':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M12 3v18M8 12h.01M16 12h.01"/>
        </svg>
      );
    case 'gaveteros':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M3 9h18M3 15h18M11 6h2M11 12h2M11 18h2"/>
        </svg>
      );
    case 'ceibos':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2"/>
          <path d="M12 4v16M3 10h18M8 14v2M16 14v2"/>
        </svg>
      );
    case 'box-spring':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 4v16M2 8h20v12H2zM2 17h20M6 8v9M10 8v9M14 8v9M18 8v9"/>
        </svg>
      );
    case 'espejos':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="8"/>
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>
        </svg>
      );
    case 'peinadoras':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="12" width="18" height="9" rx="1"/>
          <circle cx="12" cy="7" r="4"/>
          <path d="M12 15v3"/>
        </svg>
      );
    case 'taburete':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <ellipse cx="12" cy="5" rx="6" ry="2"/>
          <path d="M8 7l-2 14M16 7l2 14M7 16h10"/>
        </svg>
      );
    case 'zapateras':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2"/>
          <path d="M3 10h18M3 15h18M7 8h1M11 8h1M15 8h1M7 13h1M11 13h1M15 13h1"/>
        </svg>
      );
    default:
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 9V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2M2 11v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6M2 15h20"/>
        </svg>
      );
  }
}

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onSelectProduct?: (product: Product) => void;
  allProducts?: Product[];
}

export default function ProductModal({
  product: initialProduct,
  onClose,
  onSelectProduct,
  allProducts = [],
}: ProductModalProps) {
  const [activeProduct, setActiveProduct] = useState<Product | null>(initialProduct);
  const [catalogList, setCatalogList] = useState<Product[]>(allProducts);
  const [mediaTab, setMediaTab] = useState<'photo' | 'video'>('photo');
  const [isVideoLoading, setIsVideoLoading] = useState<boolean>(true);
  const [isFullscreenZoom, setIsFullscreenZoom] = useState<boolean>(false);
  const [fullscreenScale, setFullscreenScale] = useState<number>(1.0);
  const [fullscreenPos, setFullscreenPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isMarked, setIsMarked] = useState<boolean>(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const fullscreenStageRef = useRef<HTMLDivElement | null>(null);
  const similarTrackRef = useRef<HTMLDivElement | null>(null);
  const isSimilarPausedRef = useRef<boolean>(false);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync active product when initialProduct changes
  useEffect(() => {
    setActiveProduct(initialProduct);
  }, [initialProduct]);

  // Load catalog items if not provided
  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      setCatalogList(allProducts);
      return;
    }

    fetchCatalog()
      .then(({ products }) => {
        if (products && products.length > 0) {
          setCatalogList(products);
        } else {
          setCatalogList(CATALOGS_DATA);
        }
      })
      .catch(() => {
        setCatalogList(CATALOGS_DATA);
      });
  }, [allProducts]);

  const product = activeProduct;

  // Filter similar products by matching category
  const similarProducts = useMemo(() => {
    if (!product || !catalogList.length) return [];
    return catalogList.filter(
      (p) =>
        p.category === product.category &&
        p.id !== product.id &&
        p.image &&
        p.image.trim().length > 0
    );
  }, [product, catalogList]);

  // Extract all distinct images for gallery (Cover + extra angles)
  const allImages: string[] = useMemo(() => {
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

  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const handleFullscreenPrevImage = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.stopPropagation();
    if (allImages.length <= 1) return;
    setFullscreenScale(1.0);
    setFullscreenPos({ x: 50, y: 50 });
    setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  const handleFullscreenNextImage = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.stopPropagation();
    if (allImages.length <= 1) return;
    setFullscreenScale(1.0);
    setFullscreenPos({ x: 50, y: 50 });
    setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  // Handle escape key, arrow keys, and body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreenZoom) {
          setIsFullscreenZoom(false);
        } else {
          onClose();
        }
      } else if (isFullscreenZoom) {
        if (e.key === 'ArrowLeft') {
          handleFullscreenPrevImage();
        } else if (e.key === 'ArrowRight') {
          handleFullscreenNextImage();
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
  }, [onClose, isFullscreenZoom, handleFullscreenPrevImage, handleFullscreenNextImage]);

  // Handle mobile touch on fullscreen modal
  const handleFullscreenTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleFullscreenTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const container = fullscreenStageRef.current;
    if (!container || !e.touches[0]) return;

    if (fullscreenScale > 1.0) {
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * 100;
      const y = ((touch.clientY - rect.top) / rect.height) * 100;
      setFullscreenPos({
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y)),
      });
    }
  }, [fullscreenScale]);

  const handleFullscreenTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    if (fullscreenScale > 1.0) {
      touchStartXRef.current = null;
      touchStartYRef.current = null;
      return;
    }
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchEndX - touchStartXRef.current;
    const diffY = touchEndY - touchStartYRef.current;

    // Horizontal swipe threshold > 45px
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        handleFullscreenPrevImage();
      } else {
        handleFullscreenNextImage();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const pauseAutoScrollTemporarily = useCallback((durationMs: number = 3500) => {
    isSimilarPausedRef.current = true;
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      isSimilarPausedRef.current = false;
    }, durationMs);
  }, []);

  // Smooth continuous auto-scroll to the left for similar products
  useEffect(() => {
    const track = similarTrackRef.current;
    if (!track || similarProducts.length <= 2) return;

    let animFrameId: number;
    let lastTime: number | null = null;
    const speed = 0.45; // Smooth luxury velocity (~27px/s)

    const step = (time: number) => {
      if (!isSimilarPausedRef.current && track) {
        if (lastTime !== null) {
          const delta = Math.min((time - lastTime) / 16.67, 2);
          track.scrollLeft += speed * delta;

          // Seamless infinite wrap around half width
          const halfScroll = track.scrollWidth / 2;
          if (halfScroll > 0 && track.scrollLeft >= halfScroll) {
            track.scrollLeft -= halfScroll;
          }
        }
        lastTime = time;
      } else {
        lastTime = null;
      }
      animFrameId = requestAnimationFrame(step);
    };

    animFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animFrameId);
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, [similarProducts]);

  const handleToggleMark = () => {
    if (!product) return;
    const updatedState = toggleProductSelection(product.id);
    setIsMarked(updatedState);
  };

  const handleSelectSimilar = (item: Product) => {
    setActiveProduct(item);
    if (onSelectProduct) {
      onSelectProduct(item);
    }
  };

  const handleScrollPrev = () => {
    pauseAutoScrollTemporarily(4000);
    if (similarTrackRef.current) {
      similarTrackRef.current.scrollBy({ left: -160, behavior: 'smooth' });
    }
  };

  const handleScrollNext = () => {
    pauseAutoScrollTemporarily(4000);
    if (similarTrackRef.current) {
      similarTrackRef.current.scrollBy({ left: 160, behavior: 'smooth' });
    }
  };

  const openFullscreen = () => {
    setFullscreenScale(1.0);
    setFullscreenPos({ x: 50, y: 50 });
    setIsFullscreenZoom(true);
  };

  if (!product) return null;

  const quoteMsg = encodeURIComponent(
    `Hola Muebles Bellagio, me interesa solicitar cotización y disponibilidad del producto: *${product.title}* (Categoría: ${product.categoryName}). ¿Podrían darme información de precios y acabados?`
  );

  return (
    <>
      <div 
        className="lightbox-overlay active open" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalProductTitle"
      >
        <div className="lightbox-container vip-modal" onClick={(e) => e.stopPropagation()}>
          {/* Close Button */}
          <button 
            type="button" 
            className="lightbox-close vip-close-btn" 
            onClick={onClose} 
            aria-label="Cerrar ventana"
            title="Cerrar (Esc)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div className="lightbox-content vip-modal-grid">
            {/* Left Column: Media Stage & Gallery */}
            <div className="lightbox-media-col vip-media-stage">
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
                    <Image 
                      src={currentDisplayImage || '/images/hero-poster.webp'} 
                      alt={`${product.title} - Ángulo ${selectedImageIndex + 1}`} 
                      className="lightbox-img main-product-img"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 750px"
                      quality={92}
                      priority
                      style={{ objectFit: 'contain' }}
                    />

                    {/* Fullscreen HD Expand Button (Icon-Only) */}
                    <button
                      type="button"
                      className="hd-fullscreen-trigger-btn"
                      onClick={openFullscreen}
                      title="Expandir a Pantalla Completa HD"
                      aria-label="Expandir a Pantalla Completa HD"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <polyline points="9 21 3 21 3 15"></polyline>
                        <line x1="21" y1="3" x2="14" y2="10"></line>
                        <line x1="3" y1="21" x2="10" y2="14"></line>
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Angle Selector Gallery Thumbnails */}
              {allImages.length > 1 && mediaTab === 'photo' && (
                <div className="product-angle-gallery" aria-label="Galería de ángulos del producto">
                  <div className="product-angle-track">
                    {allImages.map((imgUrl, idx) => {
                      const isSelected = idx === selectedImageIndex;
                      return (
                        <button
                          key={idx}
                          type="button"
                          className={`product-angle-thumb-btn ${isSelected ? 'active' : ''}`}
                          onClick={() => setSelectedImageIndex(idx)}
                          aria-label={`Ver foto ${idx + 1}`}
                          title={`Foto ${idx + 1}`}
                          style={{ position: 'relative' }}
                        >
                          <Image 
                            src={imgUrl} 
                            alt={`${product.title} ${idx + 1}`} 
                            fill
                            sizes="80px"
                            quality={80}
                            style={{ objectFit: 'cover' }}
                          />
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
                  <span className="catalog-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <CategoryIcon categoryId={product.category} />
                    <span>{product.categoryName}</span>
                  </span>
                  <span className={`vip-badge-pill ${product.origin === 'importado' ? 'origin-badge-importado' : 'origin-badge-nacional'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    {product.origin === 'importado' ? (
                      <>
                        <ImportedGlobeIcon width={12} height={12} />
                        <span>Importado</span>
                      </>
                    ) : (
                      <>
                        <VenezuelaFlagIcon width={14} height={10} />
                        <span>Nacional</span>
                      </>
                    )}
                  </span>
                  {product.stockStatus === 'agotado' && (
                    <span className="vip-badge-pill vip-stock-badge-out" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                      </svg>
                      <span>Agotado</span>
                    </span>
                  )}
                </div>
                <h2 id="modalProductTitle" className="lightbox-title">{product.title}</h2>
                {product.subtitle && (
                  <p className="lightbox-subtitle">{product.subtitle}</p>
                )}
              </div>

              {/* Description */}
              {product.description && product.description.trim().length > 0 && (
                <div className="lightbox-description">
                  <p>{product.description}</p>
                </div>
              )}

              {/* Technical Specifications & Atelier Details */}
              {((product.materials && product.materials.trim().length > 0) ||
                (product.dimensions && product.dimensions.trim().length > 0) ||
                (product.availableColors && product.availableColors.length > 0)) && (
                <div className="vip-atelier-specs-card">
                  {product.materials && product.materials.trim().length > 0 && (
                    <div className="atelier-spec-row">
                      <div className="atelier-spec-label">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                          <line x1="12" y1="22.08" x2="12" y2="12"/>
                        </svg>
                        <span>Materiales & Estructura</span>
                      </div>
                      <p className="atelier-spec-value">{product.materials}</p>
                    </div>
                  )}

                  {product.dimensions && product.dimensions.trim().length > 0 && (
                    <div className="atelier-spec-row">
                      <div className="atelier-spec-label">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        <span>Medidas / Dimensiones</span>
                      </div>
                      <p className="atelier-spec-value">{product.dimensions}</p>
                    </div>
                  )}

                  {product.availableColors && product.availableColors.length > 0 && (
                    <div className="atelier-spec-row">
                      <div className="atelier-spec-label">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                        </svg>
                        <span>Tonos & Acabados</span>
                      </div>
                      <p className="atelier-spec-value">
                        {Array.isArray(product.availableColors) ? product.availableColors.join(', ') : product.availableColors}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Dynamic Similar Products Carousel */}
              {similarProducts.length > 0 && (
                <div className="similar-products-section">
                  <div className="similar-products-header">
                    <span className="similar-products-tag">
                      <span className="similar-tag-icon">✨</span>
                      <span>Piezas Similares en {product.categoryName}</span>
                    </span>

                    {similarProducts.length > 2 && (
                      <div className="similar-nav-controls">
                        <button 
                          type="button" 
                          className="similar-nav-btn prev"
                          onClick={handleScrollPrev}
                          aria-label="Ver productos anteriores"
                          title="Anterior"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6"/>
                          </svg>
                        </button>
                        <button 
                          type="button" 
                          className="similar-nav-btn next"
                          onClick={handleScrollNext}
                          aria-label="Ver productos siguientes"
                          title="Siguiente"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"/>
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>

                  <div 
                    className="similar-carousel-wrapper"
                    onMouseEnter={() => { isSimilarPausedRef.current = true; }}
                    onMouseLeave={() => { isSimilarPausedRef.current = false; }}
                    onTouchStart={() => { pauseAutoScrollTemporarily(5000); }}
                  >
                    <div className="similar-products-track" ref={similarTrackRef}>
                      {(similarProducts.length > 2 
                        ? [...similarProducts, ...similarProducts] 
                        : similarProducts
                      ).map((item, index) => (
                        <button
                          key={`${item.id}-${index}`}
                          type="button"
                          className="similar-product-card"
                          onClick={() => handleSelectSimilar(item)}
                          title={`Ver ${item.title}`}
                        >
                          <div className="similar-img-box">
                            <img src={item.image} alt={item.title} loading="lazy" />
                          </div>
                          <span className="similar-title" title={item.title}>
                            {item.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Primary Action Controls */}
              <div className={`lightbox-actions vip-modal-actions ${product.stockStatus === 'agotado' ? 'is-out-of-stock-actions' : ''}`}>
                <a 
                  href={`https://wa.me/584141536516?text=${quoteMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`vip-whatsapp-btn ${product.stockStatus === 'agotado' ? 'vip-whatsapp-btn-out' : ''}`}
                  title={product.stockStatus === 'agotado' ? "Consultar próxima disponibilidad por WhatsApp" : "Cotizar directamente este producto por WhatsApp"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-5.805 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                  </svg>
                  <span>{product.stockStatus === 'agotado' ? 'Consultar Próximo Lote' : 'Cotizar WhatsApp'}</span>
                </a>

                {product.stockStatus !== 'agotado' && (
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dedicated Fullscreen HD Theater / Lightbox */}
      {isFullscreenZoom && (
        <div 
          className="fullscreen-hd-overlay" 
          onClick={() => setIsFullscreenZoom(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`Inspección en Pantalla Completa - ${product.title}`}
        >
          {/* Header Bar */}
          <header className="fullscreen-hd-header" onClick={(e) => e.stopPropagation()}>
            <div className="fullscreen-hd-title-group">
              <span className="catalog-tag">{product.categoryName}</span>
              <h3 className="fullscreen-hd-title">{product.title}</h3>
            </div>
            
            <div className="fullscreen-hd-actions">
              {allImages.length > 1 && (
                <span className="fullscreen-counter-badge">
                  {selectedImageIndex + 1} / {allImages.length}
                </span>
              )}

              <button
                type="button"
                className="fullscreen-zoom-btn"
                onClick={() => setFullscreenScale(prev => prev === 1.0 ? 2.2 : 1.0)}
                aria-label={fullscreenScale === 1.0 ? 'Acercar lupa' : 'Restablecer zoom'}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  {fullscreenScale === 1.0 ? (
                    <>
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      <line x1="11" y1="8" x2="11" y2="14" />
                      <line x1="8" y1="11" x2="14" y2="11" />
                    </>
                  ) : (
                    <>
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
                    </>
                  )}
                </svg>
                <span>{fullscreenScale === 1.0 ? 'Zoom 2.2x' : 'Resetear'}</span>
              </button>

              <button 
                type="button"
                className="fullscreen-close-btn" 
                onClick={() => setIsFullscreenZoom(false)}
                aria-label="Cerrar pantalla completa"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </header>

          {/* Main Stage with Side Arrows */}
          <div 
            ref={fullscreenStageRef}
            className={`fullscreen-hd-stage ${fullscreenScale > 1.0 ? 'is-zoomed' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setFullscreenScale(prev => prev === 1.0 ? 2.2 : 1.0);
            }}
            onMouseMove={(e) => {
              if (fullscreenScale <= 1.0) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              setFullscreenPos({ x, y });
            }}
            onTouchStart={handleFullscreenTouchStart}
            onTouchMove={handleFullscreenTouchMove}
            onTouchEnd={handleFullscreenTouchEnd}
          >
            {/* Side Navigation Arrow - Prev */}
            {allImages.length > 1 && (
              <button
                type="button"
                className="fullscreen-theater-nav prev"
                onClick={handleFullscreenPrevImage}
                aria-label="Ver foto anterior"
                title="Foto anterior (←)"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            )}

            {/* Stage Image */}
            <div className="fullscreen-img-wrapper">
              <img 
                src={currentDisplayImage} 
                alt={`${product.title} vista ${selectedImageIndex + 1}`}
                className="fullscreen-hd-img"
                style={{
                  transform: `scale(${fullscreenScale})`,
                  transformOrigin: `${fullscreenPos.x}% ${fullscreenPos.y}%`
                }}
                draggable={false}
              />
            </div>

            {/* Side Navigation Arrow - Next */}
            {allImages.length > 1 && (
              <button
                type="button"
                className="fullscreen-theater-nav next"
                onClick={handleFullscreenNextImage}
                aria-label="Ver foto siguiente"
                title="Foto siguiente (→)"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            )}
          </div>

          {/* Bottom Dock: Thumbnails & Keyboard Hint */}
          {allImages.length > 1 && (
            <footer className="fullscreen-hd-dock" onClick={(e) => e.stopPropagation()}>
              <div className="fullscreen-thumbnails-strip">
                {allImages.map((imgUrl, idx) => (
                  <button
                    key={`fs-thumb-${idx}`}
                    type="button"
                    className={`fullscreen-thumb-item ${selectedImageIndex === idx ? 'active' : ''}`}
                    onClick={() => {
                      setFullscreenScale(1.0);
                      setFullscreenPos({ x: 50, y: 50 });
                      setSelectedImageIndex(idx);
                    }}
                    aria-label={`Ver ángulo ${idx + 1}`}
                  >
                    <img src={imgUrl} alt={`${product.title} miniatura ${idx + 1}`} />
                  </button>
                ))}
              </div>
            </footer>
          )}
        </div>
      )}
    </>
  );
}
