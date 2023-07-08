import { Flags, SfCommand } from '@salesforce/sf-plugins-core';
import { Messages, NamedPackageDir } from '@salesforce/core';
import * as fs from 'graceful-fs';
import { getTemplatesInfo } from '../../service/templateInfo';
import { generateDocsPerPackageInParallel, getFormatExtension } from '../../service/utils';
import { loadHelpers } from '../../service/helpersModule';

/**
 * Using Metadata Registry: https://github.com/forcedotcom/source-deploy-retrieve/blob/main/HANDBOOK.md#metadata-registry
 */

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('sfdocs-sfdx-plugin', 'sfdocs.generate');

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
      default: [],
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
    this.log(messages.getMessage('info.spinner.start.init', [flags['output-dir'], flags.format]));
    this.spinner.start(messages.getMessage('info.spinner.start.preparation'));

    const [pkgs, templates, helpers] = await Promise.all([
      this.getPackageDirectories(),
      getTemplatesInfo(flags['templates-path']),
      loadHelpers(flags['helpers-path']),
      this.resetDocs(),
    ]);
    this.spinner.stop();

    this.spinner.start(messages.getMessage('info.spinner.start.processing', [flags.format]));
    await generateDocsPerPackageInParallel(
      pkgs,
      templates,
      flags['output-dir'],
      helpers,
      getFormatExtension(flags.format),
      flags['ignore-type']
    );
    this.spinner.stop();
    return {
      outputdir: flags['output-dir'],
      format: flags.format,
      packages: pkgs,
    };
  }

  private async resetDocs(): Promise<void> {
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
}
