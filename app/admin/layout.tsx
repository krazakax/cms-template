import { ReactNode } from "react";
import { requireAdminSession } from "@/lib/auth/session";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdminSession();
  return <AdminShell>{children}</AdminShell>;
}
