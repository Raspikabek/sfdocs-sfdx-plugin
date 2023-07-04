import * as path from 'path';
import * as fs from 'graceful-fs';
import { NamedPackageDir } from '@salesforce/core';
import { SourceComponent, MetadataConverter } from '@salesforce/source-deploy-retrieve';
import { JsonMap } from '@salesforce/ts-types';
import * as Handlebars from 'handlebars';
import { error } from '@oclif/core/lib/errors';
import { HelperModule } from './helpersModule';
import { TemplateInfo } from './templateInfo';

const converter = new MetadataConverter();

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

export async function convertPackageComponents(
  pkg: NamedPackageDir,
  components: SourceComponent[],
  directory: string,
  templates: TemplateInfo[],
  helpers: HelperModule
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
    const r = await parseComponent(component, templates, helpers);
    return r;
  });

  await Promise.all(resultsParsePromises);
  removePackagexml(result.packagePath);
}

async function parseComponent(
  component: SourceComponent,
  templates: TemplateInfo[],
  helpers: HelperModule
): Promise<JsonMap> {
  const componentContent = await component.parseXml();
  try {
    if (Object.keys(helpers).length > 0) {
      Object.entries(helpers).forEach(([helperName, helperFn]) => {
        Handlebars.registerHelper(helperName, helperFn);
      });
    }

    const templatePath = getTemplateByNameAndType(templates, component.type.directoryName, 'md');
    const template = Handlebars.compile(
      fs.readFileSync(templatePath, {
        encoding: 'utf8',
      })
    );

    /**
     * TODO: Review what elements don't contain component.xml attribute
     */
    if (component.xml === undefined) {
      throw error;
    }
    const generatedContent = template(componentContent);
    const fileName = path.basename(component.xml, path.extname(component.xml)) + '.md';
    const fileNameJson = path.basename(component.xml, path.extname(component.xml)) + '.json';
    const directoryPath = path.dirname(component.xml);
    fs.writeFileSync(path.join(directoryPath, fileName), generatedContent, 'utf-8');
    fs.writeFileSync(path.join(directoryPath, fileNameJson), JSON.stringify(componentContent), 'utf-8');
  } catch (err) {
    // do nothing
  }
  return componentContent;
}

const removePackagexml = (dir: string): void => {
  fs.unlinkSync(path.join(dir, 'package.xml'));
};

const getTemplateByNameAndType = (templates: TemplateInfo[], name: string, type: string): string => {
  const templatePath = templates.find((t) => t.name === name && t.type === type);
  return templatePath ? templatePath.path : '';
};
