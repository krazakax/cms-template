import { MARKETING_TEMPLATES } from "@/lib/templates/predefined";
import { NewPageForm } from "@/components/admin/new-page-form";
import { requireAdminSession } from "@/lib/auth/session";

export default async function NewPagePage() {
  const session = await requireAdminSession();

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-2xl font-bold">Create Page</h1>
      <NewPageForm
        actorId={session.user.id}
        templateOptions={Object.entries(MARKETING_TEMPLATES).map(([key, value]) => ({ key, label: value.label }))}
      />
    </div>
  );
}
