import Link from "next/link";
import { ReactNode } from "react";
import { getSiteSettings } from "@/lib/data/site";
import { getBrandTokens } from "@/lib/data/brand";
import { getSessionContext } from "@/lib/auth/session";
import { EditorProvider } from "@/components/site/inline-editor/editor-context";
import { InlineToolbar } from "@/components/site/inline-editor/inline-toolbar";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const projectId = process.env.NEXT_PUBLIC_SITE_PROJECT_ID;
  const [settings, tokens, session] = await Promise.all([
    getSiteSettings(projectId),
    getBrandTokens(projectId),
    getSessionContext(),
  ]);

  const isEditing = Boolean(session);

  return (
    <EditorProvider isEditing={isEditing} actorId={session?.user.id ?? null}>
      <style>{`
        :root {
          --brand-primary: ${tokens.primary_color};
          --brand-secondary: ${tokens.secondary_color};
          --brand-accent: ${tokens.accent_color};
          --brand-bg: ${tokens.background_color};
          --brand-text: ${tokens.text_color};
          --brand-font: ${tokens.font_family};
        }
      `}</style>
      <div className="min-h-screen" style={{ background: "var(--brand-bg)", color: "var(--brand-text)", fontFamily: "var(--brand-font)" }}>
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
        <InlineToolbar />
      </div>
    </EditorProvider>
  );
}
