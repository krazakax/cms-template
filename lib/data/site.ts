import { createClient } from "@/lib/supabase/server";

export type NavItem = { label: string; href: string };

function getDefaultSettings() {
  return {
    site_title: "CMS Site",
    logo_url: null,
    footer_content: "© All rights reserved.",
    nav_menu: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Blog", href: "/blog" },
    ] as NavItem[],
  };
}

export async function getSiteSettings() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("site_title,logo_url,footer_content,nav_menu")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const defaults = getDefaultSettings();

  return {
    site_title: data?.site_title ?? defaults.site_title,
    logo_url: data?.logo_url ?? defaults.logo_url,
    footer_content: data?.footer_content ?? defaults.footer_content,
    nav_menu: (data?.nav_menu as NavItem[] | null) ?? defaults.nav_menu,
  };
}
