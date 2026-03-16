import { PostEditorForm } from "@/components/admin/post-editor-form";
import { requireAdminSession } from "@/lib/auth/session";
import { getCurrentProject } from "@/lib/auth/project";
import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/shared/empty-state";

export default async function NewBlogPostPage() {
  const session = await requireAdminSession();
  const project = getCurrentProject(session.memberships);
  if (!project) {
    return (
      <div className="max-w-2xl space-y-4">
        <h1 className="text-2xl font-bold">Create Blog Post</h1>
        <EmptyState
          title="No active project membership"
          description="You are signed in, but no project membership was found for your account. Ask an admin to add you to a project before creating blog posts."
        />
      </div>
    );
  }

  const supabase = await createClient();
  const { data: media } = await supabase.from("media_assets").select("id,file_url,alt_text").eq("project_id", project.project_id);

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Create Blog Post</h1>
      <PostEditorForm
        actorId={session.user.id}
        mediaOptions={media ?? []}
        initialValues={{
          project_id: project.project_id,
          title: "",
          slug: "",
          excerpt: null,
          content: "",
          cover_image_url: null,
          author_name: null,
          status: "draft",
          published_at: null,
        }}
      />
    </div>
  );
}
