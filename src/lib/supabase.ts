/**
 * @file supabase.ts
 * @description Supabase client and services for Muebles Bellagio.
 * Handles database operations for products, categories, storage bucket, and admin authentication.
 */

import { createClient } from '@supabase/supabase-js';
import { Product, Category, ProductColorVariant } from '@/src/types/catalog';
import { CATALOGS_DATA, CATEGORIES_DATA } from '@/src/data/catalogs';
import { sanitizeHexColor } from '@/src/data/color-presets';
import { optimizeImageForUpload } from '@/src/utils/image-optimizer';

// Carga segura y estricta desde variables de entorno (.env.local o Vercel)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Configuración requerida: NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY deben estar definidas en tu archivo .env.local'
  );
}

// Initialize Supabase client with robust connection handling
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: typeof window !== 'undefined',
      autoRefreshToken: typeof window !== 'undefined',
    }
  }
);

/**
 * Parsea y valida las variantes de color guardadas en JSONB.
 * Descarta entradas corruptas para que un dato malo nunca rompa el catálogo público.
 */
export function normalizeColorVariants(raw: unknown): ProductColorVariant[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((v): v is Record<string, unknown> => !!v && typeof v === 'object')
    .map((v, idx) => ({
      id: typeof v.id === 'string' && v.id ? v.id : `color-${idx}`,
      name: typeof v.name === 'string' ? v.name.trim().slice(0, 60) : '',
      hexColor: sanitizeHexColor(v.hexColor),
      images: Array.isArray(v.images) ? v.images.filter((u): u is string => typeof u === 'string' && u.length > 0) : [],
      usesMainGallery: v.usesMainGallery === true,
    }))
    .filter((v) => v.name.length > 0 && (v.usesMainGallery || v.images.length > 0));
}

/**
 * Normalizes a raw Supabase product row into the frontend Product interface
 */
export function normalizeProduct(row: any): Product {
  const cat = row.categories || {};
  const rawOrigin = (row.origin || '').toLowerCase();
  let origin: 'nacional' | 'importado' = 'nacional';
  if (
    rawOrigin === 'importado' ||
    (!rawOrigin && (row.title || '').toLowerCase().includes('imp')) ||
    (!rawOrigin && (row.title || '').toLowerCase().includes('importad'))
  ) {
    origin = 'importado';
  }

  let availableColors: string[] = [];
  if (Array.isArray(row.available_colors)) {
    availableColors = row.available_colors;
  } else if (typeof row.available_colors === 'string' && row.available_colors.trim().length > 0) {
    availableColors = row.available_colors.split(',').map((s: string) => s.trim()).filter(Boolean);
  } else if (Array.isArray(row.availableColors)) {
    availableColors = row.availableColors;
  } else if (typeof row.availableColors === 'string' && row.availableColors.trim().length > 0) {
    availableColors = row.availableColors.split(',').map((s: string) => s.trim()).filter(Boolean);
  }

  return {
    id: row.id,
    category: row.category_id || row.category || 'sofas',
    categoryName: cat.name || row.categoryName || 'Colección Bellagio',
    title: row.title || 'Mueble Bellagio',
    subtitle: row.subtitle || '',
    description: row.description || '',
    materials: row.materials || '',
    dimensions: row.dimensions || '',
    image: row.image_url || row.image || '/images/hero-poster.webp',
    availableColors,
    youtubeUrl: row.youtube_url || row.youtubeUrl || row.video_url || row.videoUrl || '',
    galleryImages: Array.isArray(row.gallery_images) ? row.gallery_images : (Array.isArray(row.galleryImages) ? row.galleryImages : []),
    origin,
    stockStatus: (row.stock_status === 'agotado') ? 'agotado' : 'disponible',
    materialCatalogs: row.material_catalogs || row.materialCatalogs || undefined,
    colorVariants: normalizeColorVariants(row.color_variants ?? row.colorVariants)
  };
}

