import { createClient } from "@/lib/supabase/server";
import { BlogIndexTemplateV1 } from "@/components/site/templates/blog-index-template-v1";

export default async function BlogPage() {
  const supabase = await createClient();
  const [{ data: page }, { data: posts }] = await Promise.all([
    supabase.from("pages").select("page_content").eq("slug", "blog").eq("status", "published").maybeSingle(),
    supabase
      .from("posts")
      .select("id,title,slug,excerpt,cover_image_url,published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false }),
  ]);

  return <BlogIndexTemplateV1 content={(page?.page_content as Record<string, unknown>) ?? {}} posts={posts ?? []} />;
}
