# Modular CMS Starter (Next.js + Supabase + Vercel)

Production-ready structured CMS starter for agency/client use with one reusable codebase and separate deployment per client.

## Stack
- Next.js App Router + React + TypeScript
- Tailwind CSS + shadcn-style UI primitives
- Supabase Auth and Postgres (RLS enabled)
- Zod + React Hook Form
- Vercel deployment model

## What this MVP includes
- Public routes: `/`, `/[slug]`, `/blog`, `/blog/[slug]`
- Admin routes: `/admin`, `/admin/pages`, `/admin/pages/[id]`, `/admin/media`, `/admin/content-types`, `/admin/content/[contentTypeKey]`, `/admin/features`, `/admin/settings`, `/admin/blog`, `/admin/users`
- Supabase SSR-safe auth client setup for App Router
- Protected admin routing + login/logout
- Project-aware data access (`project_id` filtered)
- Structured page editor (template schema driven, no drag/drop)
- Public template rendering (`home_v1`, `about_v1`, `contact_v1`, `landing_v1`)
- SEO/social metadata mapping for public pages
- Media registry UI (extensible upload abstraction)
- Feature ledger UI
- Content type foundation with structured content entries
- Activity log helper inserts for key content operations

## Environment variables
Use `.env.local` from `.env.example`.
- `NEXT_PUBLIC_SUPABASE_URL` (public)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (public)
- `SUPABASE_SERVICE_ROLE_KEY` (server only, only where strictly necessary)
- `NEXT_PUBLIC_SITE_URL` (public URL for canonical metadata)
- `OPENAI_API_KEY` (optional/future AI features)
- `NEXT_PUBLIC_SITE_PROJECT_ID` (public project ID used for public site settings lookup)

## Local setup
1. Install deps: `npm install`
2. Configure `.env.local`
3. Run dev server: `npm run dev`
4. Open `http://localhost:3000`

## Vercel deployment
1. Import repo in Vercel.
2. Set environment variables for Development / Preview / Production.
3. Deploy with default Next.js build output (no custom server required).

## Auth model
- Uses Supabase SSR pattern with:
  - `lib/supabase/client.ts` (browser)
  - `lib/supabase/server.ts` (server)
  - `lib/supabase/middleware.ts` + root `middleware.ts`
- `/admin` is protected by server-side session check.
- Assumes authenticated users exist in `auth.users`, `profiles`, and `project_users`.

## Project scoping
- All CMS reads/writes are project-aware with `project_id` filters.
- Current project abstraction defaults to first membership and can be expanded to an internal-admin selector.

## Templates and sections
- Template definitions are stored in `template_definitions.schema_json`.
- Structured `page_content` is edited through a schema renderer.
- Public renderer maps `template_key` to React template components.
- To add a new template:
  1. Create template component under `components/site/templates`.
  2. Register it in `lib/templates/registry.tsx`.
  3. Add template schema row in `template_definitions`.
- To add a new section component:
  1. Create component under `components/site/sections`.
  2. Compose it in one or more templates.

## Add a new content type
1. Insert row in `content_types` with `key`, `label`, and `schema_json`.
2. Render/edit entries via `/admin/content/[contentTypeKey]`.
3. Extend entry editor UI for field-level editing (same schema renderer strategy as pages).

## Explicit migration warnings for future features
The following enhancements **require DB migrations** (tables/columns/constraints/indexes/RLS):
- Revision history rollback: new `page_revisions` / `content_entry_revisions` tables, indexes, and RLS.
- Multilingual content: locale columns + composite unique constraints + locale-aware indexes + RLS changes.
- Preview token system: preview token table with expiration indexes + RLS for secure token reads.
- Workflow approvals: approval tables, state columns, constraints, and policy updates.
- Analytics dashboards: event tables and performance indexes.
- Forms builder/ecommerce/email builder: entirely new domain tables and RLS policy surface.

Also note: if you add project switching persistence, media usage tracking, or template versioning, you should plan corresponding new constraints and indexes to keep writes safe and query plans stable.


## New required migration for this MVP
Run `supabase/migrations/20260316131000_cms_mvp.sql` before using blog and site settings.

## Automated form monitoring (Playwright + cron + email)
This repository now includes a scheduler that can run Playwright form submission checks on one or more sites and email you a PASS/FAIL report.

### 1) Install browser dependency
```bash
npm install
npx playwright install chromium
```

### 2) Configure environments
Copy `.env.example` to `.env.local` and set:
- `FORM_CHECK_CRON` cron expression (example: `*/30 * * * *`)
- `FORM_CHECK_EMAIL_FROM` sender email
- `FORM_CHECK_EMAIL_TO` recipient email(s), comma-separated
- SMTP settings using either:
  - `FORM_CHECK_SMTP_URL`, or
  - `FORM_CHECK_SMTP_HOST`, `FORM_CHECK_SMTP_PORT`, `FORM_CHECK_SMTP_USER`, `FORM_CHECK_SMTP_PASS`

### 3) Configure sites + form steps
Copy the template and customize selectors:
```bash
cp scripts/form-sites.example.json scripts/form-sites.json
```

For each site entry:
- `url`: page containing the form
- `steps`: ordered interactions (`fill`, `click`, `check`, `waitForSelector`)
- `successSelector`: selector that confirms a successful submit

### 4) Run locally
- Run continuously on cron:
  ```bash
  npm run form:monitor
  ```
- Run immediately (and continue scheduled checks):
  ```bash
  npm run form:check-once
  ```

### 5) Run in production as a cron worker
Run `npm run form:monitor` in any long-running worker/container/process manager where the env vars are configured.
