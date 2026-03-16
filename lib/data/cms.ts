import { createClient } from "@/lib/supabase/server";

export async function getDashboardData(projectId: string) {
  const supabase = await createClient();
  const [pages, activity, features] = await Promise.all([
    supabase.from("pages").select("id,status").eq("project_id", projectId),
    supabase.from("activity_logs").select("id,action,entity_type,created_at").eq("project_id", projectId).order("created_at", { ascending: false }).limit(10),
    supabase.from("feature_ledger").select("id,status").eq("project_id", projectId),
  ]);

  const totalPages = pages.data?.length ?? 0;
  const draftPages = pages.data?.filter((p) => p.status === "draft").length ?? 0;
  const publishedPages = pages.data?.filter((p) => p.status === "published").length ?? 0;

  return { totalPages, draftPages, publishedPages, recentActivity: activity.data ?? [], features: features.data ?? [] };
}

export async function getPageBySlug(projectId: string, slug: string) {
  const supabase = await createClient();
  return supabase.from("pages").select("*, template_definitions(*)").eq("project_id", projectId).eq("slug", slug).single();
}

export async function getPageById(projectId: string, id: string) {
  const supabase = await createClient();
  return supabase.from("pages").select("*, template_definitions(*)").eq("project_id", projectId).eq("id", id).single();
}
