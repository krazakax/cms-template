import { createClient } from "@/lib/supabase/server";

export type NavItem = { label: string; href: string };

export async function getSiteSettings() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("site_title,logo_url,footer_content,nav_menu")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    site_title: data?.site_title ?? "CMS Site",
    logo_url: data?.logo_url ?? null,
    footer_content: data?.footer_content ?? "© All rights reserved.",
    nav_menu: (data?.nav_menu as NavItem[] | null) ?? [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Blog", href: "/blog" },
    ],
  };
}
