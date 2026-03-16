import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireAdminSession } from "@/lib/auth/session";
import { getCurrentProject } from "@/lib/auth/project";

export default async function BlogAdminPage() {
  const session = await requireAdminSession();
  const project = getCurrentProject(session.memberships);
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("id,title,slug,status,updated_at,published_at")
    .eq("project_id", project?.project_id)
    .order("updated_at", { ascending: false });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Link href="/admin/blog/new" className="rounded bg-primary px-3 py-1 text-sm text-primary-foreground">New post</Link>
      </div>
      <table className="w-full text-sm">
        <thead><tr className="border-b text-left"><th>Title</th><th>Slug</th><th>Status</th><th>Published</th><th /></tr></thead>
        <tbody>
          {posts?.map((post) => (
            <tr key={post.id} className="border-b">
              <td>{post.title}</td>
              <td>{post.slug}</td>
              <td>{post.status}</td>
              <td>{post.published_at ? new Date(post.published_at).toLocaleDateString() : "—"}</td>
              <td><Link className="underline" href={`/admin/blog/${post.id}`}>Edit</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
