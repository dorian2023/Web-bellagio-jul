-- Migración: Colores con fotos reales por producto
-- Cada producto puede tener colores (ej. "Bipiel Negro", "Rosado"), cada uno con sus propias fotos.
-- Formato: [{ "id": "...", "name": "Rosado", "hexColor": "#E8B4C0", "images": ["https://..."], "usesMainGallery": false }]

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS color_variants jsonb NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.products.color_variants IS
  'Colores del producto con sus fotos reales. Gestionado desde /admin.';
