import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CATEGORIES_DATA } from '@/src/data/catalogs';
import CatalogBrowser from '@/src/components/catalog/CatalogBrowser';
import { fetchCatalog } from '@/src/lib/supabase';

export const revalidate = 60;

interface CategoryPageProps {
  params: {
    categoria: string;
  };
}

// 1. Generate Static Params for all 17 categories for SSG / Google Indexing
export async function generateStaticParams() {
  return CATEGORIES_DATA
    .filter(cat => cat.id !== 'todos')
    .map((cat) => ({
      categoria: cat.id,
    }));
}

// 2. Dynamic SEO Metadata for each individual category
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = CATEGORIES_DATA.find(c => c.id === params.categoria);

  if (!category) {
    return {
      title: 'Categoría no encontrada | Muebles Bellagio'
    };
  }

  return {
    title: `${category.name} de Lujo en Caracas | Muebles Bellagio`,
    description: `Descubre nuestra colección exclusiva de ${category.name} de alta gama en Caracas. Diseño de autor, mármol noble y acabados contemporáneos.`,
    alternates: {
      canonical: `https://mueblesbellagio.com/catalogo/${category.id}`
    },
    openGraph: {
      title: `${category.name} de Lujo en Caracas | Muebles Bellagio`,
      description: `Colección de ${category.name} con acabados de alta ebanistería. Showrooms en Caracas, Venezuela.`,
      url: `https://mueblesbellagio.com/catalogo/${category.id}`,
      images: ['/images/hero-poster.webp']
    }
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { products, categories } = await fetchCatalog();
  const category = (categories && categories.length > 0 ? categories : CATEGORIES_DATA).find(c => c.id === params.categoria);

  if (!category) {
    notFound();
  }

  // Schema.org Breadcrumb JSON-LD
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: 'https://mueblesbellagio.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Catálogos',
        item: 'https://mueblesbellagio.com/catalogo'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category.name,
        item: `https://mueblesbellagio.com/catalogo/${category.id}`
      }
    ]
  };

  return (
    <div className="section-wrapper" style={{ minHeight: '80vh', paddingTop: 'calc(70px + var(--space-8))' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="container">
        {/* Breadcrumbs Navigation */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: 'var(--space-6)', fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
          <Link href="/" style={{ color: 'var(--color-text-secondary)' }}>Inicio</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <Link href="/catalogo" style={{ color: 'var(--color-text-secondary)' }}>Catálogo</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span className="gold-text" style={{ fontWeight: 600 }}>{category.name}</span>
        </nav>

        <header className="section-header">
          <span className="section-tag">Colección Especializada</span>
          <h1 className="section-title">
            {category.name} <span className="gold-text">de Alta Gama</span>
          </h1>
          <p className="section-subtitle">
            Modelos de {category.name.toLowerCase()} fabricados a la medida con materiales nobles para residencias y espacios exclusivos en Caracas.
          </p>
        </header>

        {/* Load Catalog Browser filtered to this category */}
        <CatalogBrowser
          initialCategory={category.id}
          initialProducts={products}
          initialCategories={categories}
        />
      </div>
    </div>
  );
}
