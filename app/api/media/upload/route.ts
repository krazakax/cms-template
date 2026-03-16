import { createClient } from "@supabase/supabase-js";
import { getSessionContext } from "@/lib/auth/session";

export async function POST(req: Request) {
  const session = await getSessionContext();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const form = await req.formData();
  const file = form.get("file") as File | null;
  const projectId = String(form.get("project_id") || "");

  if (!file || !projectId) {
    return Response.json({ error: "file and project_id are required" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const path = `${projectId}/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from("media").upload(path, file);
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const {
    data: { publicUrl },
  } = supabase.storage.from("media").getPublicUrl(path);

  return Response.json({ url: publicUrl });
}
