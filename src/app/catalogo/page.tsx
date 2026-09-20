import type { Metadata } from 'next';
import React from 'react';
import CatalogBrowser from '@/src/components/catalog/CatalogBrowser';

export const metadata: Metadata = {
  title: 'Catálogo Bellagio (17 Categorías A-Z)',
  description: 'Colección integral de mobiliario de alta gama en Caracas: Salas, Comedores, Sofás, Dormitorios, Ceibos, Mesas de Centro y Piezas Exclusivas de Autor.',
  alternates: {
    canonical: 'https://mueblesbellagio.com/catalogo'
  },
  openGraph: {
    title: 'Catálogo Bellagio en Caracas (17 Categorías) | Muebles Bellagio',
    description: 'Explora nuestra gama de alta ebanistería, sofás, comedores y dormitorios en Caracas.',
    url: 'https://mueblesbellagio.com/catalogo',
    images: ['/images/hero-poster.webp']
  }
};

export default function CatalogoPage() {
  return (
    <div className="dedicated-catalog-page">
      <CatalogBrowser initialCategory="todos" />
    </div>
  );
}
