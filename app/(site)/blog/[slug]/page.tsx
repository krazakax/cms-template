import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BlogPostTemplateV1 } from "@/components/site/templates/blog-post-template-v1";

export default async function BlogSinglePage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  const [{ data: post }, { data: templatePage }] = await Promise.all([
    supabase
      .from("posts")
      .select("title,content,author_name,cover_image_url,published_at,status")
      .eq("slug", params.slug)
      .eq("status", "published")
      .maybeSingle(),
    supabase.from("pages").select("page_content").eq("slug", "blog-post").eq("status", "published").maybeSingle(),
  ]);

  if (!post) notFound();

  return <BlogPostTemplateV1 content={(templatePage?.page_content as Record<string, unknown>) ?? {}} post={post} />;
}
