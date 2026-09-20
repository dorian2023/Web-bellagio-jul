/**
 * @file catalog.ts
 * @description TypeScript definitions for Muebles Bellagio catalog, categories, and stores.
 */

export interface Category {
  id: string;
  name: string;
  count: number;
}

export interface Product {
  id: string;
  category: string;
  categoryName: string;
  title: string;
  subtitle: string;
  description: string;
  materials: string;
  image: string;
  dimensions: string;
  availableColors: string[];
  created_at?: string;
  published?: boolean;
  slug?: string;
  youtubeUrl?: string;
  galleryImages?: string[];
}

export interface StoreLocation {
  id: string;
  name: string;
  badge: string;
  videoUrl: string;
  posterUrl: string;
  address: string;
  landmark: string;
  phone: string;
  mobile: string;
  whatsapp: string;
  schedule: string;
  mapsUrl: string;
  features: string[];
}
