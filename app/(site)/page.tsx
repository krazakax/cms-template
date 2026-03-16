import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { renderTemplate } from "@/lib/templates/registry";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: page } = await supabase.from("pages").select("*, template_definitions(template_key)").eq("slug", "home").eq("status", "published").single();
  if (!page) notFound();
  return renderTemplate((page.template_definitions as { template_key: string }).template_key, page.page_content || {}, page.id, page.project_id);
}
