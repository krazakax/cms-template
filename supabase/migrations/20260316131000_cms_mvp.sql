-- Required migration for CMS MVP: blog posts + site settings.
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  slug text not null,
  excerpt text,
  content text not null default '',
  cover_image_url text,
  author_name text,
  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, slug)
);

create index if not exists posts_project_status_idx on public.posts(project_id, status);
create index if not exists posts_project_published_idx on public.posts(project_id, published_at desc);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  site_title text not null default '',
  logo_url text,
  footer_content text,
  nav_menu jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id)
);

create index if not exists site_settings_project_idx on public.site_settings(project_id);

-- If your project uses RLS, add matching SELECT/INSERT/UPDATE policies for posts and site_settings
-- equivalent to existing project-scoped CMS tables.
