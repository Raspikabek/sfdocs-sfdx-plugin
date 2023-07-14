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

export async function getTemplatesInfo(templatesPath: string | undefined, extension: string): Promise<TemplateInfo[]> {
  if (extension === 'json') {
    return [];
  }
  const templatesDir = templatesPath !== undefined ? templatesPath : getDefaultTemplatesPath();
  const fileNames = await fs.promises.readdir(templatesDir, {});
  const filteredFileNames = fileNames.filter(filterByExtension(extension));
  return getTemplateInfos(filteredFileNames, templatesDir);
}

function filterByExtension(extension: string): (fileName: string) => boolean {
  return (fileName: string) => path.extname(fileName).slice(1) === extension;
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
