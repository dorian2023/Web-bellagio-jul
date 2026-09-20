'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { CATALOGS_DATA } from '@/src/data/catalogs';
import { Product } from '@/src/types/catalog';
import ProductModal from '@/src/components/catalog/ProductModal';
import { fetchCatalog } from '@/src/lib/supabase';

/**
 * Filter and prioritize products for the dynamic circular showcase.
 * Takes up to 7 published unique products.
 */
function getShowcaseProducts(catalog: Product[]): Product[] {
  const seenIds = new Set<string>();
  return [...catalog]
    .sort((a, b) => (Date.parse(b.created_at || '') || 0) - (Date.parse(a.created_at || '') || 0))
    .filter((prod) => {
      if (!prod.id || seenIds.has(prod.id) || !prod.image || prod.published === false) {
        return false;
      }
      seenIds.add(prod.id);
      return true;
    })
    .slice(0, 7);
}

export default function FeaturedCatalogs() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [items, setItems] = useState<Product[]>(() => getShowcaseProducts(CATALOGS_DATA));

  const orbitContainerRef = useRef<HTMLDivElement | null>(null);
  const isPausedRef = useRef<boolean>(false);
  const angleRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);
  const rafIdRef = useRef<number | null>(null);

  // Load latest live products from Supabase
  useEffect(() => {
    let isMounted = true;
    fetchCatalog().then(({ products }) => {
      if (isMounted && products && products.length > 0) {
        const showcase = getShowcaseProducts(products);
        if (showcase.length > 0) {
          setItems(showcase);
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Update card transforms based on current orbit angle
  const updateCardPositions = useCallback(() => {
    const container = orbitContainerRef.current;
    if (!container) return;

    const cards = Array.from(container.children) as HTMLElement[];
    if (cards.length < 2) return;

    const d = container.clientWidth;
    const u = container.clientHeight;
    const angle = angleRef.current;

    cards.forEach((card, index) => {
      const S = angle + (index * Math.PI * 2) / cards.length;
      const O = (Math.cos(S) + 1) / 2;
      const T = (1 - Math.cos(S)) * d * 0.62;
      const A = Math.sin(S) * u * 0.62;

      card.style.transform = `translate3d(${T}px, ${A}px, 0) scale(${0.64 + 0.36 * O})`;
      card.style.zIndex = String(Math.round(O * 100));
    });
  }, []);

  // Continuous animation loop via requestAnimationFrame
  useEffect(() => {
    const container = orbitContainerRef.current;
    if (!container || items.length < 2) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
      container.classList.add('is-static');
      return;
    }

    container.classList.remove('is-static');

    const animate = (time: number) => {
      if (lastTimeRef.current) {
        const delta = Math.min(time - lastTimeRef.current, 50);
        if (isVisibleRef.current) {
          angleRef.current += (delta * Math.PI * 2) / 42000;
          updateCardPositions();
        }
      }
      lastTimeRef.current = time;
      rafIdRef.current = requestAnimationFrame(animate);
    };

    updateCardPositions();
    rafIdRef.current = requestAnimationFrame(animate);

    // Visibility Observer
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    });
    intersectionObserver.observe(container);

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      updateCardPositions();
    });
    resizeObserver.observe(container);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
    };
  }, [items, updateCardPositions]);

  return (
    <section id="catalogos" className="section-wrapper catalog-entrance-section" aria-label="Acceso al catálogo">
      <div className="container collection-showcase">
        {/* Left Column: Entrance info & CTA matching reference design */}
        <div className="catalog-entrance reveal-item revealed">
          <div className="catalog-entrance-mark" aria-hidden="true">
            <span></span>
            <img src="/logo.png" alt="Sello Muebles Bellagio" width="132" height="132" />
            <span></span>
          </div>
          <span className="section-tag">Colección Bellagio</span>
          <h2 className="section-title">
            Descubre nuestro <span className="gold-text">catálogo completo</span>
          </h2>
          <p className="section-subtitle">
            Explora todas nuestras piezas, categorías y novedades en una experiencia creada para encontrar el mobiliario ideal para tus espacios.
          </p>
          <Link href="/catalogo" className="btn btn-primary btn-lg catalog-entrance-cta">
            <span>Explorar el catálogo</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Right Column: Dynamic 3D Orbit Carousel */}
        <div 
          className="collection-orbit" 
          ref={orbitContainerRef}
          role="group" 
          aria-label="Productos en exhibición interactiva"
        >
          {items.map((item) => (
            <button
              key={item.id}
              className="collection-orbit-card"
              type="button"
              onClick={() => setSelectedProduct(item)}
              aria-label={`Ver ${item.title}`}
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                decoding="async"
                width={720}
                height={720}
              />
              <span className="collection-orbit-caption">
                <small>{item.categoryName}</small>
                <strong>{item.title}</strong>
                <span aria-hidden="true">↗</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Product Details Lightbox Modal */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </section>
  );
}
