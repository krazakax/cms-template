import { createClient } from "@/lib/supabase/server";

export async function logActivity(projectId: string, actorId: string, entityType: string, entityId: string, action: string, payload?: Record<string, unknown>) {
  const supabase = await createClient();
  await supabase.from("activity_logs").insert({
    project_id: projectId,
    actor_id: actorId,
    entity_type: entityType,
    entity_id: entityId,
    action,
    payload,
  });
}
