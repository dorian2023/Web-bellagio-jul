import { CATEGORIES_DATA, CATALOGS_DATA } from '../data/catalogs.js';
import { isSupabaseConfigured, supabase } from './supabase.js';
import { optimizeImageFile } from '../utils/image-optimization.js';

function normalizeProduct(row) {
  const category = row.categories || {};
  return {
    ...row,
    category: row.category || row.category_id,
    categoryName: row.categoryName || category.name || 'Colección Bellagio',
    image: row.image || row.image_url,
    youtubeUrl: row.youtubeUrl || row.youtube_url || '',
    availableColors: row.availableColors || row.available_colors || [],
    galleryImages: row.galleryImages || row.gallery_images || []
  };
}

function categoriesFromProducts(products, categoryRows = []) {
  const counts = new Map();
  products.forEach(product => {
    const current = counts.get(product.category) || { id: product.category, name: product.categoryName, count: 0 };
    current.count += 1;
    counts.set(product.category, current);
  });

  const categories = categoryRows.length
    ? categoryRows.map(category => ({
      id: category.id,
      name: category.name,
      count: counts.get(category.id)?.count || 0,
      sortOrder: category.sort_order
    }))
    : Array.from(counts.values());

  return [
    { id: 'todos', name: 'Todas las Categorías', count: products.length },
    ...categories.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0) || a.name.localeCompare(b.name, 'es'))
  ];
}

export async function fetchPublicCatalog() {
  if (!isSupabaseConfigured) {
    return { products: CATALOGS_DATA, categories: CATEGORIES_DATA, source: 'local' };
  }

  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  const { data: categoryRows, error: categoryError } = await supabase
    .from('categories')
    .select('id, name, sort_order')
    .eq('active', true)
    .order('sort_order', { ascending: true });

  if (error || categoryError) {
    console.warn('No se pudo cargar el catálogo de Supabase. Se usará el catálogo local.', (error || categoryError).message);
    return { products: CATALOGS_DATA, categories: CATEGORIES_DATA, source: 'local' };
  }

  const products = (data || []).map(normalizeProduct);
  return { products, categories: categoriesFromProducts(products, categoryRows || []), source: 'supabase' };
}

export async function fetchAdminProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(normalizeProduct);
}

export async function saveProduct(product, existingId = null) {
  const payload = {
    title: product.title,
    slug: product.slug,
    description: product.description,
    materials: product.materials,
    dimensions: product.dimensions,
    available_colors: product.availableColors,
    category_id: product.category,
    image_url: product.image,
    youtube_url: product.youtubeUrl || '',
    gallery_images: product.galleryImages || [],
    published: Boolean(product.published)
  };

  const query = existingId
    ? supabase.from('products').update(payload).eq('id', existingId).select('*, categories(name, slug)').single()
    : supabase.from('products').insert(payload).select('*, categories(name, slug)').single();

  const { data, error } = await query;
  if (error) throw error;
  return normalizeProduct(data);
}

export async function deleteProduct(productId) {
  const { error } = await supabase.from('products').delete().eq('id', productId);
  if (error) throw error;
}

export async function uploadProductImage(file, productId = crypto.randomUUID(), onProgress) {
  onProgress?.('Optimizando imagen...');
  const optimizedFile = await optimizeImageFile(file);
  const path = `products/${productId}-${Date.now()}.webp`;
  onProgress?.('Subiendo imagen optimizada...');
  const { error } = await Promise.race([
    supabase.storage.from('product-images').upload(path, optimizedFile, {
      cacheControl: '31536000',
      upsert: false,
      contentType: 'image/webp'
    }),
    new Promise((_, reject) => window.setTimeout(() => reject(new Error('La subida tardó demasiado. Revisa tu conexión e inténtalo de nuevo.')), 30000))
  ]);

  if (error) throw error;
  const { data } = supabase.storage.from('product-images').getPublicUrl(path);
  return data.publicUrl;
}
