import { notFound } from "next/navigation";
import { PageEditorForm } from "@/components/admin/page-editor-form";
import { requireAdminSession } from "@/lib/auth/session";
import { getCurrentProject } from "@/lib/auth/project";
import { getPageById } from "@/lib/data/cms";

export default async function PageEditor({ params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  const project = getCurrentProject(session.memberships);
  if (!project) notFound();
  const { data } = await getPageById(project.project_id, params.id);
  if (!data) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Edit Page</h1>
      <PageEditorForm
        actorId={session.user.id}
        fields={(data.template_definitions as { schema_json?: { fields: [] } })?.schema_json?.fields ?? []}
        initialValues={{
          id: data.id,
          project_id: data.project_id,
          title: data.title,
          slug: data.slug,
          status: data.status,
          page_content: data.page_content ?? {},
          seo_title: data.seo_title,
          seo_description: data.seo_description,
          og_title: data.og_title,
          og_description: data.og_description,
          og_image_url: data.og_image_url,
          canonical_url: data.canonical_url,
          noindex: data.noindex,
          published_at: data.published_at,
        }}
      />
    </div>
  );
}
