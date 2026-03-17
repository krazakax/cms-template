type TemplateDefinitionLike = {
  template_key?: string | null;
  key?: string | null;
};

export function getTemplateKey(definition: TemplateDefinitionLike | null | undefined): string {
  return definition?.template_key ?? definition?.key ?? "home_v1";
}
