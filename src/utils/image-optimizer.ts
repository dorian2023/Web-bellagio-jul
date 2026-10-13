/**
 * @file image-optimizer.ts
 * @description Compresión y optimización automática de imágenes del lado del cliente (Navegador).
 * Convierte archivos pesados (PNG, JPG de 2-10 MB) a formato WebP HD de alta fidelidad (~100-180 KB),
 * preservando transparencia, texturas y reduciendo el consumo de almacenamiento en un ~90-95%.
 */

export interface OptimizationOptions {
  maxDimension?: number;
  quality?: number; // 0.1 a 1.0 (0.88 es el punto dulce de fidelidad de lujo / peso mínimo)
}

/**
 * Optimiza un archivo de imagen en el navegador antes de subirlo a Supabase.
 * Devuelve un nuevo File en formato .webp ultra liviano.
 */
export async function optimizeImageForUpload(
  file: File,
  options: OptimizationOptions = {}
): Promise<File> {
  const { maxDimension = 1920, quality = 0.88 } = options;

  // Si no es un archivo de imagen (ej. svg u otro), retornar intacto
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return file;
  }

  // Si ya es un webp y pesa menos de 300 KB, no requiere recompresión
  if (file.type === 'image/webp' && file.size < 300 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const originalSizeKb = (file.size / 1024).toFixed(1);
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      // Calcular nuevas dimensiones manteniendo la relación de aspecto
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) {
        console.warn('[ImageOptimizer] No se pudo obtener el contexto 2d del canvas, usando original');
        resolve(file);
        return;
      }

      // Máxima calidad de interpolación de imagen
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Dibujar imagen (preserva canal alfa / transparencias si es PNG)
      ctx.drawImage(img, 0, 0, width, height);

      // Convertir a WebP
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.warn('[ImageOptimizer] toBlob devolvió null, usando original');
            resolve(file);
            return;
          }

          const baseName = file.name.replace(/\.[^/.]+$/, '');
          const cleanName = baseName.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
          const newFileName = `${cleanName}.webp`;

          const optimizedFile = new File([blob], newFileName, {
            type: 'image/webp',
            lastModified: Date.now()
          });

          const newSizeKb = (optimizedFile.size / 1024).toFixed(1);
          const savingsPercent = (
            ((file.size - optimizedFile.size) / file.size) *
            100
          ).toFixed(1);

          console.log(
            `%c[ImageOptimizer] ✅ "${file.name}": ${originalSizeKb} KB ➔ ${newSizeKb} KB WebP (-${savingsPercent}%)`,
            'color: #22c55e; font-weight: bold;'
          );

          resolve(optimizedFile);
        },
        'image/webp',
        quality
      );
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      console.warn('[ImageOptimizer] Error cargando la imagen para compresión:', err);
      resolve(file);
    };

    img.src = objectUrl;
  });
}
