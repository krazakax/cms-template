export type GlobalRole = "super_admin" | "internal_admin" | "client_admin" | "editor" | "viewer";
export type ProjectRole = "client_admin" | "internal_admin" | "editor" | "viewer";

export type TemplateField = {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "boolean" | "image" | "url" | "object" | "repeater";
  fields?: TemplateField[];
};

export type TemplateDefinition = {
  id: string;
  project_id: string;
  template_key: string;
  schema_json: { fields: TemplateField[] };
};

export type Page = {
  id: string;
  project_id: string;
  template_definition_id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  page_content: Record<string, unknown>;
  seo_title: string | null;
  seo_description: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
  noindex: boolean;
  published_at: string | null;
  updated_at: string;
};

export type FeatureStatus = "included" | "in_progress" | "planned" | "proposed" | "backlog" | "not_included";

export type Profile = { id: string; global_role: GlobalRole; full_name: string | null; email: string | null };
export type ProjectMembership = { project_id: string; project_role: ProjectRole; projects?: { id: string; name: string } };
