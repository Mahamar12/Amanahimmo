-- ============================================================
-- SCHÉMA DE BASE DE DONNÉES SUPABASE POUR AMANAHIMMO
-- Exécutez ce script dans l'Éditeur SQL de votre projet Supabase
-- (Supabase Dashboard -> SQL Editor -> New Query -> Run)
-- ============================================================

-- 1. CRÉATION DE LA TABLE DES BIENS IMMOBILIERS
create table if not exists public.properties (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  reference text not null unique,
  description text,
  transaction_type text check (transaction_type in ('sale', 'rent')) not null,
  property_type text check (property_type in ('apartment', 'house', 'villa', 'land', 'office', 'commercial', 'building', 'other')) not null,
  price numeric not null,
  price_period text check (price_period in ('month', 'year', 'total')) default 'month',
  location text not null,
  city text default 'Dakar',
  neighborhood text,
  area numeric,
  bedrooms integer default 0,
  bathrooms integer default 0,
  rooms integer default 0,
  features text[] default '{}',
  main_image text not null,
  images text[] default '{}',
  featured boolean default false,
  status text check (status in ('available', 'rented', 'sold', 'unavailable')) default 'available',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. SÉCURITÉ ROW LEVEL SECURITY (RLS)
alter table public.properties enable row level security;

-- Annulation des anciennes politiques pour éviter les doublons
drop policy if exists "Public properties viewable" on public.properties;
drop policy if exists "Admins insert properties" on public.properties;
drop policy if exists "Admins update properties" on public.properties;
drop policy if exists "Admins delete properties" on public.properties;

-- Politique : Tout le monde (visiteurs) peut lire les biens
create policy "Public properties viewable" 
  on public.properties 
  for select 
  using (true);

-- Politique : Seuls les utilisateurs authentifiés (administrateurs) peuvent ajouter des biens
create policy "Admins insert properties" 
  on public.properties 
  for insert 
  with check (auth.role() = 'authenticated');

-- Politique : Seuls les administrateurs peuvent modifier les biens
create policy "Admins update properties" 
  on public.properties 
  for update 
  using (auth.role() = 'authenticated');

-- Politique : Seuls les administrateurs peuvent supprimer les biens
create policy "Admins delete properties" 
  on public.properties 
  for delete 
  using (auth.role() = 'authenticated');

-- 3. BUCKET DE STOCKAGE PHOTOS ("property-photos")
-- Créez un bucket public nommé "property-photos" dans Supabase Dashboard -> Storage.
-- Politiques pour le bucket Storage :
insert into storage.buckets (id, name, public) 
values ('property-photos', 'property-photos', true)
on conflict (id) do nothing;

create policy "Public Access Property Photos" 
  on storage.objects 
  for select 
  using (bucket_id = 'property-photos');

create policy "Admin Upload Property Photos" 
  on storage.objects 
  for insert 
  with check (bucket_id = 'property-photos' and auth.role() = 'authenticated');

create policy "Admin Delete Property Photos" 
  on storage.objects 
  for delete 
  using (bucket_id = 'property-photos' and auth.role() = 'authenticated');

-- 4. INSERTION DES BIENS INITIALS (DONNÉES DE DÉMONSTRATION DAKAR)
insert into public.properties (
  title, slug, reference, description, transaction_type, property_type, price, price_period, 
  location, city, neighborhood, area, bedrooms, bathrooms, rooms, features, main_image, images, featured, status
) values 
(
  'Appartement moderne à Mermoz',
  'appartement-moderne-a-mermoz',
  'AM-0001',
  'Magnifique appartement F4 situé dans un quartier calme et résidentiel de Mermoz. Comprend un grand séjour lumineux avec balcons, une cuisine équipée avec buanderie, 3 chambres spacieuses avec placards intégrés dont la suite parentale avec salle d''eau privée, un gardiennage 24h/24 et parking réservé.',
  'rent',
  'apartment',
  350000,
  'month',
  'Mermoz, Dakar',
  'Dakar',
  'Mermoz',
  120,
  3,
  2,
  4,
  ARRAY['Parking', 'Climatisation', 'Balcon', 'Cuisine équipée', 'Eau', 'Électricité', 'Gardien'],
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'],
  true,
  'available'
),
(
  'Villa de luxe aux Almadies',
  'villa-de-luxe-aux-almadies',
  'AM-0002',
  'Somptueuse villa d''architecte avec piscine couverte et jardin paysager située au cœur du quartier prisé des Almadies. 5 grandes suites parentales, 2 salons monumentaux, cuisine américanisée haut de gamme, loge de gardien, garage fermé pour 3 véhicules et système de vidéosurveillance.',
  'sale',
  'villa',
  450000000,
  'total',
  'Almadies, Dakar',
  'Dakar',
  'Almadies',
  450,
  5,
  4,
  8,
  ARRAY['Piscine', 'Jardin', 'Parking', 'Climatisation', 'Balcon', 'Terrasse', 'Cuisine équipée', 'Gardien', 'Sécurité'],
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'],
  true,
  'available'
),
(
  'Appartement à Sacré-Cœur 3',
  'appartement-a-sacre-coeur-3',
  'AM-0003',
  'Superbe appartement neuf de 3 chambres au 3ème étage avec ascenseur dans un immeuble récent à Sacré-Cœur 3. Finitions soignées, proximité immédiate de la VDN, sécurité et réservoir d''eau individuel.',
  'rent',
  'apartment',
  400000,
  'month',
  'Sacré-Cœur 3, Dakar',
  'Dakar',
  'Sacré-Cœur',
  135,
  3,
  2,
  4,
  ARRAY['Ascenseur', 'Parking', 'Climatisation', 'Balcon', 'Gardien', 'Eau', 'Électricité'],
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'],
  true,
  'available'
),
(
  'Terrain à Diamniadio',
  'terrain-a-diamniadio',
  'AM-0004',
  'Parcelle de terrain idéale pour projet d''habitation ou investissement locatif située dans la zone d''avenir de Diamniadio, proche de la gare du TER et de l''autoroute à péage. Titre foncier individuel net.',
  'sale',
  'land',
  18000000,
  'total',
  'Diamniadio, Dakar',
  'Diamniadio',
  'Centre Urbain',
  300,
  0,
  0,
  0,
  ARRAY['Eau', 'Électricité'],
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
  ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'],
  true,
  'available'
)
on conflict (reference) do nothing;
