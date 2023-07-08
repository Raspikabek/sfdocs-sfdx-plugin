import * as path from 'path';
import * as fs from 'graceful-fs';

export type TemplateInfo = {
  name: string;
  path: string;
  type: string;
};

export function containsTemplateName(templates: TemplateInfo[], value: string): boolean {
  return templates.some((template) => template.name === value);
}

export async function getTemplatesInfo(templatesPath: string | undefined): Promise<TemplateInfo[]> {
  const templatesDir = templatesPath !== undefined ? templatesPath : getDefaultTemplatesPath();
  const fileNames = await fs.promises.readdir(templatesDir, {});
  return getTemplateInfos(fileNames, templatesDir);
}

function getDefaultTemplatesPath(): string {
  return path.resolve(__dirname, '..', 'templates');
}

function getTemplateInfos(paths: string[], directory: string): TemplateInfo[] {
  const templates: TemplateInfo[] = [];
  for (const template of paths) {
    const fileNameWithExtension = path.basename(template);
    templates.push({
      name: fileNameWithExtension.slice(0, fileNameWithExtension.lastIndexOf('.')),
      path: path.join(directory, template),
      type: path.extname(template).slice(1),
    });
  }
  return templates;
}
