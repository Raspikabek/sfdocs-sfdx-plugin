export type TemplateInfo = {
  name: string;
  path: string;
  type: string;
};

export function containsTemplateName(templates: TemplateInfo[], value: string): boolean {
  return templates.some((template) => template.name === value);
}
