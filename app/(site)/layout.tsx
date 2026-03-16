import Link from "next/link";
import { ReactNode } from "react";
import { getSiteSettings } from "@/lib/data/site";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings(process.env.NEXT_PUBLIC_SITE_PROJECT_ID);

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            {settings.logo_url ? <img src={settings.logo_url} alt={settings.site_title} className="h-8 w-8 rounded" /> : null}
            {settings.site_title}
          </Link>
          <nav className="flex gap-4 text-sm">
            {settings.nav_menu.map((item) => (
              <Link key={item.href} href={item.href} className="hover:underline">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      {children}
      <footer className="mt-12 border-t">
        <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-muted-foreground">{settings.footer_content}</div>
      </footer>
    </div>
  );
}
