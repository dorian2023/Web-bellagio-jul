/**
 * @file optimize-storage.mjs
 * @description Script para limpiar y optimizar imágenes pesadas (.png/.jpg) en Supabase Storage.
 *
 * ¿Qué hace este script?
 * 1. Conecta con Supabase y obtiene los productos.
 * 2. Identifica todas las imágenes alojadas en el bucket 'product-images' que sean .png o .jpg.
 * 3. Descarga la imagen, la comprime con sharp a WebP HD (calidad 88%, max 1920px).
 * 4. Sube la versión .webp optimizada al bucket.
 * 5. Actualiza los registros en la tabla 'products' (image_url, gallery_images, color_variants).
 * 6. Elimina el archivo original pesado (.png/.jpg) de Supabase Storage para liberar espacio real.
 *
 * Uso:
 *   node scripts/optimize-storage.mjs
 *   node scripts/optimize-storage.mjs --dry-run   (solo analiza sin modificar)
 */

import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Cargar variables de entorno desde .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const envVars = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const [key, ...rest] = trimmed.split('=');
    if (key && rest.length) envVars[key.trim()] = rest.join('=').trim();
  });
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || envVars.NEXT_PUBLIC_SUPABASE_URL || 'https://vjtjwifynfzdjkdpruty.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || envVars.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Argumentos CLI: --email, --password, --dry-run
const args = process.argv.slice(2);
const getArg = (name) => {
  const idx = args.indexOf(name);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
};

const cliEmail = getArg('--email') || process.env.ADMIN_EMAIL || envVars.ADMIN_EMAIL || 'doriangonzalez2018@gmail.com';
const cliPassword = getArg('--password') || process.env.ADMIN_PASSWORD || envVars.ADMIN_PASSWORD || null;
const isDryRun = args.includes('--dry-run');

