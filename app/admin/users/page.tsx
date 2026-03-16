import { requireAdminSession } from "@/lib/auth/session";

export default async function UsersPage() {
  const session = await requireAdminSession();
  const displayName = session.profile?.full_name || session.user.email || "Unknown user";

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Users</h1>
      <p>Current user: {displayName}</p>
      <p className="text-sm text-muted-foreground">Single-tenant mode: project membership is optional and this MVP does not expose full auth-admin management UI yet.</p>
    </div>
  );
}
