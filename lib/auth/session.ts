import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Profile, ProjectMembership } from "@/types";

export async function getSessionContext() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("id, global_role, full_name, email").eq("id", user.id).single();

  return {
    user,
    profile: profile as Profile,
    memberships: [] as ProjectMembership[],
  };
}

export async function requireAdminSession() {
  const session = await getSessionContext();
  if (!session) redirect("/login");
  return session;
}
