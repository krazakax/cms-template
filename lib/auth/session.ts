import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GlobalRole, Profile, ProjectMembership, ProjectRole } from "@/types";

function deriveDefaultProjectRole(globalRole: GlobalRole | null | undefined): ProjectRole {
  if (globalRole === "super_admin" || globalRole === "internal_admin") return "internal_admin";
  if (globalRole === "client_admin") return "client_admin";
  if (globalRole === "editor") return "editor";
  return "viewer";
}

export async function getSessionContext() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: profile }, { data: memberships, error: membershipsError }] = await Promise.all([
    supabase.from("profiles").select("id, global_role, full_name, email").eq("id", user.id).single(),
    supabase.from("project_users").select("project_id, project_role").eq("user_id", user.id),
  ]);

  if (membershipsError) {
    throw new Error(`Unable to load project memberships: ${membershipsError.message}`);
  }

  const normalizedMemberships: ProjectMembership[] = (memberships ?? []).map((membership) => ({
    project_id: membership.project_id,
    project_role: membership.project_role,
  }));

  const defaultProjectId = process.env.NEXT_PUBLIC_SITE_PROJECT_ID;
  const hasDefaultMembership = defaultProjectId
    ? normalizedMemberships.some((membership) => membership.project_id === defaultProjectId)
    : true;

  if (defaultProjectId && !hasDefaultMembership && normalizedMemberships.length === 0) {
    normalizedMemberships.push({
      project_id: defaultProjectId,
      project_role: deriveDefaultProjectRole(profile?.global_role),
    });
  }

  return {
    user,
    profile: profile as Profile,
    memberships: normalizedMemberships,
  };
}

export async function requireAdminSession() {
  const session = await getSessionContext();
  if (!session) redirect("/login");
  return session;
}
