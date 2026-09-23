import React from 'react';
import Hero from '@/src/components/hero/Hero';
import About from '@/src/components/home/About';
import FeaturedCatalogs from '@/src/components/home/FeaturedCatalogs';
import SpaceVisualizer from '@/src/components/home/SpaceVisualizer';
import StoreGrid from '@/src/components/stores/StoreGrid';
import Contact from '@/src/components/home/Contact';

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <FeaturedCatalogs />
      <SpaceVisualizer />
      <StoreGrid />
      <Contact />
    </>
  );
}

