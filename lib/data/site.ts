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

export async function getSiteSettings(projectId: string | null | undefined) {
  if (!projectId) return getDefaultSettings();

  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("site_title,logo_url,footer_content,nav_menu")
    .eq("project_id", projectId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    site_title: data?.site_title ?? getDefaultSettings().site_title,
    logo_url: data?.logo_url ?? getDefaultSettings().logo_url,
    footer_content: data?.footer_content ?? getDefaultSettings().footer_content,
    nav_menu: (data?.nav_menu as NavItem[] | null) ?? getDefaultSettings().nav_menu,
  };
}