let cachedCatalogData: { products: Product[]; categories: Category[] } | null = null;
let catalogCacheTimestamp = 0;
let inflightCatalogPromise: Promise<{ products: Product[]; categories: Category[] }> | null = null;
const CATALOG_CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL

/**
 * Fetches published products and active categories from Supabase with in-memory caching and deduplication,
 * falling back gracefully to local catalog data if the database is unreachable or missing environment variables.
 */
export async function fetchCatalog(): Promise<{ products: Product[]; categories: Category[] }> {
  const now = Date.now();
  if (cachedCatalogData && (now - catalogCacheTimestamp < CATALOG_CACHE_TTL_MS)) {
    return cachedCatalogData;
  }

  // If credentials are not provided (e.g. during clean Vercel builds without env vars configured), fallback immediately in 0ms
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
    cachedCatalogData = { products: CATALOGS_DATA, categories: CATEGORIES_DATA };
    catalogCacheTimestamp = Date.now();
    return cachedCatalogData;
  }

  if (inflightCatalogPromise) {
    return inflightCatalogPromise;
  }

  inflightCatalogPromise = (async () => {
    try {
      const { data: dbProducts, error: pError } = await supabase
        .from('products')
        .select('*, categories(name, slug)')
        .eq('published', true)
        .order('created_at', { ascending: false });

      const { data: dbCategories, error: cError } = await supabase
        .from('categories')
        .select('id, name, sort_order')
        .eq('active', true)
        .order('sort_order', { ascending: true });

      if (pError || !dbProducts || dbProducts.length === 0) {
        console.warn('Usando catálogo local:', pError?.message || 'Sin productos en DB');
        cachedCatalogData = { products: CATALOGS_DATA, categories: CATEGORIES_DATA };
        catalogCacheTimestamp = Date.now();
        return cachedCatalogData;
      }

      const normalizedProducts: Product[] = dbProducts.map(normalizeProduct);

      // Calculate dynamic counts
      const countMap = new Map<string, number>();
      normalizedProducts.forEach(p => {
        countMap.set(p.category, (countMap.get(p.category) || 0) + 1);
      });

      const categories: Category[] = [
        { id: 'todos', name: 'Todas las Categorías', count: normalizedProducts.length },
        ...(dbCategories || []).map(c => ({
          id: c.id,
          name: c.name,
          count: countMap.get(c.id) || 0
        }))
      ];

      cachedCatalogData = { products: normalizedProducts, categories };
      catalogCacheTimestamp = Date.now();
      return cachedCatalogData;
    } catch (err) {
      console.warn('Fallback a catálogo local Bellagio:', (err as any)?.message || err);
      cachedCatalogData = { products: CATALOGS_DATA, categories: CATEGORIES_DATA };
      catalogCacheTimestamp = Date.now();
      return cachedCatalogData;
    } finally {
      inflightCatalogPromise = null;
    }
  })();

  return inflightCatalogPromise;
}

/**
 * Admin: Fetch all products (including drafts / unpublished)
 */
export async function fetchAdminProducts(): Promise<any[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(normalizeProduct);
}

/**
 * Admin: Save (Insert or Update) a product
 */
