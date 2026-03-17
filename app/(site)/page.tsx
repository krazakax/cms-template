import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { renderTemplate } from "@/lib/templates/registry";
import { getTemplateKey } from "@/lib/templates/definition";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: page } = await supabase.from("pages").select("*, template_definitions(template_key,key)").eq("slug", "home").eq("status", "published").single();
  if (!page) notFound();
  return renderTemplate(getTemplateKey(page.template_definitions as { template_key?: string; key?: string }), page.page_content || {}, page.id, page.project_id);
}
