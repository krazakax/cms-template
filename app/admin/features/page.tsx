import { createClient } from "@/lib/supabase/server";
import { requireAdminSession } from "@/lib/auth/session";
import { Badge } from "@/components/ui/badge";

export default async function FeaturesPage() {
  await requireAdminSession();
  const supabase = await createClient();
  const { data } = await supabase.from("feature_ledger").select("id,title,category,status,client_visible,description,notes");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Feature Ledger</h1>
      <table className="w-full text-sm"><thead><tr className="border-b text-left"><th>Title</th><th>Category</th><th>Status</th><th>Client Visible</th><th>Description</th></tr></thead><tbody>{data?.map((f) => <tr key={f.id} className="border-b"><td>{f.title}</td><td>{f.category}</td><td><Badge>{f.status}</Badge></td><td>{f.client_visible ? "Yes" : "No"}</td><td>{f.description}</td></tr>)}</tbody></table>
    </div>
  );
}
