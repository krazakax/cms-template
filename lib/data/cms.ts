import { createClient } from "@/lib/supabase/server";

export async function getDashboardData(projectId?: string) {
  const supabase = await createClient();
  const pagesQuery = supabase.from("pages").select("id,status");
  const activityQuery = supabase.from("activity_logs").select("id,action,entity_type,created_at").order("created_at", { ascending: false }).limit(10);
  const featuresQuery = supabase.from("feature_ledger").select("id,status");

  const [pages, activity, features] = await Promise.all([
    projectId ? pagesQuery.eq("project_id", projectId) : pagesQuery,
    projectId ? activityQuery.eq("project_id", projectId) : activityQuery,
    projectId ? featuresQuery.eq("project_id", projectId) : featuresQuery,
  ]);

  const totalPages = pages.data?.length ?? 0;
  const draftPages = pages.data?.filter((p) => p.status === "draft").length ?? 0;
  const publishedPages = pages.data?.filter((p) => p.status === "published").length ?? 0;

  return { totalPages, draftPages, publishedPages, recentActivity: activity.data ?? [], features: features.data ?? [] };
}

export async function getPageBySlug(projectId: string | undefined, slug: string) {
  const supabase = await createClient();
  const query = supabase.from("pages").select("*, template_definitions(*)").eq("slug", slug);
  return projectId ? query.eq("project_id", projectId).single() : query.single();
}

export async function getPageById(projectId: string | undefined, id: string) {
  const supabase = await createClient();
  const query = supabase.from("pages").select("*, template_definitions(*)").eq("id", id);
  return projectId ? query.eq("project_id", projectId).single() : query.single();
}
