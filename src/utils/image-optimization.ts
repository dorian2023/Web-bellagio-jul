/**
 * @file image-optimization.ts
 * @description Image optimization utilities for browser-side pre-upload resizing and Supabase CDN image rendering.
 */

const MAX_OUTPUT_BYTES = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Compresses an uploaded image before it reaches Supabase Storage.
 */
export async function optimizeImageFile(file: File): Promise<Blob> {
  if (!file || !ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('La imagen debe ser JPG, PNG o WebP.');
  }
  if (file.size > 15 * 1024 * 1024) {
    throw new Error('La imagen original no puede superar los 15 MB.');
  }

  const image = await decodeImage(file);
  const scale = Math.min(1, 2400 / Math.max(image.width, image.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  const context = canvas.getContext('2d', { alpha: false });
  if (!context) throw new Error('El navegador no pudo preparar el lienzo de la imagen.');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  if ('close' in image && typeof (image as ImageBitmap).close === 'function') {
    (image as ImageBitmap).close();
  }

  for (const quality of [0.86, 0.8, 0.74]) {
    const blob = await canvasToBlob(canvas, 'image/webp', quality);
    if (blob.size <= MAX_OUTPUT_BYTES || quality === 0.74) return blob;
  }

  throw new Error('No se pudo optimizar la imagen.');
}

async function decodeImage(file: File): Promise<HTMLImageElement | ImageBitmap> {
  if (typeof createImageBitmap === 'function') {
    try {
      return await withTimeout(createImageBitmap(file, { imageOrientation: 'from-image' }), 10000);
    } catch {
      // Some embedded browsers expose createImageBitmap but never resolve it for local files.
    }
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    return await withTimeout(new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('El navegador no pudo leer la imagen seleccionada.'));
      image.src = objectUrl;
    }), 10000);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function withTimeout<T>(promise: Promise<T>, milliseconds: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      if (typeof window !== 'undefined') {
        window.setTimeout(() => reject(new Error('La operación de imagen tardó demasiado.')), milliseconds);
      }
    })
  ]);
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('El navegador no pudo procesar la imagen.')), type, quality);
  });
}

/**
 * Requests a responsive Supabase rendition for product images.
 */
export function getOptimizedImageUrl(
  source?: string | null,
  width = 800,
  height?: number,
  quality = 80,
  resize: 'cover' | 'contain' = 'cover'
): string {
  if (!source || typeof source !== 'string') return '/images/hero-poster.webp';
  if (!source.includes('/storage/v1/object/public/product-images/')) return source;

  try {
    const url = new URL(source);
    url.pathname = url.pathname.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
    url.searchParams.set('width', String(width));
    if (height) url.searchParams.set('height', String(height));
    url.searchParams.set('quality', String(quality));
    url.searchParams.set('resize', resize);
    return url.toString();
  } catch {
    return source;
  }
}
