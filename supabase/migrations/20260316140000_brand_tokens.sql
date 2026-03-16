create table if not exists public.brand_tokens (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  primary_color text not null default '#3B82F6',
  secondary_color text not null default '#1E40AF',
  accent_color text not null default '#F59E0B',
  background_color text not null default '#FFFFFF',
  text_color text not null default '#111827',
  font_family text not null default 'Inter, sans-serif',
  updated_at timestamptz not null default now(),
  unique (project_id)
);

create index if not exists brand_tokens_project_idx on public.brand_tokens(project_id);
