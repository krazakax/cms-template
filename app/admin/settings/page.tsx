import { requireAdminSession } from "@/lib/auth/session";
import { getCurrentProject } from "@/lib/auth/project";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const session = await requireAdminSession();
  const projectMembership = getCurrentProject(session.memberships);
  const supabase = await createClient();
  const { data: project } = await supabase.from("projects").select("id,name,slug,created_at").eq("id", projectMembership?.project_id).single();

  return <div className="space-y-2"><h1 className="text-2xl font-bold">Project Settings</h1><p>Name: {project?.name}</p><p>Slug: {project?.slug}</p><p>Created: {project?.created_at ? new Date(project.created_at).toLocaleString() : "—"}</p></div>;
}
