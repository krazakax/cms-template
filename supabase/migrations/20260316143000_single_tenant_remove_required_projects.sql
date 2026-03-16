-- Single-tenant mode migration (one client per DB/deployment)
-- Makes project linkage optional for CMS tables and adds global uniqueness for key slugs/keys.

alter table if exists public.pages alter column project_id drop not null;
alter table if exists public.template_definitions alter column project_id drop not null;
alter table if exists public.posts alter column project_id drop not null;
alter table if exists public.site_settings alter column project_id drop not null;
alter table if exists public.media_assets alter column project_id drop not null;
alter table if exists public.content_types alter column project_id drop not null;
alter table if exists public.content_entries alter column project_id drop not null;
alter table if exists public.feature_ledger alter column project_id drop not null;
alter table if exists public.activity_logs alter column project_id drop not null;

-- Drop legacy per-project unique constraints where present.
do $$
declare
  c record;
  target_tables oid[];
begin
  target_tables := array_remove(array[
    to_regclass('public.pages')::oid,
    to_regclass('public.posts')::oid,
    to_regclass('public.template_definitions')::oid,
    to_regclass('public.site_settings')::oid
  ], null);

  if coalesce(array_length(target_tables, 1), 0) = 0 then
    return;
  end if;

  for c in
    select conname, conrelid::regclass as tbl
    from pg_constraint
    where contype = 'u'
      and conrelid = any(target_tables)
      and pg_get_constraintdef(oid) ilike '%project_id%'
      and pg_get_constraintdef(oid) not ilike 'UNIQUE (id, project_id)%'
      and not exists (
        select 1
        from pg_depend d
        join pg_constraint fk on fk.oid = d.objid
        where d.refobjid = pg_constraint.oid
          and d.classid = 'pg_constraint'::regclass
          and fk.contype = 'f'
      )
  loop
    execute format('alter table %s drop constraint if exists %I', c.tbl, c.conname);
  end loop;
end $$;

-- Enforce single-tenant uniqueness globally.
do $$
begin
  if to_regclass('public.pages') is not null then
    execute 'create unique index if not exists pages_slug_unique_single_tenant on public.pages(slug)';
  end if;

  if to_regclass('public.posts') is not null then
    execute 'create unique index if not exists posts_slug_unique_single_tenant on public.posts(slug)';
  end if;

  if to_regclass('public.template_definitions') is not null then
    execute 'create unique index if not exists template_definitions_template_key_unique_single_tenant on public.template_definitions(template_key)';
  end if;

  if to_regclass('public.site_settings') is not null then
    execute 'create unique index if not exists site_settings_single_row_single_tenant on public.site_settings((true))';
  end if;
end $$;

-- Optional cleanup once app no longer uses project membership at all:
-- drop table if exists public.project_users;
-- drop table if exists public.projects;
