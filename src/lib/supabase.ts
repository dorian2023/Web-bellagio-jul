/**
 * @file supabase.ts
 * @description Supabase client and services for Muebles Bellagio.
 * Handles database operations for products, categories, storage bucket, and admin authentication.
 */

import { createClient } from '@supabase/supabase-js';
import { Product, Category } from '@/src/types/catalog';
import { CATALOGS_DATA, CATEGORIES_DATA } from '@/src/data/catalogs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yxtazqlqwhsxppsipwet.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_O9VxDm26U1O2Wu8Ya09rmg_26Az3Nwz';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Normalizes a raw Supabase product row into the frontend Product interface
 */
export function normalizeProduct(row: any): Product {
  const cat = row.categories || {};
  return {
    id: row.id,
    category: row.category_id || row.category || 'sofas',
    categoryName: cat.name || row.categoryName || 'Colección Bellagio',
    title: row.title || 'Mueble Bellagio',
    subtitle: row.subtitle || row.description?.slice(0, 80) || '',
    description: row.description || '',
    materials: row.materials || 'Maderas nobles y acabados finos',
    dimensions: row.dimensions || 'A convenir',
    image: row.image_url || row.image || '/images/hero-poster.webp',
    availableColors: row.available_colors || row.availableColors || ['Oro', 'Nogal'],
    youtubeUrl: row.youtube_url || row.youtubeUrl || row.video_url || row.videoUrl || ''
  };
}

/**
 * Fetches published products and active categories from Supabase,
 * falling back gracefully to local catalog data if the database is unreachable.
 */
export async function fetchCatalog(): Promise<{ products: Product[]; categories: Category[] }> {
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

    return { products: normalizedProducts, categories };
  } catch (err) {
    console.error('Error cargando catálogo Supabase:', err);
    return { products: CATALOGS_DATA, categories: CATEGORIES_DATA };
  }
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
    published: !!productData.published
  };

  if (idToUpdate) {
    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', idToUpdate)
      .select('*, categories(name, slug)')
      .single();
    if (error) throw error;
    return normalizeProduct(data);
  } else {
    const { data, error } = await supabase
      .from('products')
      .insert(payload)
      .select('*, categories(name, slug)')
      .single();
    if (error) throw error;
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
}

/**
 * Admin: Upload product image to Supabase Storage bucket 'product-images'
 */
export async function uploadProductImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop() || 'webp';
  const fileName = `products/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

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
