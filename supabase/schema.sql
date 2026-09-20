-- Ejecutar en Supabase SQL Editor.
-- Después de crear tu usuario en Auth, inserta su UUID en profiles con role = 'admin'.

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
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_public_order_idx on public.products (published, sort_order, created_at desc);
create index if not exists products_category_idx on public.products (category_id);

-- Migration for projects created with an earlier version of this schema.
alter table public.products add column if not exists youtube_url text not null default '';

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

drop policy if exists "Public can read active categories" on public.categories;
create policy "Public can read active categories" on public.categories
for select to anon, authenticated using (active = true);

drop policy if exists "Admins manage categories" on public.categories;
create policy "Admins manage categories" on public.categories
for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "Public can read published products" on public.products;
create policy "Public can read published products" on public.products
for select to anon, authenticated using (published = true);

drop policy if exists "Admins read all products" on public.products;
create policy "Admins read all products" on public.products
for select to authenticated using ((select public.is_admin()));

drop policy if exists "Admins create products" on public.products;
create policy "Admins create products" on public.products
for insert to authenticated with check ((select public.is_admin()));

drop policy if exists "Admins update products" on public.products;
create policy "Admins update products" on public.products
for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "Admins delete products" on public.products;
create policy "Admins delete products" on public.products
for delete to authenticated using ((select public.is_admin()));

insert into public.categories (id, name, slug, sort_order) values
  ('box-spring', 'Box Spring', 'box-spring', 1),
  ('ceibos', 'Ceibos', 'ceibos', 2),
  ('closet', 'Closet', 'closet', 3),
  ('comedores', 'Comedores', 'comedores', 4),
  ('dormitorios', 'Dormitorios', 'dormitorios', 5),
  ('espejos', 'Espejos', 'espejos', 6),
  ('gaveteros', 'Gaveteros', 'gaveteros', 7),
  ('mesas-de-centro', 'Mesas de Centro', 'mesas-de-centro', 8),
  ('mesas-de-noche', 'Mesas de Noche', 'mesas-de-noche', 9),
  ('mesas-tv', 'Mesas Tv', 'mesas-tv', 10),
  ('peinadoras', 'Peinadoras', 'peinadoras', 11),
  ('poltronas', 'Poltronas', 'poltronas', 12),
  ('sillas', 'Sillas', 'sillas', 13),
  ('sofacamas', 'Sofacamas', 'sofacamas', 14),
  ('sofas', 'Sofas', 'sofas', 15),
  ('taburete', 'Taburete', 'taburete', 16),
  ('zapateras', 'Zapateras', 'zapateras', 17)
on conflict (id) do update set name = excluded.name, slug = excluded.slug, sort_order = excluded.sort_order;

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images" on storage.objects
for select to anon, authenticated using (bucket_id = 'product-images');

drop policy if exists "Admins upload product images" on storage.objects;
create policy "Admins upload product images" on storage.objects
for insert to authenticated with check (bucket_id = 'product-images' and (select public.is_admin()));

drop policy if exists "Admins update product images" on storage.objects;
create policy "Admins update product images" on storage.objects
for update to authenticated using (bucket_id = 'product-images' and (select public.is_admin()))
with check (bucket_id = 'product-images' and (select public.is_admin()));

drop policy if exists "Admins delete product images" on storage.objects;
create policy "Admins delete product images" on storage.objects
for delete to authenticated using (bucket_id = 'product-images' and (select public.is_admin()));
