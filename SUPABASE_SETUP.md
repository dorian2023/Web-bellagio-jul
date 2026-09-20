# Configuración del catálogo dinámico

## 1. Crear el proyecto

1. Crea un proyecto en Supabase.
2. En `SQL Editor`, ejecuta `supabase/schema.sql` completo.
   Si ya habías ejecutado una versión anterior, vuelve a ejecutar el archivo: incluye una migración segura para agregar `youtube_url` sin borrar productos existentes.
3. En `Authentication > Users`, crea tu usuario administrador.
4. Copia el UUID de ese usuario y ejecuta:

```sql
insert into public.profiles (id, role)
values ('UUID_DEL_USUARIO', 'admin');
```

El registro público debe permanecer desactivado. Solo los usuarios que estén en `profiles` con rol `admin` pueden modificar productos.

## 2. Variables locales

Copia `.env.example` a `.env.local` y completa:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=tu-clave-publicable
```

La clave publishable/anon es la única que debe llegar al navegador. Nunca agregues una `service_role` al proyecto Vite.

## 3. Uso

- Catálogo público: `/#/catalogo`
- Panel privado: `/#/admin`
- Sin variables configuradas, el sitio usa los productos locales actuales como fallback.
- Con Supabase configurado, el catálogo público muestra solo productos publicados.

## 4. Migración inicial

La primera versión deja el catálogo actual como respaldo. Para cargar las piezas existentes en Supabase, importa los campos de `src/data/catalogs.js` en `products` y sube sus imágenes a `product-images`. Después puedes publicar o dejar cada pieza como borrador desde el panel.

## 5. Vercel

Agrega las mismas variables en `Settings > Environment Variables` para `Production`, `Preview` y `Development`, según corresponda. Luego crea un nuevo deployment.

## 6. Optimización de imágenes

El panel convierte cada imagen a WebP en el navegador, limita su lado mayor a 2400 px y busca un peso final cercano a 2 MB sin degradación visible importante. El catálogo solicita versiones de 720 px para tarjetas y 1200 px para la ficha ampliada.

Si tu plan de Supabase tiene disponible Image Transformations, actívalo en `Storage > Settings > Enable Image Transformations`. Supabase entregará además versiones redimensionadas y optimizadas desde su CDN. Si no está disponible, la compresión WebP local seguirá funcionando.
