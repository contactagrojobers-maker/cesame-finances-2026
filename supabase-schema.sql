-- À exécuter une seule fois dans Supabase : SQL Editor.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text not null,
  role text not null check (role in ('Promoteur','Directeur','Scolarité')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.app_state (
  id smallint primary key check (id = 1),
  document jsonb not null default '{"incomes":[],"expenses":[],"planned":[],"teachers":[],"audit":[]}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

alter table public.profiles enable row level security;
alter table public.app_state enable row level security;
-- Les données passent uniquement par les API Vercel avec la clé serveur.
