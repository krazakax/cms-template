import { MARKETING_TEMPLATES } from "@/lib/templates/predefined";
import { NewPageForm } from "@/components/admin/new-page-form";
import { requireAdminSession } from "@/lib/auth/session";
import { getCurrentProject } from "@/lib/auth/project";
import { EmptyState } from "@/components/shared/empty-state";

export default async function NewPagePage() {
  const session = await requireAdminSession();
  const project = getCurrentProject(session.memberships);
  if (!project) {
    return (
      <div className="max-w-xl space-y-4">
        <h1 className="text-2xl font-bold">Create Page</h1>
        <EmptyState
          title="No active project membership"
          description="You are signed in, but no project membership was found for your account. Ask an admin to add you to a project before creating pages."
        />
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-2xl font-bold">Create Page</h1>
      <NewPageForm
        projectId={project.project_id}
        actorId={session.user.id}
        templateOptions={Object.entries(MARKETING_TEMPLATES).map(([key, value]) => ({ key, label: value.label }))}
      />
    </div>
  );
}
