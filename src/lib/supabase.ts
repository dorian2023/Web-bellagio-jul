/**
 * @file supabase.ts
 * @description Supabase client and services for Muebles Bellagio.
 * Handles database operations for products, categories, storage bucket, and admin authentication.
 */

import { createClient } from '@supabase/supabase-js';
import { Product, Category } from '@/src/types/catalog';
import { CATALOGS_DATA, CATEGORIES_DATA } from '@/src/data/catalogs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vjtjwifynfzdjkdpruty.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_J8wyvsMDU4uwf7tNXxZ9xQ_8CW4Dwue';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
    stockStatus: (row.stock_status === 'agotado') ? 'agotado' : 'disponible'
  };
}

let cachedCatalogData: { products: Product[]; categories: Category[] } | null = null;
let catalogCacheTimestamp = 0;
let inflightCatalogPromise: Promise<{ products: Product[]; categories: Category[] }> | null = null;
const CATALOG_CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL

/**
 * Fetches published products and active categories from Supabase with in-memory caching and deduplication,
 * falling back gracefully to local catalog data if the database is unreachable.
 */
export async function fetchCatalog(): Promise<{ products: Product[]; categories: Category[] }> {
  const now = Date.now();
  if (cachedCatalogData && (now - catalogCacheTimestamp < CATALOG_CACHE_TTL_MS)) {
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
        return { products: CATALOGS_DATA, categories: CATEGORIES_DATA };
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
      console.error('Error cargando catálogo Supabase:', err);
      return { products: CATALOGS_DATA, categories: CATEGORIES_DATA };
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
    published: !!productData.published
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
        const { origin: _o, stock_status: _s, ...fallbackPayload } = payload;
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
        const { origin: _o, stock_status: _s, ...fallbackPayload } = payload;
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
 */
export async function uploadProductImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop() || 'webp';
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
  const fileName = `products/${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${cleanName}`;

  const { error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file, {
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

