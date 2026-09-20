import type { Metadata } from 'next';
import React from 'react';
import StoreGrid from '@/src/components/stores/StoreGrid';
import { STORES_DATA } from '@/src/data/stores';

export const metadata: Metadata = {
  title: 'Nuestras Tiendas y Showrooms en Caracas | Muebles Bellagio',
  description: 'Visita nuestras tiendas exclusivas en Caracas: Showroom Principal en Av. Comercio, Showroom Mobili en Bella Vista y Showroom Casa Mall en Los Naranjos.',
  openGraph: {
    title: 'Showrooms Muebles Bellagio en Caracas, Venezuela',
    description: 'Encuentra tu tienda Muebles Bellagio más cercana en Caracas y recibe asesoría de interiorismo.',
    url: 'https://mueblesbellagio.com/tiendas',
    images: ['/images/stores/tienda-casamall.jpg']
  }
};

export default function TiendasPage() {
  const storesLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: STORES_DATA.map((store, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'FurnitureStore',
        name: store.name,
        address: {
          '@type': 'PostalAddress',
          streetAddress: store.address,
          addressLocality: 'Caracas',
          addressCountry: 'VE'
        },
        telephone: store.mobile,
        openingHours: store.schedule,
        image: `https://mueblesbellagio.com${store.posterUrl}`
      }
    }))
  };

  return (
    <div className="dedicated-stores-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storesLd) }}
      />
      <StoreGrid isStandalonePage={true} />
    </div>
  );
}
