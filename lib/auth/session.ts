import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Profile, ProjectMembership } from "@/types";

export async function getSessionContext() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: profile }, { data: memberships }] = await Promise.all([
    supabase.from("profiles").select("id, global_role, full_name, email").eq("id", user.id).single(),
    supabase.from("project_users").select("project_id, project_role, projects(id,name)").eq("user_id", user.id),
  ]);

  return {
    user,
    profile: profile as Profile,
    memberships: (memberships ?? []) as ProjectMembership[],
  };
}

export async function requireAdminSession() {
  const session = await getSessionContext();
  if (!session) redirect("/auth/login");
  return session;
}
