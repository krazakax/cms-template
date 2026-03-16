import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireAdminSession } from "@/lib/auth/session";
import { getCurrentProject } from "@/lib/auth/project";
import { getDashboardData } from "@/lib/data/cms";

export default async function AdminDashboard() {
  const session = await requireAdminSession();
  const project = getCurrentProject(session.memberships);
  if (!project) return <p>No project membership found.</p>;
  const data = await getDashboardData(project.project_id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <Card>Total pages: {data.totalPages}</Card>
        <Card>Draft pages: {data.draftPages}</Card>
        <Card>Published pages: {data.publishedPages}</Card>
      </div>
      <Card>
        <h2 className="mb-2 font-semibold">Feature Ledger Summary</h2>
        <div className="flex flex-wrap gap-2">{data.features.map((f: {id: string; status: string;}) => <Badge key={f.id}>{f.status}</Badge>)}</div>
      </Card>
      <Card>
        <h2 className="mb-2 font-semibold">Quick Links</h2>
        <div className="flex gap-3 text-sm underline"><Link href="/admin/pages">Pages</Link><Link href="/admin/media">Media</Link><Link href="/admin/features">Features</Link></div>
      </Card>
    </div>
  );
}