export async function saveProduct(productData: any, idToUpdate?: string | null): Promise<any> {
  const payload = {
    title: productData.title,
    slug: productData.slug || productData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: productData.description,
    materials: productData.materials,
    dimensions: productData.dimensions,
    available_colors: productData.availableColors || [],
    category_id: productData.category,
    image_url: productData.image,
    youtube_url: productData.youtubeUrl || '',
    gallery_images: Array.isArray(productData.galleryImages) ? productData.galleryImages : [],
    origin: productData.origin || 'nacional',
    stock_status: productData.stockStatus || 'disponible',
    published: !!productData.published,
    color_variants: Array.isArray(productData.colorVariants) ? productData.colorVariants : []
  };

  const hasColorVariants = payload.color_variants.length > 0;
  const missingColorColumnError = new Error(
    'La base de datos aún no tiene la columna "color_variants". Ejecuta en Supabase → SQL Editor: ' +
    "ALTER TABLE public.products ADD COLUMN IF NOT EXISTS color_variants jsonb NOT NULL DEFAULT '[]'::jsonb;"
  );

  /** Quita columnas opcionales si el esquema remoto aún no las tiene. Nunca descarta fotos por color en silencio. */
  const buildFallbackPayload = (errMsg: string) => {
    if (errMsg.includes('color_variants') && hasColorVariants) throw missingColorColumnError;
    const { origin: _o, stock_status: _s, color_variants: _c, ...rest } = payload;
    return rest;
  };

  if (idToUpdate) {
    let { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', idToUpdate)
      .select('*, categories(name, slug)')
      .single();

    // Fallback: strip unknown columns (origin, stock_status) if Supabase schema is not yet updated
    if (error) {
      console.warn('Error al actualizar en Supabase, intentando fallback de columnas:', error);
      const errMsg = (error.message || '').toLowerCase();
      if (errMsg.includes('origin') || errMsg.includes('stock_status') || errMsg.includes('column')) {
        const fallbackPayload = buildFallbackPayload(errMsg);
        const retryResult = await supabase
          .from('products')
          .update(fallbackPayload)
          .eq('id', idToUpdate)
          .select('*, categories(name, slug)')
          .single();
        data = retryResult.data;
        error = retryResult.error;
      }
    }

    if (error) {
      console.error('Supabase update final error:', error);
      throw error;
    }
    cachedCatalogData = null;
    catalogCacheTimestamp = 0;
    return normalizeProduct(data);
  } else {
    let { data, error } = await supabase
      .from('products')
      .insert(payload)
      .select('*, categories(name, slug)')
      .single();

    // Fallback: strip unknown columns (origin, stock_status) if Supabase schema is not yet updated
    if (error) {
      console.warn('Error al insertar en Supabase, intentando fallback de columnas:', error);
      const errMsg = (error.message || '').toLowerCase();
      if (errMsg.includes('origin') || errMsg.includes('stock_status') || errMsg.includes('column')) {
        const fallbackPayload = buildFallbackPayload(errMsg);
        const retryResult = await supabase
          .from('products')
          .insert(fallbackPayload)
          .select('*, categories(name, slug)')
          .single();
        data = retryResult.data;
        error = retryResult.error;
      }
    }

    if (error) {
      console.error('Supabase insert final error:', error);
      throw error;
    }
    cachedCatalogData = null;
    catalogCacheTimestamp = 0;
    return normalizeProduct(data);
  }
}

/**
 * Admin: Delete a product
 */
export async function deleteProduct(productId: string): Promise<void> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (error) throw error;
  cachedCatalogData = null;
  catalogCacheTimestamp = 0;
}

/**
 * Admin: Upload product image to Supabase Storage bucket 'product-images'
 * Comprime y convierte automáticamente a WebP HD antes de subir, reduciendo el tamaño en un 90-95%.
 */
export async function uploadProductImage(file: File): Promise<string> {
  const processedFile = (typeof window !== 'undefined')
    ? await optimizeImageForUpload(file)
    : file;

  const cleanBaseName = processedFile.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
  const fileName = `products/${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${cleanBaseName}.webp`;

  const { error } = await supabase.storage
    .from('product-images')
    .upload(fileName, processedFile, {
      contentType: processedFile.type || 'image/webp',
      cacheControl: '31536000',
      upsert: false
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName);

  return data.publicUrl;
}

/**
 * Admin: Upload multiple product images in parallel to Supabase Storage
 */
export async function uploadMultipleProductImages(files: File[]): Promise<string[]> {
  if (!files || files.length === 0) return [];
  const uploadPromises = files.map(file => uploadProductImage(file));
  const results = await Promise.all(uploadPromises);
  return results;
}

