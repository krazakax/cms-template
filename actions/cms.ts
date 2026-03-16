"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity/log";
import { slugify } from "@/lib/utils";

const pageSchema = z.object({
  id: z.string(),
  project_id: z.string(),
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
});

export async function savePage(input: unknown, actorId: string) {
  const data = pageSchema.parse(input);
  const supabase = await createClient();
  const payload = { ...data, slug: slugify(data.slug || data.title) };
  const { error } = await supabase.from("pages").update(payload).eq("id", data.id).eq("project_id", data.project_id);
  if (error) return { error: error.message };
  await logActivity(data.project_id, actorId, "pages", data.id, "updated", { title: data.title });
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
