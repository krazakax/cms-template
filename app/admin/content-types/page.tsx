import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireAdminSession } from "@/lib/auth/session";

export default async function ContentTypesPage() {
  await requireAdminSession();
  const supabase = await createClient();
  const { data } = await supabase.from("content_types").select("id,key,label");

  return <div className="space-y-4"><h1 className="text-2xl font-bold">Content Types</h1><ul className="space-y-2">{data?.map((ct) => <li key={ct.id}><Link className="underline" href={`/admin/content/${ct.key}`}>{ct.label} ({ct.key})</Link></li>)}</ul></div>;
}
