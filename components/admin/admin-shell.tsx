import Link from "next/link";
import { ReactNode } from "react";
import { logout } from "@/actions/auth";

const nav = [
  ["Dashboard", "/admin"],
  ["Pages", "/admin/pages"],
  ["Media", "/admin/media"],
  ["Blog", "/admin/blog"],
  ["Content Types", "/admin/content-types"],
  ["Features", "/admin/features"],
  ["Settings", "/admin/settings"],
  ["Users", "/admin/users"],
];

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-[220px_1fr]">
      <aside className="border-r bg-muted/40 p-4">
        <h2 className="mb-4 font-semibold">CMS Admin</h2>
        <nav className="space-y-1 text-sm">
          {nav.map(([label, href]) => <Link key={href} href={href} className="block rounded px-2 py-1 hover:bg-muted">{label}</Link>)}
        </nav>
        <form action={logout} className="mt-6"><button className="text-sm text-red-600">Logout</button></form>
      </aside>
      <main className="p-6">{children}</main>
    </div>
  );
}
