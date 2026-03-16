import { notFound } from "next/navigation";
import { PostEditorForm } from "@/components/admin/post-editor-form";
import { requireAdminSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  const supabase = await createClient();

  const [{ data: post }, { data: media }] = await Promise.all([
    supabase.from("posts").select("*").eq("id", params.id).maybeSingle(),
    supabase.from("media_assets").select("id,file_url,alt_text"),
  ]);

  if (!post) notFound();

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Edit Blog Post</h1>
      <PostEditorForm actorId={session.user.id} mediaOptions={media ?? []} initialValues={post} />
    </div>
  );
}
