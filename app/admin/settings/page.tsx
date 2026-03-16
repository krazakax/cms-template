import { requireAdminSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";

export default async function SettingsPage() {
  const session = await requireAdminSession();
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("id,site_title,logo_url,footer_content,nav_menu")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Site Settings</h1>
      <SiteSettingsForm
        actorId={session.user.id}
        initialValues={{
          id: settings?.id,
          site_title: settings?.site_title ?? "",
          logo_url: settings?.logo_url,
          footer_content: settings?.footer_content,
          nav_menu: JSON.stringify(
            settings?.nav_menu ?? [
              { label: "Home", href: "/" },
              { label: "About", href: "/about" },
              { label: "Contact", href: "/contact" },
              { label: "FAQ", href: "/faq" },
              { label: "Blog", href: "/blog" },
            ],
            null,
            2,
          ),
        }}
      />
    </div>
  );
}
