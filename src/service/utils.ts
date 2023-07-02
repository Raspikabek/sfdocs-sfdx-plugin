import * as path from 'path';
import * as fs from 'graceful-fs';
import { NamedPackageDir } from '@salesforce/core';
import { SourceComponent } from '@salesforce/source-deploy-retrieve';
import { TemplateInfo } from './templateInfo';

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

// export async function parsePackageFolders(pkg: NamedPackageDir, pkgFolders: string[]): Promise<void> {
//   const parsePromises = getFoldersPath(pkg.path, pkgFolders).map(async (folderPath) => {
//     await parsePackageFolder(folderPath);
//   });

//   await Promise.all(parsePromises);
//   return null;
// }

export async function parsePackageComponents(pkg: NamedPackageDir, components: SourceComponent[]): Promise<void> {
  const componentParsePromises = components.map(async (component) => {
    await parseComponent(pkg, component);
  });

  await Promise.all(componentParsePromises);
  return null;
}

async function parseComponent(pkg: NamedPackageDir, component: SourceComponent): Promise<void> {
  /**
   * TODO: Here is where we have to start reviewing folder types, strategies etc to parse JSON accordingly
   */
  console.log(pkg.name);
  console.log(component.name);
}

// async function parsePackageFolder(folderPath: string): Promise<void> {
//   console.log(folderPath);
// }

// function getFoldersPath(pkgPath: string, folders: string[]): string[] {
//   const foldersWithPath: string[] = [];
//   for (const folder of folders) {
//     foldersWithPath.push(path.join(pkgPath, 'main', 'default', folder));
//   }
//   return foldersWithPath;
// }
