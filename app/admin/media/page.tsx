import { createClient } from "@/lib/supabase/server";
import { requireAdminSession } from "@/lib/auth/session";
import { getCurrentProject } from "@/lib/auth/project";
import { Card } from "@/components/ui/card";

export default async function AdminMedia() {
  const session = await requireAdminSession();
  const project = getCurrentProject(session.memberships);
  const supabase = await createClient();
  const { data } = await supabase.from("media_assets").select("id,file_url,alt_text,metadata,created_at").eq("project_id", project?.project_id).order("created_at", { ascending: false });

  return <div className="space-y-4"><h1 className="text-2xl font-bold">Media Library</h1><Card><p className="text-sm text-muted-foreground">MVP registry mode: files are tracked in media_assets; storage upload adapter can be extended for Supabase Storage signed upload flows.</p></Card><div className="grid gap-2">{data?.map((item) => <Card key={item.id}><p className="font-medium">{item.file_url}</p><p className="text-sm">Alt: {item.alt_text ?? "—"}</p></Card>)}</div></div>;
}
