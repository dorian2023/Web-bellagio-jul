import React, { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/src/components/shared/Navbar';
import Footer from '@/src/components/shared/Footer';
import WhatsAppWidget from '@/src/components/shared/WhatsAppWidget';
import InquiryFloatingCart from '@/src/components/catalog/InquiryFloatingCart';
import CookieConsentBanner from '@/src/components/shared/CookieConsentBanner';
import LuxuryNavigationLoader from '@/src/components/shared/LuxuryNavigationLoader';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FCFCF9' },
    { media: '(prefers-color-scheme: dark)', color: '#0B0B0D' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://mueblesbellagio.com'),
  title: {
    default: 'Muebles Bellagio | Mobiliario de Alta Gama y Lujo en Caracas',
    template: '%s | Muebles Bellagio'
  },
  description: 'Diseño, fabricación y distribución de muebles de alta gama en Caracas, Venezuela. Salas, comedores, dormitorios, sofás y ceibos con acabados de autor.',
  keywords: [
    'Muebles Bellagio',
    'Muebles de lujo Caracas',
    'Mueblería Caracas',
    'Sofás de lujo Venezuela',
    'Comedores modernos',
    'Dormitorios master',
    'Showroom Casa Mall Caracas',
    'Mobiliario de autor'
  ],
  authors: [{ name: 'Muebles Bellagio' }],
  creator: 'Muebles Bellagio',
  publisher: 'Muebles Bellagio',
  openGraph: {
    type: 'website',
    locale: 'es_VE',
    url: 'https://mueblesbellagio.com',
    siteName: 'Muebles Bellagio',
    title: 'Muebles Bellagio | Colecciones Exclusivas de Mobiliario de Lujo',
    description: 'Descubre más de 17 colecciones de alta ebanistería y diseño contemporáneo para tu hogar u oficina en Caracas.',
    images: [
      {
        url: '/images/hero-poster.webp',
        width: 1200,
        height: 630,
        alt: 'Muebles Bellagio Showroom Caracas'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muebles Bellagio | Mobiliario de Lujo en Caracas',
    description: 'Salas, dormitorios, comedores y acabados de autor en Caracas, Venezuela.',
    images: ['/images/hero-poster.webp']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FurnitureStore',
    name: 'Muebles Bellagio',
    image: 'https://mueblesbellagio.com/images/hero-poster.webp',
    description: 'Fábrica y tiendas de mobiliario de alta gama en Caracas, Venezuela.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. Comercio / C.C. Casa Mall',
      addressLocality: 'Caracas',
      addressRegion: 'Distrito Capital',
      addressCountry: 'VE'
    },
    telephone: '+584141536516',
    priceRange: '$$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '17:00'
      }
    ]
  };

  return (
    <html lang="es" data-theme="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.youtube-nocookie.com" />
        <link rel="preconnect" href="https://img.youtube.com" />
        <link rel="dns-prefetch" href="https://www.youtube-nocookie.com" />
        <link rel="dns-prefetch" href="https://img.youtube.com" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@300;400;500;600;700;800&family=Jost:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" 
          rel="stylesheet" 
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <Suspense fallback={null}>
          <LuxuryNavigationLoader />
        </Suspense>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppWidget />
        <InquiryFloatingCart />
        <CookieConsentBanner />
      </body>
    </html>
  );
}
