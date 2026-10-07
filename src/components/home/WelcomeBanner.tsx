'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { fetchCatalog } from '@/src/lib/supabase';
import { Product } from '@/src/types/catalog';
import { CATALOGS_DATA } from '@/src/data/catalogs';

// Display timing: shows smoothly right after arrival on the home page
const SHOW_DELAY_MS = 600;
const CAROUSEL_INTERVAL_MS = 4000;

interface CarouselProduct {
  id: string;
  title: string;
  categoryName: string;
  image: string;
}

// Curated instant initial fallback to avoid any blank gap on render
const INITIAL_CURATED_PRODUCTS: CarouselProduct[] = [
  {
    id: 'init-1',
    title: 'Comedor Prado',
    categoryName: 'Comedores',
    image: 'https://vjtjwifynfzdjkdpruty.supabase.co/storage/v1/object/public/product-images/products/229469ca-a18e-49a8-9c1f-8ef56a003c06-1789348763357.webp'
  },
  {
    id: 'init-2',
    title: 'Cama Duplex Sasha',
    categoryName: 'Dormitorios',
    image: 'https://vjtjwifynfzdjkdpruty.supabase.co/storage/v1/object/public/product-images/products/abc24531-3e43-494a-b337-3513fe5033d3-1789689762859.webp'
  },
  {
    id: 'init-3',
    title: 'Comedor Paris',
    categoryName: 'Comedores',
    image: 'https://vjtjwifynfzdjkdpruty.supabase.co/storage/v1/object/public/product-images/products/ea3fb21d-449f-4525-ae3e-6384affe3231-1789348533437.webp'
  }
];

export function WelcomeBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [products, setProducts] = useState<CarouselProduct[]>(INITIAL_CURATED_PRODUCTS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Show banner smoothly right after arrival on the homepage
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, SHOW_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  // Load live catalog products from Supabase
  useEffect(() => {
    let isMounted = true;

    async function loadCarouselProducts() {
      try {
        const data = await fetchCatalog();
        if (!isMounted) return;

        const catalogProducts: Product[] = data?.products?.length > 0 ? data.products : [];

        // Filter products with valid image URLs
        const validProducts = catalogProducts.filter(
          (p) => p.image && typeof p.image === 'string' && p.image.trim().length > 0
        );

        if (validProducts.length > 0) {
          const items: CarouselProduct[] = validProducts.slice(0, 8).map((p) => ({
            id: p.id,
            title: p.title,
            categoryName: p.categoryName || p.category || 'Muebles Bellagio',
            image: p.image,
          }));
          setProducts(items);
          setIsLoadingCatalog(false);
          return;
        }
      } catch (error) {
        console.warn('Fallback to local catalogs data for welcome banner:', error);
      }

      if (!isMounted) return;

      // Fallback from static catalogs dataset if DB fetch fails
      const fallbackWithImages = CATALOGS_DATA.filter(
        (p) => p.image && p.image.trim().length > 0
      );
      if (fallbackWithImages.length > 0) {
        const fallbackItems: CarouselProduct[] = fallbackWithImages.slice(0, 8).map((p) => ({
          id: p.id,
          title: p.title,
          categoryName: p.categoryName || 'Colección Exclusiva',
          image: p.image,
        }));
        setProducts(fallbackItems);
      }
      setIsLoadingCatalog(false);
    }

    loadCarouselProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Auto carousel loop with smooth slide transition
  useEffect(() => {
    if (!isVisible || products.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        setPrevIndex(prev);
        return (prev + 1) % products.length;
      });
    }, CAROUSEL_INTERVAL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isVisible, products.length]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, handleClose]);

  const handleImageLoaded = (id: string) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, idx: number) => {
    // If external Supabase image fails, gracefully fallback to local hero poster
    const target = e.currentTarget;
    target.src = '/images/stores/tienda-casamall.jpg';
    setLoadedImages((prev) => ({ ...prev, [`item-${idx}`]: true }));
  };

  if (!isVisible) return null;

  return (
    <div className="wb-overlay" onClick={handleClose} role="dialog" aria-modal="true" aria-labelledby="wb-title">
      <div className="wb-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          className="wb-close-btn"
          onClick={handleClose}
          aria-label="Cerrar ventana de bienvenida"
          type="button"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Left Column: Pure Luxury Dynamic Showcase with Shimmer Loader */}
        <div className="wb-carousel">
          {/* Collection Luxury Badge */}
          <div className="wb-luxury-badge">
            <span className="wb-badge-dot"></span>
            <span>Colección 2026</span>
          </div>

          {/* Luxury Skeleton Shimmer state shown while image is loading */}
          {(!loadedImages[`img-${products[currentIndex]?.id || currentIndex}`]) && (
            <div className="wb-shimmer-placeholder" aria-hidden="true">
              <div className="wb-shimmer-logo">
                <span className="wb-logo-letter">B</span>
                <span className="wb-shimmer-pulse"></span>
              </div>
              <p className="wb-shimmer-text">Preparando exhibición...</p>
              <div className="wb-shimmer-wave"></div>
            </div>
          )}

          {products.map((product, idx) => {
            const isActive = idx === currentIndex;
            const isPrev = idx === prevIndex;
            const imgKey = `img-${product.id || idx}`;
            const isImageLoaded = loadedImages[imgKey] || false;

            let slideClass = 'wb-carousel-slide';
            if (isActive) slideClass += ' active';
            else if (isPrev) slideClass += ' prev';

            return (
              <div key={product.id || idx} className={slideClass}>
                <div className="wb-carousel-img-wrapper">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.title}
                    className={`wb-carousel-img ${isImageLoaded ? 'loaded' : 'loading'}`}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    onLoad={() => handleImageLoaded(imgKey)}
                    onError={(e) => handleImageError(e, idx)}
                  />
                </div>
                <div className="wb-carousel-info">
                  <span className="wb-category-pill">{product.categoryName}</span>
                  <h4 className="wb-product-title">{product.title}</h4>
                </div>
              </div>
            );
          })}

          {/* Carousel Progress Indicators (Dots) */}
          {products.length > 1 && (
            <div className="wb-carousel-dots">
              {products.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => {
                    setPrevIndex(currentIndex);
                    setCurrentIndex(dotIdx);
                  }}
                  className={`wb-dot ${dotIdx === currentIndex ? 'active' : ''}`}
                  aria-label={`Ver producto ${dotIdx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Centered Title & Promo Content */}
        <div className="wb-content">
          <div className="wb-heading-container">
            <h3 id="wb-title" className="wb-heading">
              Bienvenidos a
              <span className="gold-glow">Muebles Bellagio</span>
            </h3>
          </div>

          <p className="wb-description">
            Recibe un <strong style={{ color: '#18181B', fontWeight: 700 }}>descuento de temporada</strong> en nuestras tiendas al seleccionar tus piezas en el catálogo y cotizar directamente por WhatsApp.
          </p>

          <div className="wb-steps">
            <div className="wb-step-item">
              <span className="wb-step-icon">1</span>
              <span>Explora nuestras colecciones de alta gama</span>
            </div>
            <div className="wb-step-item">
              <span className="wb-step-icon">2</span>
              <span>Cotiza vía WhatsApp y obtén tu descuento en tienda</span>
            </div>
          </div>

          <div className="wb-actions">
            <Link href="/catalogo" className="wb-btn-primary" onClick={handleClose}>
              <span>Explorar Catálogo & Obtener Descuento</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>

            <button className="wb-btn-secondary" onClick={handleClose} type="button">
              No por ahora, continuar navegando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