console.log('----------------------------------------------------');
console.log('🏛️  MUEBLES BELLAGIO - OPTIMIZADOR DE SUPABASE STORAGE');
console.log('----------------------------------------------------');
console.log(`📡 URL Supabase: ${SUPABASE_URL}`);
console.log(`⚙️  Modo: ${isDryRun ? '🔍 SIMULACIÓN (--dry-run)' : '🚀 EJECUCIÓN REAL'}`);
console.log('----------------------------------------------------\n');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  // Autenticación si no se está usando Service Role Key
  const isServiceRole = SUPABASE_KEY.startsWith('ey') && !SUPABASE_KEY.includes('publishable');
  if (!isServiceRole && !isDryRun) {
    if (cliEmail && cliPassword) {
      console.log(`🔑 Autenticando con cuenta admin (${cliEmail})...`);
      const { error: authErr } = await supabase.auth.signInWithPassword({
        email: cliEmail,
        password: cliPassword
      });
      if (authErr) {
        console.error('❌ Error de autenticación en Supabase:', authErr.message);
        console.error('👉 Tip: Ejecuta con: node scripts/optimize-storage.mjs --password "TU_CONTRASEÑA"');
        process.exit(1);
      }
      console.log('✅ Autenticación exitosa como Administrador.\n');
    } else {
      console.log('⚠️ Para subir y borrar en Supabase Storage se requiere la clave del usuario administrador.');
      console.log('👉 Ejecuta el script con tu contraseña:');
      console.log('   node scripts/optimize-storage.mjs --email doriangonzalez2018@gmail.com --password "TU_CONTRASEÑA"');
      console.log('\n(Ejecutando en modo SIMULACIÓN para que veas cuánto espacio ahorrarás)...\n');
    }
  }

  // 1. Obtener todos los productos
  console.log('📦 Consultando productos en Supabase...');
  const { data: products, error } = await supabase
    .from('products')
    .select('id, title, image_url, gallery_images, color_variants');

  if (error) {
    console.error('❌ Error al consultar productos:', error.message);
    process.exit(1);
  }

  console.log(`✅ Se encontraron ${products.length} productos en la base de datos.\n`);

  // 2. Extraer lista única de URLs de imágenes alojadas en Supabase Storage
  const urlMap = new Map(); // oldUrl -> { productsToUpdate: [], newUrl: null, oldBytes: 0, newBytes: 0 }

  for (const prod of products) {
    const urls = [];
    if (prod.image_url) urls.push({ field: 'image_url', url: prod.image_url });
    if (Array.isArray(prod.gallery_images)) {
      prod.gallery_images.forEach((u, idx) => urls.push({ field: 'gallery_images', index: idx, url: u }));
    }
    if (Array.isArray(prod.color_variants)) {
      prod.color_variants.forEach((cv, cvIdx) => {
        if (Array.isArray(cv.images)) {
          cv.images.forEach((u, imgIdx) => urls.push({ field: 'color_variants', cvIdx, imgIdx, url: u }));
        }
      });
    }

    for (const item of urls) {
      const url = item.url;
      // Solo nos interesan las imágenes de nuestro bucket que sean PNG o JPG pesadas
      if (url && url.includes('supabase.co') && url.includes('/product-images/')) {
        const isPngOrJpg = url.match(/\.(png|jpe?g)($|\?)/i);
        if (isPngOrJpg) {
          if (!urlMap.has(url)) {
            urlMap.set(url, { usages: [] });
          }
          urlMap.get(url).usages.push({ prodId: prod.id, ...item });
        }
      }
    }
  }

  const heavyUrls = Array.from(urlMap.keys());
  console.log(`🎯 Se identificaron ${heavyUrls.length} imágenes pesadas (.png/.jpg) en Supabase Storage.`);

  if (heavyUrls.length === 0) {
    console.log('✨ ¡Todas las fotos ya están en formato WebP o no hay PNGs por optimizar!');
    return;
  }

  let totalOldBytes = 0;
  let totalNewBytes = 0;
  let successCount = 0;

  for (let i = 0; i < heavyUrls.length; i++) {
    const oldUrl = heavyUrls[i];
    console.log(`\n[${i + 1}/${heavyUrls.length}] Procesando: ${oldUrl.split('/').pop()}`);

    try {
      // Descargar buffer original
      const resp = await fetch(oldUrl);
      if (!resp.ok) {
        console.warn(`  ⚠️ No se pudo descargar: HTTP ${resp.status}`);
        continue;
      }

      const originalBuffer = Buffer.from(await resp.arrayBuffer());
      const oldSizeKb = (originalBuffer.length / 1024).toFixed(1);
      totalOldBytes += originalBuffer.length;

      // Optimizar con sharp a WebP HD (1920px max, calidad 88)
      const optimizedBuffer = await sharp(originalBuffer)
        .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 88, effort: 4 })
        .toBuffer();

      const newSizeKb = (optimizedBuffer.length / 1024).toFixed(1);
      const savings = (((originalBuffer.length - optimizedBuffer.length) / originalBuffer.length) * 100).toFixed(1);
      totalNewBytes += optimizedBuffer.length;

      console.log(`  📊 Tamaño original: ${oldSizeKb} KB ➔ Nuevo WebP: ${newSizeKb} KB (Ahorro: -${savings}%)`);

      if (isDryRun) {
        continue;
      }

      // Extraer nombre de ruta relativo al bucket 'product-images'
      // URL típica: .../storage/v1/object/public/product-images/products/filename.png
      const match = oldUrl.match(/\/product-images\/(.+)$/);
      if (!match) {
        console.warn('  ⚠️ No se pudo extraer la ruta del bucket');
        continue;
      }

      const oldStoragePath = match[1];
      const baseClean = oldStoragePath.replace(/\.[^/.]+$/, '');
      const newStoragePath = `${baseClean}.webp`;

      // Subir archivo WebP optimizado
      const { error: upErr } = await supabase.storage
        .from('product-images')
        .upload(newStoragePath, optimizedBuffer, {
          contentType: 'image/webp',
          cacheControl: '31536000',
          upsert: true
        });

      if (upErr) {
        console.error('  ❌ Error al subir WebP:', upErr.message);
        continue;
      }

      const { data: pubData } = supabase.storage
        .from('product-images')
        .getPublicUrl(newStoragePath);

      const newUrl = pubData.publicUrl;

      // Actualizar referencias en los productos que usan esta URL
      const usages = urlMap.get(oldUrl).usages;
      for (const usage of usages) {
        const prod = products.find(p => p.id === usage.prodId);
        if (!prod) continue;

        let shouldUpdate = false;
        const patch = {};

        if (prod.image_url === oldUrl) {
          patch.image_url = newUrl;
          prod.image_url = newUrl;
          shouldUpdate = true;
        }

        if (Array.isArray(prod.gallery_images) && prod.gallery_images.includes(oldUrl)) {
          patch.gallery_images = prod.gallery_images.map(u => (u === oldUrl ? newUrl : u));
          prod.gallery_images = patch.gallery_images;
          shouldUpdate = true;
        }

        if (Array.isArray(prod.color_variants)) {
          let cvChanged = false;
          const updatedCv = prod.color_variants.map(cv => {
            if (Array.isArray(cv.images) && cv.images.includes(oldUrl)) {
              cvChanged = true;
              return { ...cv, images: cv.images.map(u => (u === oldUrl ? newUrl : u)) };
            }
            return cv;
          });
          if (cvChanged) {
            patch.color_variants = updatedCv;
            prod.color_variants = updatedCv;
            shouldUpdate = true;
          }
        }

        if (shouldUpdate) {
          const { error: patchErr } = await supabase
            .from('products')
            .update(patch)
            .eq('id', prod.id);

          if (patchErr) {
            console.error(`  ❌ Error actualizando producto "${prod.title}":`, patchErr.message);
          }
        }
      }

      // Eliminar el archivo .png pesado viejo de Storage si no es el mismo nombre
      if (oldStoragePath !== newStoragePath) {
        const { error: delErr } = await supabase.storage
          .from('product-images')
          .remove([oldStoragePath]);

        if (delErr) {
          console.warn(`  ⚠️ No se pudo borrar archivo viejo ${oldStoragePath}:`, delErr.message);
        } else {
          console.log(`  🗑️ Archivo viejo eliminado de Storage: ${oldStoragePath}`);
        }
      }

      successCount++;
    } catch (e) {
      console.error(`  ❌ Excepción procesando ${oldUrl}:`, e.message);
    }
  }

  const savedMb = ((totalOldBytes - totalNewBytes) / (1024 * 1024)).toFixed(2);
  const oldMb = (totalOldBytes / (1024 * 1024)).toFixed(2);
  const newMb = (totalNewBytes / (1024 * 1024)).toFixed(2);

  console.log('\n====================================================');
  console.log('🎉 RESUMEN DE OPTIMIZACIÓN:');
  console.log(`✅ Fotos procesadas con éxito: ${successCount} de ${heavyUrls.length}`);
  console.log(`📦 Peso original total: ${oldMb} MB`);
  console.log(`⚡ Nuevo peso WebP total: ${newMb} MB`);
  console.log(`💾 Espacio liberado en Supabase: ${savedMb} MB (-${(((totalOldBytes - totalNewBytes) / totalOldBytes) * 100).toFixed(1)}%)`);
  console.log('====================================================\n');
}

main().catch(console.error);
