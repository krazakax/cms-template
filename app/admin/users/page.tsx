import { requireAdminSession } from "@/lib/auth/session";

export default async function UsersPage() {
  const session = await requireAdminSession();
  const displayName = session.profile?.full_name || session.user.email || "Unknown user";

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Users</h1>
      <p>Current user: {displayName}</p>
      <h2 className="font-semibold">Project Memberships</h2>
      <ul className="list-disc pl-5 text-sm">{session.memberships.map((m) => <li key={m.project_id}>{m.projects?.name ?? m.project_id} — {m.project_role}</li>)}</ul>
      <p className="text-sm text-muted-foreground">This MVP does not expose full auth-admin user management UI yet; expand using service-role server actions with strict policy checks.</p>
    </div>
  );
}
