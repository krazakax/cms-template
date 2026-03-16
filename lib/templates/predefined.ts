import { TemplateField } from "@/types";

export const MARKETING_TEMPLATES: Record<string, { label: string; fields: TemplateField[] }> = {
  home_v1: {
    label: "Homepage",
    fields: [
      { key: "hero_title", label: "Hero title", type: "text" },
      { key: "hero_subtitle", label: "Hero subtitle", type: "textarea" },
      { key: "hero_image", label: "Hero image", type: "image" },
      { key: "cta_title", label: "CTA title", type: "text" },
      { key: "cta_label", label: "CTA button label", type: "text" },
      { key: "cta_href", label: "CTA button URL", type: "url" },
    ],
  },
  about_v1: {
    label: "About Us",
    fields: [
      { key: "title", label: "Header title", type: "text" },
      { key: "subtitle", label: "Header subtitle", type: "textarea" },
      { key: "body", label: "Body", type: "textarea" },
      { key: "team_image", label: "Team image", type: "image" },
      { key: "logos_csv", label: "Partner logos (comma separated URLs)", type: "textarea" },
    ],
  },
  contact_v1: {
    label: "Contact Us",
    fields: [
      { key: "title", label: "Header title", type: "text" },
      { key: "subtitle", label: "Header subtitle", type: "textarea" },
      { key: "email", label: "Contact email", type: "text" },
      { key: "phone", label: "Contact phone", type: "text" },
      { key: "map_embed_url", label: "Map embed URL", type: "url" },
    ],
  },
  faq_v1: {
    label: "FAQ",
    fields: [
      { key: "title", label: "Header title", type: "text" },
      { key: "subtitle", label: "Header subtitle", type: "textarea" },
      { key: "faq_json", label: "FAQ items JSON [{\"question\":\"...\",\"answer\":\"...\"}]", type: "textarea" },
    ],
  },
  blog_index_v1: {
    label: "Blog Index",
    fields: [
      { key: "title", label: "Page title", type: "text" },
      { key: "subtitle", label: "Page subtitle", type: "textarea" },
      { key: "hero_image", label: "Hero image", type: "image" },
    ],
  },
  blog_post_v1: {
    label: "Blog Single",
    fields: [
      { key: "show_author", label: "Show author", type: "boolean" },
      { key: "show_cover", label: "Show cover image", type: "boolean" },
      { key: "show_related", label: "Show related posts", type: "boolean" },
    ],
  },
};

export function getTemplateSchema(templateKey: string) {
  return { fields: MARKETING_TEMPLATES[templateKey]?.fields ?? [] };
}
