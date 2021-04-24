import { flags, SfdxCommand } from '@salesforce/command';
import { fs, Messages } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { parseStringPromise, processors } from 'xml2js';
import {
  ENABLED_METADATA_TYPES,
  MetadataTypeInfo,
  WorkspaceStrategy
} from '../../lib/config/metadataTypeInfos';
import { typeInfos } from '../../lib/config/metadataTypeInfosConfig';
import { Metadata } from '../../lib/metadata/Metadata';
import { jsonToMarkdown } from '../../lib/parser/markdown';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. MessagmetadataTypeInfosConfiges from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfdocs-sfdx-plugin', 'generate');
const xmlParserOptions = {
  explicitArray: false,
  explicitRoot: false,
  ignoreAttrs: true,
  valueProcessors: [processors.parseBooleans]
};

export default class Generate extends SfdxCommand {
  public static description = messages.getMessage('commandDescription');

  public static examples = [
    '$ sfdx sfdocs:generate --resultformat markdown --outputdir site'
  ];

  protected static flagsConfig = {
    outputdir: flags.filepath({
      char: 'd',
      description: messages.getMessage('outputdirFlagDescription'),
      default: 'docs'
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
    this.ux.startSpinner('Generating documentation');
    const packagedirs = this.project.getUniquePackageDirectories();
    const toReturn = {};
    for (const folder of packagedirs) {
      const contentpath = `${folder.path}/main/default`;
      for (const mtdName in typeInfos.typeDefs) {
        if ((mtdName as string) in ENABLED_METADATA_TYPES) {
          const mtd: MetadataTypeInfo = typeInfos.typeDefs[mtdName];
          toReturn[mtd.defaultDirectory] = [];
          if (fs.existsSync(`${contentpath}/${mtd.defaultDirectory}`)) {
            this.ux.log(`Reading ${mtd.nameForMsgsPlural}...`);
            const mtdDirectoryContent = await fs.readdir(
              `${contentpath}/${mtd.defaultDirectory}`,
              { withFileTypes: true }
            );
            /**
             * In SOURCE code metadata like SObjects is stored in folders per object.
             * The attribute that defines this seems to be: "workspaceStrategy": "folderPerSubtype",
             */
            for (const contentElement of mtdDirectoryContent) {
              if (
                mtd.decompositionConfig.workspaceStrategy ===
                WorkspaceStrategy.FolderPerSubtype
              ) {
                const elementpath = `${contentpath}/${mtd.defaultDirectory}/${contentElement.name}`;
                let mtdParsed: Metadata = { fullName: contentElement.name };
                if (
                  fs.fileExistsSync(
                    `${elementpath}/${contentElement.name}.${mtd.ext}-meta.xml`
                  )
                ) {
                  const content = await fs.readFile(
                    `${contentpath}/${mtd.defaultDirectory}/${contentElement.name}/${contentElement.name}.${mtd.ext}-meta.xml`,
                    { encoding: 'utf8' }
                  );

                  mtdParsed = await parseStringPromise(
                    content,
                    xmlParserOptions
                  );
                }

                if (mtd.decompositionConfig.decompositions.length > 0) {
                  /**
                   * Per descomposition we check if the folder does exists to get its content
                   */
                  for (const element of mtd.decompositionConfig
                    .decompositions) {
                    if (
                      fs.existsSync(
                        `${contentpath}/${mtd.defaultDirectory}/${contentElement.name}/${element.defaultDirectory}`
                      )
                    ) {
                      const foldercontent = await fs.readdir(
                        `${contentpath}/${mtd.defaultDirectory}/${contentElement.name}/${element.defaultDirectory}`,
                        { encoding: 'utf8' }
                      );
                      const elementsToAdd = [];
                      for (const folderElement of foldercontent) {
                        const xmlelement = await fs.readFile(
                          `${contentpath}/${mtd.defaultDirectory}/${contentElement.name}/${element.defaultDirectory}/${folderElement}`,
                          { encoding: 'utf8' }
                        );
                        const parsedelement = await parseStringPromise(
                          xmlelement,
                          xmlParserOptions
                        );
                        elementsToAdd.push(parsedelement);
                      }
                      mtdParsed[element.xmlFragmentName] = elementsToAdd;
                    }
                  }
                }

                /**
                 * store info somewhere
                 */
                await fs.mkdirp(
                  `${this.flags.outputdir}/${folder.name}/${mtd.defaultDirectory}/`
                );
                // TODO: to parse into markdown here!
                await fs.writeJson(
                  `${this.flags.outputdir}/${folder.name}/${mtd.defaultDirectory}/${contentElement.name}.json`,
                  mtdParsed
                );
                const mdparsedcontent = await jsonToMarkdown(mtdParsed);
                await fs.writeFile(
                  `${this.flags.outputdir}/${folder.name}/${mtd.defaultDirectory}/${contentElement.name}.md`,
                  mdparsedcontent
                );
                toReturn[mtd.defaultDirectory].push(mtdParsed);
              } else {
                /**
                 * when the type is not stored in subfolders
                 */
                const elementName = contentElement.name.substr(
                  0,
                  contentElement.name.indexOf('.')
                );
                const content = await fs.readFile(
                  `${contentpath}/${mtd.defaultDirectory}/${contentElement.name}`,
                  { encoding: 'utf8' }
                );
                const mtdParsed: Metadata = await parseStringPromise(
                  content,
                  xmlParserOptions
                );
                mtdParsed.fullName = elementName;
                await fs.mkdirp(
                  `${this.flags.outputdir}/${folder.name}/${mtd.defaultDirectory}/`
                );
                // TODO: to parse into markdown here!
                await fs.writeJson(
                  `${this.flags.outputdir}/${folder.name}/${mtd.defaultDirectory}/${elementName}.json`,
                  mtdParsed
                );
                const mdparsedcontent = await jsonToMarkdown(mtdParsed);
                await fs.writeFile(
                  `${this.flags.outputdir}/${folder.name}/${mtd.defaultDirectory}/${elementName}.md`,
                  mdparsedcontent
                );
                toReturn[mtd.defaultDirectory].push(mtdParsed);
              }
            }
          }
        }
      }
    }
    this.ux.stopSpinner();
    // jsonToMarkdown({});
    return toReturn;
  }
}
