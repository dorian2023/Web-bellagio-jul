'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { CATEGORIES_DATA as DEFAULT_CATEGORIES, CATALOGS_DATA as DEFAULT_PRODUCTS } from '@/src/data/catalogs';
import { Product, Category } from '@/src/types/catalog';
import ProductModal from '@/src/components/catalog/ProductModal';
import { fetchCatalog } from '@/src/lib/supabase';

interface CatalogBrowserProps {
  initialCategory?: string;
}

const POPULAR_CATEGORY_IDS = ['todos', 'sofas', 'comedores', 'dormitorios', 'poltronas'];
const ITEMS_PER_PAGE = 12;

function getPageNumbers(current: number, total: number): (number | string)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [];
  const delta = 1;

  pages.push(1);

  if (current - delta > 2) {
    pages.push('dots-left');
  }

  const start = Math.max(2, current - delta);
  const end = Math.min(total - 1, current + delta);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current + delta < total - 1) {
    pages.push('dots-right');
  }

  pages.push(total);

  return pages;
}

export default function CatalogBrowser({ initialCategory = 'todos' }: CatalogBrowserProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isMegaOpen, setIsMegaOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [categoriesList, setCategoriesList] = useState<Category[]>(DEFAULT_CATEGORIES);

  const megaDropdownRef = useRef<HTMLDivElement | null>(null);

  // Sync latest live data from Supabase
  useEffect(() => {
    let isMounted = true;
    fetchCatalog().then(({ products, categories }) => {
      if (!isMounted) return;
      if (products && products.length > 0) {
        setAllProducts(products);
      }
      if (categories && categories.length > 0) {
        setCategoriesList(categories);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Close mega dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (megaDropdownRef.current && !megaDropdownRef.current.contains(event.target as Node)) {
        setIsMegaOpen(false);
      }
    }
    if (isMegaOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMegaOpen]);

  // Lock body scroll when mega-selector curtain is open on mobile
  useEffect(() => {
    if (isMegaOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsMegaOpen(false);
      };
      document.addEventListener('keydown', handleEsc);
      return () => {
        document.body.style.overflow = originalOverflow;
        document.removeEventListener('keydown', handleEsc);
      };
    }
  }, [isMegaOpen]);

  // Current category object
  const activeCategoryObj = useMemo(() => {
    return categoriesList.find((c) => c.id === selectedCategory) || {
      id: 'todos',
      name: 'Todas las Categorías',
      count: allProducts.length
    };
  }, [categoriesList, selectedCategory, allProducts.length]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        product.title.toLowerCase().includes(query) ||
        product.subtitle.toLowerCase().includes(query) ||
        product.materials.toLowerCase().includes(query) ||
        product.categoryName.toLowerCase().includes(query) ||
        product.dimensions.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [allProducts, selectedCategory, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length);

  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, startIndex, endIndex]);

  // Reset page when category or search changes
  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
    setIsMegaOpen(false);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    setCurrentPage(newPage);
    const section = document.getElementById('catalogProductsSection');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 3D Parallax Tilt interaction for product cards
  const handleCardMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rx = -(y / (rect.height / 2)) * 9;
    const ry = (x / (rect.width / 2)) * 9;
    card.style.setProperty('--card-rx', `${rx.toFixed(2)}deg`);
    card.style.setProperty('--card-ry', `${ry.toFixed(2)}deg`);
    card.classList.add('is-tilting');
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    card.style.removeProperty('--card-rx');
    card.style.removeProperty('--card-ry');
    card.classList.remove('is-tilting');
  };

  return (
    <div className="catalog-browser-root">
      {/* Header section matching Screenshot 1 */}
      <header className="catalog-page-hero">
        <div className="container">
          <div className="catalog-hero-content">
            {/* Breadcrumbs */}
            <nav className="catalog-breadcrumb" aria-label="Navegación de migas de pan">
              <Link href="/" className="breadcrumb-back-btn">
                <span aria-hidden="true">←</span> Volver al Inicio
              </Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">Catálogo Exclusivo 2026</span>
            </nav>

            {/* Centered Luxury Emblem */}
            <div className="catalog-hero-brand-mark">
              <img
                src="/logo.png"
                alt="Sello Muebles Bellagio"
                width={140}
                height={140}
              />
            </div>

            {/* Title */}
            <h1 className="catalog-hero-title">
              Catálogo <span className="gold-text">Bellagio</span>
            </h1>

            {/* Search Input Bar */}
            <div className="catalog-search-wrapper">
              <div className="catalog-search-box">
                <svg
                  className="search-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>

                <input
                  type="text"
                  className="catalog-search-input"
                  placeholder="Buscar por nombre, material (mármol, roble, piel...) o medidas..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  aria-label="Buscar en el catálogo"
                />

                {searchQuery && (
                  <button
                    type="button"
                    className="clear-search-btn"
                    onClick={() => handleSearchChange('')}
                    aria-label="Limpiar búsqueda"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mega-Selector Navigation Bar matching Screenshot 1 */}
      <section className="mega-filter-bar-wrapper" id="megaFilterBar">
        <div className="container">
          <div className="mega-filter-bar-inner">
            {/* Left: Main Mega-Selector Dropdown Trigger */}
            <div className="mega-selector-trigger-box" ref={megaDropdownRef}>
              <button
                type="button"
                className={`mega-selector-btn ${isMegaOpen ? 'active' : ''}`}
                onClick={() => setIsMegaOpen(!isMegaOpen)}
                aria-expanded={isMegaOpen}
                aria-haspopup="dialog"
              >
                <div className="mega-selector-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                </div>
                <div className="mega-selector-text">
                  <span className="mega-selector-label">Categoría activa:</span>
                  <strong className="mega-selector-current">
                    {activeCategoryObj.name}
                  </strong>
                </div>
                <div className="mega-selector-arrow">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </button>

              {/* Mega Dropdown Backdrop Overlay on Mobile */}
              {isMegaOpen && (
                <div 
                  className="mega-dropdown-backdrop" 
                  onClick={() => setIsMegaOpen(false)} 
                  aria-hidden="true" 
                />
              )}

              {/* Mega Dropdown Curtain */}
              <div className={`mega-dropdown-curtain ${isMegaOpen ? 'open' : ''}`}>
                {/* Mobile Sheet Drag Handle */}
                <div className="sheet-drag-handle" aria-hidden="true">
                  <span className="drag-pill"></span>
                </div>

                <div className="mega-dropdown-header">
                  <div className="mega-dropdown-title-group">
                    <span className="section-tag" style={{ marginBottom: 2 }}>
                      Directorio de Colecciones
                    </span>
                    <h4>Selecciona una Categoría</h4>
                  </div>
                  <button
                    type="button"
                    className="mega-dropdown-close-btn"
                    onClick={() => setIsMegaOpen(false)}
                    aria-label="Cerrar menú de categorías"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>

                <div className="mega-categories-grid">
                  {categoriesList.map((cat) => {
                    const isActive = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        className={`mega-category-card ${isActive ? 'active' : ''}`}
                        onClick={() => handleCategoryChange(cat.id)}
                      >
                        <div className="mega-cat-icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="3" y="3" width="7" height="7"></rect>
                            <rect x="14" y="3" width="7" height="7"></rect>
                            <rect x="14" y="14" width="7" height="7"></rect>
                            <rect x="3" y="14" width="7" height="7"></rect>
                          </svg>
                        </div>
                        <div className="mega-cat-details">
                          <span className="mega-cat-name">{cat.name}</span>
                          <span className="mega-cat-count">
                            {cat.id === 'todos' ? `${allProducts.length} piezas` : `${cat.count || 0} modelos`}
                          </span>
                        </div>
                        {isActive && (
                          <div className="mega-cat-check" style={{ display: 'flex' }}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Center: Quick Access Pills */}
            <div className="quick-access-pills-row">
              <span className="quick-access-label">Populares:</span>
              <div className="quick-pills-list">
                {categoriesList
                  .filter((c) => POPULAR_CATEGORY_IDS.includes(c.id))
                  .sort((a, b) => POPULAR_CATEGORY_IDS.indexOf(a.id) - POPULAR_CATEGORY_IDS.indexOf(b.id))
                  .map((cat) => {
                    const isActive = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        className={`quick-pill-btn ${isActive ? 'active' : ''}`}
                        onClick={() => handleCategoryChange(cat.id)}
                      >
                        {cat.name}
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Right: Live Count Badge */}
            <div className="catalog-live-count-badge">
              <span className="results-badge">
                {filteredProducts.length > ITEMS_PER_PAGE
                  ? `Mostrando ${startIndex + 1}–${endIndex} de ${filteredProducts.length} piezas`
                  : `Mostrando ${filteredProducts.length} ${filteredProducts.length === 1 ? 'pieza' : 'piezas'}`}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid Section */}
      <section className="catalog-products-section" id="catalogProductsSection" aria-label="Listado de Muebles">
        <div className="container">
          {filteredProducts.length === 0 ? (
            <div className="catalog-empty-state">
              <div className="empty-icon-box">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
              </div>
              <h3>No encontramos piezas para esta búsqueda</h3>
              <p>Prueba seleccionando otra categoría o utilizando términos más generales como "sofa", "mármol" o "roble".</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setSelectedCategory('todos');
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
              >
                Ver Todo el Catálogo
              </button>
            </div>
          ) : (
            <>
              <div 
                key={`catalog-page-${currentPage}-cat-${selectedCategory}-search-${searchQuery}`} 
                className="dedicated-catalog-grid" 
                id="dedicatedCatalogGrid"
              >
                {paginatedProducts.map((product, idx) => (
                  <article
                    key={product.id}
                    className="product-card catalog-card-entrance"
                    style={{ animationDelay: `${(idx % 12) * 40}ms` }}
                    onClick={() => setSelectedProduct(product)}
                    onMouseMove={handleCardMouseMove}
                    onMouseLeave={handleCardMouseLeave}
                    role="button"
                    tabIndex={0}
                    aria-label={`Ver detalle de ${product.title}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedProduct(product);
                      }
                    }}
                  >
                    <div className="product-image-box">
                      <span className="product-category-badge">
                        {product.categoryName}
                      </span>

                      <img
                        src={product.image}
                        alt={product.title}
                        className="product-img"
                        loading="lazy"
                        width={400}
                        height={400}
                      />

                      <div className="product-card-hover-action" aria-hidden="true">
                        <span className="card-zoom-icon">🔍</span>
                        <span>Ver Ficha &amp; Zoom HD</span>
                      </div>
                    </div>

                    <div className="product-info">
                      <div className="product-copy">
                        <h3 className="product-title">{product.title}</h3>
                        <p className="product-subtitle">
                          {product.subtitle || (product.materials ? `Material: ${product.materials.slice(0, 45)}...` : 'Alta Ebanistería Bellagio')}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Luxury Catalog Pagination Controls */}
              {totalPages > 1 && (
                <nav className="catalog-pagination-wrapper" aria-label="Paginación de productos">
                  <div className="catalog-pagination-controls">
                    <button
                      type="button"
                      className="pagination-btn pagination-nav-btn"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      aria-label="Página anterior"
                    >
                      <span aria-hidden="true">←</span> Anterior
                    </button>

                    {getPageNumbers(currentPage, totalPages).map((item, idx) => {
                      if (typeof item === 'string') {
                        return (
                          <span key={`dots-${idx}`} className="pagination-ellipsis" aria-hidden="true">
                            …
                          </span>
                        );
                      }
                      const isCurrent = item === currentPage;
                      return (
                        <button
                          key={`page-${item}`}
                          type="button"
                          className={`pagination-btn ${isCurrent ? 'active' : ''}`}
                          onClick={() => handlePageChange(item)}
                          aria-current={isCurrent ? 'page' : undefined}
                          aria-label={`Ir a la página ${item}`}
                        >
                          {item}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      className="pagination-btn pagination-nav-btn"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      aria-label="Página siguiente"
                    >
                      Siguiente <span aria-hidden="true">→</span>
                    </button>
                  </div>
                  <div className="catalog-pagination-info">
                    Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong> ({filteredProducts.length} productos en total)
                  </div>
                </nav>
              )}
            </>
          )}
        </div>
      </section>

      {/* Product Details Lightbox Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
