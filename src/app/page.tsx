import React from 'react';
import Hero from '@/src/components/hero/Hero';
import About from '@/src/components/home/About';
import StoreGrid from '@/src/components/stores/StoreGrid';
import FeaturedCatalogs from '@/src/components/home/FeaturedCatalogs';
import Contact from '@/src/components/home/Contact';

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <FeaturedCatalogs />
      <StoreGrid />
      <Contact />
    </>
  );
}
