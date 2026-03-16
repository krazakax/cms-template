import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireAdminSession } from "@/lib/auth/session";
import { Input } from "@/components/ui/input";

export default async function AdminPages() {
  await requireAdminSession();
  const supabase = await createClient();
  const { data: pages } = await supabase
    .from("pages")
    .select("id,title,slug,status,updated_at,template_definitions(template_key)")
    .order("updated_at", { ascending: false });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pages</h1>
        <Link href="/admin/pages/new" className="rounded bg-primary px-3 py-1 text-sm text-primary-foreground">New page</Link>
      </div>
      <Input placeholder="Search by title or slug" />
      <table className="w-full text-sm">
        <thead><tr className="border-b text-left"><th>Title</th><th>Slug</th><th>Template</th><th>Status</th><th>Updated</th><th /></tr></thead>
        <tbody>
          {pages?.map((page) => (
            <tr key={page.id} className="border-b"><td>{page.title}</td><td>{page.slug}</td><td>{(page.template_definitions as { template_key?: string })?.template_key}</td><td>{page.status}</td><td>{new Date(page.updated_at).toLocaleString()}</td><td><Link className="underline" href={`/admin/pages/${page.id}`}>Edit</Link></td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
