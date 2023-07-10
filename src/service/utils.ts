import * as path from 'path';
import * as fs from 'graceful-fs';
import { NamedPackageDir } from '@salesforce/core';
import { SourceComponent, MetadataConverter, MetadataResolver } from '@salesforce/source-deploy-retrieve';
import * as Handlebars from 'handlebars';
import { error } from '@oclif/core/lib/errors';
import { HelperModule } from './helpersModule';
import { TemplateInfo } from './templateInfo';

const converter = new MetadataConverter();

export async function generateDocsPerPackageInParallel(
  packages: NamedPackageDir[],
  templates: TemplateInfo[],
  outputDirectory: string,
  helpers: HelperModule,
  format: string,
  ignoredTypes: string[]
): Promise<void> {
  const resolver = new MetadataResolver();

  const generatorPromises = packages.map(async (pkg) => {
    const pkgFolders = await getPackageFolders(pkg.path);
    // this.log(`Package ${pkg.name} content: `, pkgFolders);

    const components = resolver.getComponentsFromPath(pkg.path);
    const filteredComponentsByTemplates = filterSourceComponentWithTemplateInfo(components, templates);
    const filteredComponents = filterSourceComponentsByTypes(filteredComponentsByTemplates, ignoredTypes);
    await convertPackageComponents(pkg, filteredComponents, outputDirectory, templates, helpers, format);
    return pkgFolders;
  });

  await Promise.all(generatorPromises);
  // return null;
}

export const getFormatExtension = (format: string): string => {
  switch (format) {
    case 'markdown':
      return 'md';
      break;
    default:
      return 'json';
      break;
  }
};

export async function getPackageFolders(pkgPath: string): Promise<string[]> {
  const pkgFolders = await fs.promises.readdir(path.join(pkgPath, 'main', 'default'));
  return pkgFolders;
}

export function filterStringsWithTemplateInfo(strings: string[], templateInfos: TemplateInfo[]): string[] {
  return strings.filter((s) => templateInfos.some((t) => t.name === s));
}

export function filterSourceComponentWithTemplateInfo(
  components: SourceComponent[],
  templateInfos: TemplateInfo[]
): SourceComponent[] {
  return components.filter((c) => templateInfos.some((t) => t.name === c.type.directoryName));
}

export const filterSourceComponentsByTypes = (components: SourceComponent[], mtdTypes: string[]): SourceComponent[] => {
  const result = components.filter((c) => !mtdTypes.includes(c.type.name) && !mtdTypes.includes(c.type.directoryName));
  return result;
};

export async function convertPackageComponents(
  pkg: NamedPackageDir,
  components: SourceComponent[],
  directory: string,
  templates: TemplateInfo[],
  helpers: HelperModule,
  format: string
): Promise<void> {
  const result = await converter.convert(components, 'metadata', {
    type: 'directory',
    outputDirectory: directory,
    packageName: pkg.name,
  });
  if (result.converted === undefined || result.packagePath === undefined) {
    return;
  }
  const resultsParsePromises = result.converted.map(async (component) => {
    const parsedContent = await parseComponent(component, templates, helpers, format);
    writeContent(parsedContent, component, format);
    deleteFile(component.xml);

    return parsedContent;
  });

  await Promise.all(resultsParsePromises);
  removePackagexml(result.packagePath);
}

async function parseComponent(
  component: SourceComponent,
  templates: TemplateInfo[],
  helpers: HelperModule,
  format: string
): Promise<string> {
  const componentContent = await component.parseXml();

  if (format === 'json') {
    return JSON.stringify(componentContent, null, 2);
  }

  if (Object.keys(helpers).length > 0) {
    Object.entries(helpers).forEach(([helperName, helperFn]) => {
      Handlebars.registerHelper(helperName, helperFn);
    });
  }

  const templatePath = getTemplateByNameAndType(templates, component.type.directoryName, format);
  const template = Handlebars.compile(
    fs.readFileSync(templatePath, {
      encoding: 'utf8',
    })
  );
  const parsedContent = template(componentContent);
  return parsedContent;
}

const writeContent = (content: string, component: SourceComponent, extension: string): void => {
  /**
   * TODO: Review what elements don't contain component.xml attribute
   */
  if (component.xml === undefined) {
    throw error;
  }
  const fileName = path.basename(component.xml, path.extname(component.xml)) + '.' + extension;
  const directoryPath = path.dirname(component.xml);
  fs.writeFileSync(path.join(directoryPath, fileName), content, 'utf-8');
};

const deleteFile = (filepath: string | undefined): void => {
  if (filepath !== undefined) {
    fs.unlinkSync(path.resolve(filepath));
  }
};

const removePackagexml = (dir: string): void => {
  fs.unlinkSync(path.join(dir, 'package.xml'));
};

const getTemplateByNameAndType = (templates: TemplateInfo[], name: string, type: string): string => {
  const templatePath = templates.find((t) => t.name === name && t.type === type);
  return templatePath ? templatePath.path : '';
};
