const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '..', 'src', 'data', 'backup_supabase_products.json');
const categoriesPath = path.join(__dirname, '..', 'src', 'data', 'backup_supabase_categories.json');
const outputPath = path.join(__dirname, 'migration_complete_bellagio.sql');

const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

let sql = `-- ====================================================================
-- MIGRACION COMPLETA PARA MUEBLES BELLAGIO
-- Proyecto de Supabase bajo tu cuenta: doriangonzalez2018@gmail.com
-- Incluye: 17 Categorias + 176 Productos + Galeria + Columna origin
-- ====================================================================

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id text primary key,
  name text not null,
  slug text not null unique,
  sort_order integer not null default 0,
  active boolean not null default true
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text not null default '',
  description text not null default '',
  materials text not null default '',
  dimensions text not null default '',
  available_colors text[] not null default '{}',
  category_id text not null references public.categories(id),
  image_url text not null,
  youtube_url text not null default '',
  gallery_images jsonb not null default '[]'::jsonb,
  origin text not null default 'nacional',
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_public_order_idx on public.products (published, sort_order, created_at desc);
create index if not exists products_category_idx on public.products (category_id);

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- Politicas Categorias
drop policy if exists "Public can read active categories" on public.categories;
create policy "Public can read active categories" on public.categories for select to anon, authenticated using (active = true);
drop policy if exists "Admins manage categories" on public.categories;
create policy "Admins manage categories" on public.categories for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Politicas Productos
drop policy if exists "Public can read published products" on public.products;
create policy "Public can read published products" on public.products for select to anon, authenticated using (published = true);
drop policy if exists "Admins read all products" on public.products;
create policy "Admins read all products" on public.products for select to authenticated using ((select public.is_admin()));
drop policy if exists "Admins create products" on public.products;
create policy "Admins create products" on public.products for insert to authenticated with check ((select public.is_admin()));
drop policy if exists "Admins update products" on public.products;
create policy "Admins update products" on public.products for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
drop policy if exists "Admins delete products" on public.products;
create policy "Admins delete products" on public.products for delete to authenticated using ((select public.is_admin()));

-- Storage bucket
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images" on storage.objects for select to anon, authenticated using (bucket_id = 'product-images');
drop policy if exists "Admins upload product images" on storage.objects;
create policy "Admins upload product images" on storage.objects for insert to authenticated with check (bucket_id = 'product-images' and (select public.is_admin()));
drop policy if exists "Admins update product images" on storage.objects;
create policy "Admins update product images" on storage.objects for update to authenticated using (bucket_id = 'product-images' and (select public.is_admin())) with check (bucket_id = 'product-images' and (select public.is_admin()));
drop policy if exists "Admins delete product images" on storage.objects;
create policy "Admins delete product images" on storage.objects for delete to authenticated using (bucket_id = 'product-images' and (select public.is_admin()));

-- ====================================================================
-- INSERCION DE CATEGORIAS
-- ====================================================================
`;

for (const c of categories) {
  sql += `insert into public.categories (id, name, slug, sort_order, active) values (${escapeSql(c.id)}, ${escapeSql(c.name)}, ${escapeSql(c.slug)}, ${c.sort_order || 0}, ${c.active !== false}) on conflict (id) do update set name = excluded.name, slug = excluded.slug, sort_order = excluded.sort_order;\n`;
}

sql += `\n-- ====================================================================
-- INSERCION DE LOS 176 PRODUCTOS
-- ====================================================================\n`;

for (const p of products) {
  const colorsArray = (p.available_colors || []).map(c => '"' + c.replace(/"/g, '\\"') + '"').join(',');
  const colorsSql = colorsArray ? "'{" + colorsArray + "}'" : "'{}'";
  const gallerySql = escapeSql(JSON.stringify(p.gallery_images || []));
  const originSql = escapeSql(p.origin || 'nacional');

  sql += `insert into public.products (id, slug, title, subtitle, description, materials, dimensions, available_colors, category_id, image_url, youtube_url, gallery_images, origin, sort_order, published) values (${escapeSql(p.id)}, ${escapeSql(p.slug)}, ${escapeSql(p.title)}, ${escapeSql(p.subtitle || '')}, ${escapeSql(p.description || '')}, ${escapeSql(p.materials || '')}, ${escapeSql(p.dimensions || '')}, ${colorsSql}, ${escapeSql(p.category_id)}, ${escapeSql(p.image_url)}, ${escapeSql(p.youtube_url || '')}, ${gallerySql}::jsonb, ${originSql}, ${p.sort_order || 0}, ${p.published !== false}) on conflict (id) do update set title = excluded.title, description = excluded.description, materials = excluded.materials, dimensions = excluded.dimensions, image_url = excluded.image_url, youtube_url = excluded.youtube_url, gallery_images = excluded.gallery_images, origin = excluded.origin, published = excluded.published;\n`;
}

fs.writeFileSync(outputPath, sql);
console.log('SUCCESS: migration_complete_bellagio.sql generated!');
