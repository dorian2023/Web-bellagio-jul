/**
 * @file catalog.ts
 * @description TypeScript definitions for Muebles Bellagio catalog, categories, and stores.
 */

export interface Category {
  id: string;
  name: string;
  count: number;
}

export interface FabricColorSwatch {
  id: string;
  name: string;             // Ej: "Bella Velvet #04 Marfil"
  catalogName?: string;     // Ej: "Bella Velvet"
  code?: string;            // Ej: "#04"
  hexColor?: string;        // Ej: "#EFEAE1"
  swatchImage?: string;     // URL foto macro de la tela o veta de madera
  furnitureImage?: string;  // URL de la foto del mueble con este acabado
  description?: string;
}

export interface MaterialCatalogGroup {
  id: string;
  catalogName: string;      // Ej: "Bella Velvet", "Lino Provenza", "Maderas Nobles"
  materialType: 'tela' | 'terciopelo' | 'lino' | 'boucle' | 'cuero' | 'madera' | 'metal';
  description?: string;
  colors: FabricColorSwatch[];
}

/**
 * Variante de color real de un producto, definida desde /admin.
 * Cada color tiene su propio set de fotos reales del mueble en ese acabado.
 * Si `usesMainGallery` es true, el color corresponde a la galería principal
 * (las fotos de portada/ángulos) y `images` se ignora.
 */
export interface ProductColorVariant {
  id: string;
  name: string;             // Ej: "Bipiel Negro", "Rosado Palo"
  hexColor: string;         // Ej: "#1C1C1C"
  images: string[];         // URLs de fotos reales del mueble en este color
  usesMainGallery?: boolean;
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
  origin?: 'nacional' | 'importado';
  stockStatus?: 'disponible' | 'agotado';
  materialCatalogs?: MaterialCatalogGroup[];
  colorVariants?: ProductColorVariant[];
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
