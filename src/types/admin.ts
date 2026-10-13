/**
 * @file admin.ts
 * @description Tipos compartidos del panel de administración.
 */

/** Foto en edición: URL existente (ya subida) o archivo local pendiente de subir. */
export interface GalleryItem {
  id: string;
  url: string;
  file?: File;
}

/** Variante de color en edición dentro del formulario de /admin. */
export interface ColorVariantDraft {
  id: string;
  name: string;
  hexColor: string;
  /** true = este color corresponde a las fotos de la galería principal (no tiene fotos propias). */
  usesMainGallery: boolean;
  items: GalleryItem[];
}
