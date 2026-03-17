import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { renderTemplate } from "@/lib/templates/registry";
import { getTemplateKey } from "@/lib/templates/definition";

export default async function HomePage() {
  const supabase = await createClient();
  const projectId = process.env.NEXT_PUBLIC_SITE_PROJECT_ID;
  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("project_id", projectId)
    .eq("slug", "home")
    .eq("status", "published")
    .single();
  if (!page) notFound();

  const { data: templateDefinition } = await supabase
    .from("template_definitions")
    .select("*")
    .eq("id", page.template_definition_id)
    .maybeSingle();

  return renderTemplate(getTemplateKey(templateDefinition as { template_key?: string; key?: string }), page.page_content || {}, page.id, page.project_id);
}
