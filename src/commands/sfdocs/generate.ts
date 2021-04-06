import { flags, SfdxCommand } from '@salesforce/command';
import { fs, Messages } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfdocs-sfdx-plugin', 'generate');

export default class Org extends SfdxCommand {
  public static description = messages.getMessage('commandDescription');

  public static examples = [
    '$ sfdx sfdocs:generate --resultformat markdown --outputdir site'
  ];

  protected static flagsConfig = {
    outputdir: flags.filepath({
      char: 'd',
      description: messages.getMessage('outputdirFlagDescription'),
      default: 'sfdocs'
    }),
    resultformat: flags.enum({
      char: 'r',
      description: messages.getMessage('resultformatFlagDescription'),
      options: ['markdown', 'json'],
      default: 'markdown'
    })
  };

  protected static requiresProject = true;

  public async run(): Promise<AnyJson> {
    const packagedirs = this.project.getUniquePackageDirectories();
    for (const folder of packagedirs) {
      const contentpath = `${folder.path}/main/default/`;
      const packageFolders = await fs.readdir(contentpath);
      for (const f of packageFolders) {
        this.ux.log(`Folder name: ${f}`);
      }
    }
    this.ux.log('HELLO WORLD!');
    return { message: 'Hello world' };
  }
}
