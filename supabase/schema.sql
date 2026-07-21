-- ===========================================================================
-- Rifat Rafiu — Research Portfolio : Database schema
-- Run this in the Supabase SQL Editor (Project -> SQL Editor -> New query).
-- It is safe to re-run; it uses "if not exists" / "on conflict" where possible.
-- ===========================================================================

-- Extensions -----------------------------------------------------------------
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- 1. PROFILE  (single row that holds the researcher's headline info)
-- ---------------------------------------------------------------------------
create table if not exists public.profile (
  id            uuid primary key default uuid_generate_v4(),
  full_name     text not null,
  headline      text,                -- e.g. "Materials Science & Engineering Researcher"
  tagline       text,                -- short hero sentence
  bio           text,                -- long "About" paragraph(s)
  photo_url     text,
  cv_url        text,
  email         text,
  phone         text,
  location      text,
  institution   text,
  department    text,
  degree        text,
  cgpa          text,
  -- citation metrics (kept manual so they can be curated)
  citations     integer default 0,
  h_index       integer default 0,
  i10_index     integer default 0,
  publications_count integer default 0,
  -- social / academic links
  google_scholar text,
  researchgate   text,
  orcid          text,
  linkedin       text,
  facebook       text,
  github         text,
  twitter        text,
  updated_at    timestamptz default now()
);

alter table public.profile
  add column if not exists facebook text;

-- ---------------------------------------------------------------------------
-- 2. PUBLICATIONS
-- ---------------------------------------------------------------------------
create table if not exists public.publications (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  authors     text not null,
  venue       text,                  -- journal / conference
  year        integer,
  volume      text,
  doi         text,
  url         text,
  citations   integer default 0,
  type        text default 'journal',  -- journal | conference | preprint | thesis
  abstract    text,
  tags        text[] default '{}',
  featured    boolean default false,
  sort_order  integer default 0,
  created_at  timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- 3. RESEARCH AREAS / INTERESTS
-- ---------------------------------------------------------------------------
create table if not exists public.research_areas (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  description text,
  icon        text default 'atom',   -- lucide icon name
  sort_order  integer default 0
);

-- ---------------------------------------------------------------------------
-- 4. EDUCATION
-- ---------------------------------------------------------------------------
create table if not exists public.education (
  id          uuid primary key default uuid_generate_v4(),
  degree      text not null,
  institution text not null,
  field       text,
  start_date  text,
  end_date    text,
  grade       text,
  description text,
  sort_order  integer default 0
);

-- ---------------------------------------------------------------------------
-- 5. EXPERIENCE (research / professional / training)
-- ---------------------------------------------------------------------------
create table if not exists public.experience (
  id          uuid primary key default uuid_generate_v4(),
  role        text not null,
  organization text not null,
  category    text default 'research', -- research | training | activity | teaching
  start_date  text,
  end_date    text,
  location    text,
  description text,                     -- newline-separated bullet points
  sort_order  integer default 0
);

-- ---------------------------------------------------------------------------
-- 6. SKILLS (grouped by category)
-- ---------------------------------------------------------------------------
create table if not exists public.skills (
  id          uuid primary key default uuid_generate_v4(),
  category    text not null,           -- e.g. "Simulation Software"
  items       text[] default '{}',     -- list of skills within the category
  sort_order  integer default 0
);

-- ---------------------------------------------------------------------------
-- 7. AWARDS & HONORS
-- ---------------------------------------------------------------------------
create table if not exists public.awards (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  issuer      text,
  year        text,
  description text,
  sort_order  integer default 0
);

-- ---------------------------------------------------------------------------
-- 8. PEER REVIEWS (journal reviewing service)
-- ---------------------------------------------------------------------------
create table if not exists public.peer_reviews (
  id          uuid primary key default uuid_generate_v4(),
  journal     text not null,
  publisher   text,
  reviews     integer default 1,
  period      text,
  url         text,
  sort_order  integer default 0
);

-- ---------------------------------------------------------------------------
-- 9. CERTIFICATIONS (courses, training, conferences, recognitions)
-- ---------------------------------------------------------------------------
create table if not exists public.certifications (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  issuer      text,
  date        text,
  category    text default 'course',  -- course | training | conference | recognition
  description text,
  url         text,
  sort_order  integer default 0
);

-- ---------------------------------------------------------------------------
-- 10. CONTACT MESSAGES (submitted from the public contact form)
-- ---------------------------------------------------------------------------
create table if not exists public.messages (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  email       text not null,
  subject     text,
  body        text not null,
  is_read     boolean default false,
  created_at  timestamptz default now()
);

-- ===========================================================================
-- ROW LEVEL SECURITY
--   Public site  -> anyone can READ portfolio content.
--   Dashboard    -> only authenticated users can WRITE.
--   Messages     -> anyone can INSERT (contact form), only auth can READ.
-- ===========================================================================
alter table public.profile        enable row level security;
alter table public.publications   enable row level security;
alter table public.research_areas enable row level security;
alter table public.education      enable row level security;
alter table public.experience     enable row level security;
alter table public.skills         enable row level security;
alter table public.awards         enable row level security;
alter table public.peer_reviews   enable row level security;
alter table public.certifications enable row level security;
alter table public.messages       enable row level security;

-- Helper: create public-read + auth-write policies for a table
do $$
declare
  t text;
  read_tables text[] := array[
    'profile','publications','research_areas',
    'education','experience','skills','awards',
    'peer_reviews','certifications'
  ];
begin
  foreach t in array read_tables loop
    execute format('drop policy if exists "public read %1$s" on public.%1$I;', t);
    execute format('create policy "public read %1$s" on public.%1$I for select using (true);', t);

    execute format('drop policy if exists "auth write %1$s" on public.%1$I;', t);
    execute format('create policy "auth write %1$s" on public.%1$I for all to authenticated using (true) with check (true);', t);
  end loop;
end $$;

-- Messages: anyone may submit, only authenticated users may read / update / delete
drop policy if exists "anyone insert messages" on public.messages;
create policy "anyone insert messages" on public.messages
  for insert with check (true);

drop policy if exists "auth read messages" on public.messages;
create policy "auth read messages" on public.messages
  for select to authenticated using (true);

drop policy if exists "auth manage messages" on public.messages;
create policy "auth manage messages" on public.messages
  for update to authenticated using (true) with check (true);

drop policy if exists "auth delete messages" on public.messages;
create policy "auth delete messages" on public.messages
  for delete to authenticated using (true);

-- ===========================================================================
-- STORAGE BUCKETS  (for profile photo + CV / document uploads)
-- ===========================================================================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do nothing;

-- Public read of both buckets
drop policy if exists "public read avatars" on storage.objects;
create policy "public read avatars" on storage.objects
  for select using (bucket_id in ('avatars','documents'));

-- Authenticated users can upload / update / delete files
drop policy if exists "auth write storage" on storage.objects;
create policy "auth write storage" on storage.objects
  for insert to authenticated with check (bucket_id in ('avatars','documents'));

drop policy if exists "auth update storage" on storage.objects;
create policy "auth update storage" on storage.objects
  for update to authenticated using (bucket_id in ('avatars','documents'));

drop policy if exists "auth delete storage" on storage.objects;
create policy "auth delete storage" on storage.objects
  for delete to authenticated using (bucket_id in ('avatars','documents'));
