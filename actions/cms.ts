"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity/log";
import { slugify } from "@/lib/utils";
import { getTemplateSchema } from "@/lib/templates/predefined";

const pageSchema = z.object({
  id: z.string(),
  title: z.string().min(2),
  slug: z.string().min(1),
  status: z.enum(["draft", "published"]),
  page_content: z.record(z.any()),
  seo_title: z.string().nullable(),
  seo_description: z.string().nullable(),
  og_title: z.string().nullable(),
  og_description: z.string().nullable(),
  og_image_url: z.string().nullable(),
  canonical_url: z.string().nullable(),
  noindex: z.boolean(),
  published_at: z.string().nullable(),
  project_id: z.string().nullable().optional(),
});

const postSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2),
  slug: z.string().min(1),
  excerpt: z.string().nullable(),
  content: z.string(),
  cover_image_url: z.string().nullable(),
  author_name: z.string().nullable(),
  status: z.enum(["draft", "published"]),
  published_at: z.string().nullable(),
  project_id: z.string().nullable().optional(),
});

const navItemSchema = z.object({ label: z.string().min(1), href: z.string().min(1) });

const siteSettingsSchema = z.object({
  id: z.string().optional(),
  site_title: z.string(),
  logo_url: z.string().nullable(),
  footer_content: z.string().nullable(),
  nav_menu: z.array(navItemSchema),
  project_id: z.string().nullable().optional(),
});

async function logIfProject(projectId: string | null | undefined, actorId: string, entityType: string, entityId: string, action: string, payload?: Record<string, unknown>) {
  if (!projectId) return;
  await logActivity(projectId, actorId, entityType, entityId, action, payload);
}

export async function savePage(input: unknown, actorId: string) {
  const data = pageSchema.parse(input);
  const supabase = await createClient();
  const payload = {
    ...data,
    slug: slugify(data.slug || data.title),
    published_at: data.status === "published" ? data.published_at ?? new Date().toISOString() : null,
  };

  const { error } = await supabase.from("pages").update(payload).eq("id", data.id);
  if (error) return { error: error.message };
  await logIfProject(data.project_id, actorId, "pages", data.id, "updated", { title: data.title });
  return { success: true };
}

export async function createPage(input: { title: string; slug: string; template_key: string }, _actorId: string) {
  const supabase = await createClient();
  const slug = slugify(input.slug || input.title);

  const { data: existingDefinition } = await supabase
    .from("template_definitions")
    .select("id")
    .eq("template_key", input.template_key)
    .maybeSingle();

  const templateDefinitionId = existingDefinition?.id
    ? existingDefinition.id
    : (
        await supabase
          .from("template_definitions")
          .insert({ template_key: input.template_key, schema_json: getTemplateSchema(input.template_key) })
          .select("id")
          .single()
      ).data?.id;

  if (!templateDefinitionId) return { error: "Unable to create/find template definition" };

  const { data, error } = await supabase
    .from("pages")
    .insert({
      template_definition_id: templateDefinitionId,
      title: input.title,
      slug,
      status: "draft",
      page_content: {},
      noindex: false,
      project_id: null,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  return { success: true, id: data.id };
}

export async function savePost(input: unknown, actorId: string) {
  const data = postSchema.parse(input);
  const supabase = await createClient();
  const payload = {
    ...data,
    slug: slugify(data.slug || data.title),
    published_at: data.status === "published" ? data.published_at ?? new Date().toISOString() : null,
  };

  const query = data.id ? supabase.from("posts").update(payload).eq("id", data.id) : supabase.from("posts").insert({ ...payload, project_id: payload.project_id ?? null });
  const { error, data: result } = await query.select("id").single();
  if (error) return { error: error.message };
  await logIfProject(data.project_id, actorId, "posts", result.id, data.id ? "updated" : "created", { title: data.title });
  return { success: true, id: result.id };
}

export async function saveSiteSettings(
  input: { id?: string; site_title: string; logo_url: string | null; footer_content: string | null; nav_menu: unknown; project_id?: string | null },
  actorId: string,
) {
  const parsed = siteSettingsSchema.parse(input);
  const supabase = await createClient();
  const query = parsed.id ? supabase.from("site_settings").update(parsed).eq("id", parsed.id) : supabase.from("site_settings").insert({ ...parsed, project_id: parsed.project_id ?? null });
  const { error, data } = await query.select("id").single();
  if (error) return { error: error.message };
  await logIfProject(parsed.project_id, actorId, "site_settings", data.id, parsed.id ? "updated" : "created");
  return { success: true };
}

export async function saveFeature(input: { id?: string; project_id: string; title: string; category: string; status: string; description?: string; notes?: string; client_visible: boolean; }, actorId: string) {
  const supabase = await createClient();
  const payload = { ...input };
  const query = input.id ? supabase.from("feature_ledger").update(payload).eq("id", input.id) : supabase.from("feature_ledger").insert(payload);
  const { error, data } = await query.select("id").single();
  if (error) return { error: error.message };
  await logActivity(input.project_id, actorId, "feature_ledger", data.id, input.id ? "updated" : "created");
  return { success: true };
}

export async function saveMedia(input: { id?: string; project_id: string; file_url: string; alt_text?: string; metadata?: Record<string, unknown>; }, actorId: string) {
  const supabase = await createClient();
  const query = input.id ? supabase.from("media_assets").update(input).eq("id", input.id) : supabase.from("media_assets").insert(input);
  const { error, data } = await query.select("id").single();
  if (error) return { error: error.message };
  await logActivity(input.project_id, actorId, "media_assets", data.id, input.id ? "updated" : "created");
  return { success: true };
}

export async function saveContentEntry(input: { id?: string; project_id: string; content_type_id: string; title: string; content_json: Record<string, unknown>; status: string; }, actorId: string) {
  const supabase = await createClient();
  const query = input.id ? supabase.from("content_entries").update(input).eq("id", input.id) : supabase.from("content_entries").insert(input);
  const { error, data } = await query.select("id").single();
  if (error) return { error: error.message };
  await logActivity(input.project_id, actorId, "content_entries", data.id, input.id ? "updated" : "created");
  return { success: true };
}
