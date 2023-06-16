import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('sfdocs-sfdx-plugin', 'sfdocs.generate');

export type DocsGenerateResult = {
  outputdir: string;
};

export default class Generate extends SfCommand<DocsGenerateResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public static readonly flags = {
    outputdir: Flags.directory({
      char: 'd',
      summary: messages.getMessage('flags.outputdir.summary'),
      description: messages.getMessage('flags.outputdir.description'),
      default: 'docs',
    }),
    format: Flags.string({
      char: 'r',
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
    ignoretype: Flags.string({
      char: 'i',
      summary: messages.getMessage('flags.ignoretype.summary'),
      description: messages.getMessage('flags.ignoretype.description'),
      multiple: true,
    }),
    reset: Flags.boolean({
      summary: messages.getMessage('flags.reset.summary'),
    }),
  };

  public async run(): Promise<DocsGenerateResult> {
    const { flags } = await this.parse(Generate);
    this.log(messages.getMessage('info.generate', [flags.outputdir, flags.format]));
    return {
      outputdir: flags.outputdir,
    };
  }
}
