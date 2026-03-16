import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdminSession } from "@/lib/auth/session";
import { getCurrentProject } from "@/lib/auth/project";
import { Card } from "@/components/ui/card";

export default async function ContentTypeEntriesPage({ params }: { params: { contentTypeKey: string } }) {
  const session = await requireAdminSession();
  const project = getCurrentProject(session.memberships);
  const supabase = await createClient();

  const { data: type } = await supabase.from("content_types").select("id,key,label,schema_json").eq("project_id", project?.project_id).eq("key", params.contentTypeKey).single();
  if (!type) notFound();

  const { data: entries } = await supabase.from("content_entries").select("id,title,status,updated_at,content_json").eq("project_id", project?.project_id).eq("content_type_id", type.id).order("updated_at", { ascending: false });

  return <div className="space-y-4"><h1 className="text-2xl font-bold">{type.label}</h1><Card><p className="text-sm">Structured editor foundation uses the same schema renderer pattern as pages. Future richer entry editor can be added without freeform layout tools.</p></Card><table className="w-full text-sm"><thead><tr className="border-b text-left"><th>Title</th><th>Status</th><th>Updated</th></tr></thead><tbody>{entries?.map((e) => <tr key={e.id} className="border-b"><td>{e.title}</td><td>{e.status}</td><td>{new Date(e.updated_at).toLocaleString()}</td></tr>)}</tbody></table></div>;
}
