import * as path from 'path';
import { Flags, SfCommand } from '@salesforce/sf-plugins-core';
import { Messages, NamedPackageDir } from '@salesforce/core';
import { MetadataResolver } from '@salesforce/source-deploy-retrieve';
import * as fs from 'graceful-fs';
import { TemplateInfo } from '../../service/templateInfo';
import {
  filterSourceComponentWithTemplateInfo,
  getPackageFolders,
  convertPackageComponents,
} from '../../service/utils';
import { HelperModule } from '../../service/helpersModule';
import * as defaultHelpers from '../../helpers/default';

/**
 * Using Metadata Registry: https://github.com/forcedotcom/source-deploy-retrieve/blob/main/HANDBOOK.md#metadata-registry
 */

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('sfdocs-sfdx-plugin', 'sfdocs.generate');
const resolver = new MetadataResolver();

export type DocsGenerateResult = {
  outputdir: string;
  format: string;
  packages: NamedPackageDir[];
};

export default class Generate extends SfCommand<DocsGenerateResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');
  public static readonly requiresProject = true;
  public static readonly enableJsonFlag = true;

  public static readonly flags = {
    'output-dir': Flags.directory({
      char: 'd',
      summary: messages.getMessage('flags.outputdir.summary'),
      description: messages.getMessage('flags.outputdir.description'),
      default: 'docs',
    }),
    format: Flags.string({
      char: 'f',
      summary: messages.getMessage('flags.format.summary'),
      options: ['json', 'markdown'],
      default: 'json',
    }),
    package: Flags.string({
      char: 'p',
      summary: messages.getMessage('flags.package.summary'),
      description: messages.getMessage('flags.package.description'),
      multiple: true,
    }),
    'ignore-type': Flags.string({
      char: 'i',
      summary: messages.getMessage('flags.ignoretype.summary'),
      description: messages.getMessage('flags.ignoretype.description'),
      multiple: true,
    }),
    reset: Flags.boolean({
      summary: messages.getMessage('flags.reset.summary'),
    }),
    'templates-path': Flags.directory({
      summary: messages.getMessage('flags.templatespath.summary'),
    }),
    'helpers-path': Flags.string({
      summary: messages.getMessage('flags.helperspath.summary'),
    }),
  };

  public async run(): Promise<DocsGenerateResult> {
    const { flags } = await this.parse(Generate);

    // TODO: following methods as promise all?
    await this.removeFolderIfExists();
    const pkgs = await this.getPackageDirectories();
    const templates = await this.getTemplatesInfo();
    let handlebarHelpersPath = '';
    let helpers: HelperModule = defaultHelpers.default as HelperModule;
    if (flags['helpers-path']) {
      handlebarHelpersPath = path.resolve(flags['helpers-path']);
      // TODO: find a way to import dynamically better with no lint errors & from JS file and not TS?
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const customHelpersModule = await import(handlebarHelpersPath);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const newHelpers: HelperModule = customHelpersModule.default as HelperModule;
      helpers = {
        ...helpers,
        ...newHelpers,
      };
    }

    await this.generateDocsPerPackageInParallel(pkgs, templates, flags['output-dir'], helpers);
    this.log(messages.getMessage('info.generate', [flags['output-dir'], flags.format]));
    return {
      outputdir: flags['output-dir'],
      format: flags.format,
      packages: pkgs,
    };
  }

  private async removeFolderIfExists(): Promise<void> {
    const { flags } = await this.parse(Generate);
    if (flags.reset && fs.existsSync(flags['output-dir'])) {
      fs.rmSync(flags['output-dir'], { recursive: true });
    }
  }

  private async getPackageDirectories(): Promise<NamedPackageDir[]> {
    const { flags } = await this.parse(Generate);
    const packages = flags.package;

    if (packages === undefined || !packages.length) {
      return this.project.getUniquePackageDirectories();
    }

    return this.project.getUniquePackageDirectories().filter((element) => packages.includes(element.name));
  }

  private async getTemplatesInfo(): Promise<TemplateInfo[]> {
    const { flags } = await this.parse(Generate);
    const templatesPath =
      flags['templates-path'] != null ? flags['templates-path'] : path.resolve(__dirname, '..', '..', 'templates');
    const paths = await fs.promises.readdir(templatesPath, {});
    const templates: TemplateInfo[] = [];
    for (const template of paths) {
      const fileNameWithExtension = path.basename(template);
      templates.push({
        name: fileNameWithExtension.slice(0, fileNameWithExtension.lastIndexOf('.')),
        path: path.join(templatesPath, template),
        type: path.extname(template).slice(1),
      });
    }
    return templates;
  }

  private async generateDocsPerPackageInParallel(
    packages: NamedPackageDir[],
    templates: TemplateInfo[],
    outputDirectory: string,
    helpers: HelperModule
  ): Promise<void> {
    const generatorPromises = packages.map(async (pkg) => {
      const pkgFolders = await getPackageFolders(pkg.path);
      this.log(`Package ${pkg.name} content: `, pkgFolders);

      const components = resolver.getComponentsFromPath(pkg.path);
      const filteredComponents = filterSourceComponentWithTemplateInfo(components, templates);
      await convertPackageComponents(pkg, filteredComponents, outputDirectory, templates, helpers);
      return pkgFolders;
    });

    await Promise.all(generatorPromises);
    // return null;
  }
}
