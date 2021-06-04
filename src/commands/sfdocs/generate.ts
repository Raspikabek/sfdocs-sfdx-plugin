import { flags, SfdxCommand } from '@salesforce/command';
import { fs, Messages, NamedPackageDir } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { parseStringPromise, processors } from 'xml2js';
import {
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
    }),
    packages: flags.array({
      char: 'p',
      description: messages.getMessage('packagesFlagDescription')
    }),
    ignoretypes: flags.array({
      char: 'i',
      description: messages.getMessage('ignoretypesFlagDescription')
    }),
    reset: flags.boolean({
      description: messages.getMessage('resetFlagDescription')
    })
  };

  protected static requiresProject = true;

  public async run(): Promise<AnyJson> {
    if (this.flags.reset && fs.existsSync(this.flags.outputdir)) {
      await fs.remove(this.flags.outputdir);
    }

    const toReturn = {};
    for (const namedPackageDir of await this.getProjectPackagesToProcess()) {
      const packageSourcePath = `${namedPackageDir.path}/main/default`;
      this.ux.startSpinner(`Parsing ${namedPackageDir.name}`);
      for (const typeInfoDefinition in typeInfos.typeDefs) {
        if (!typeInfos.typeDefs.hasOwnProperty(typeInfoDefinition)) {
          continue;
        }

        const mtd: MetadataTypeInfo = typeInfos.typeDefs[typeInfoDefinition];
        if (
          !fs.existsSync(`${packageSourcePath}/${mtd.defaultDirectory}`) ||
          this.flags.ignoretypes?.includes(mtd.defaultDirectory) ||
          this.flags.ignoretypes?.includes(mtd.metadataName)
        ) {
          continue;
        }

        toReturn[mtd.defaultDirectory] = [];
        for (const contentElement of fs.readdirSync(
          `${packageSourcePath}/${mtd.defaultDirectory}`,
          { withFileTypes: true }
        )) {
          /**
           * In SOURCE code metadata like SObjects is stored in folders per object.
           * The attribute that defines this seems to be: "workspaceStrategy": "folderPerSubtype",
           */
          switch (mtd.decompositionConfig.workspaceStrategy) {
            case WorkspaceStrategy.FolderPerSubtype:
              // console.log('Do something');
              break;
            case WorkspaceStrategy.InFolderMetadataType:
              // console.log('In Folder MetadataType');
              break;
            default:
            // console.log('NonDecomposed');
          }

          const elementpath = `${packageSourcePath}/${mtd.defaultDirectory}/${contentElement.name}`;
          if (
            mtd.decompositionConfig.workspaceStrategy ===
            WorkspaceStrategy.FolderPerSubtype
          ) {
            let mtdParsed: Metadata = { fullName: contentElement.name };
            if (
              fs.fileExistsSync(
                `${elementpath}/${contentElement.name}.${mtd.ext}-meta.xml`
              )
            ) {
              const content = fs.readFileSync(
                `${packageSourcePath}/${mtd.defaultDirectory}/${contentElement.name}/${contentElement.name}.${mtd.ext}-meta.xml`,
                { encoding: 'utf8' }
              );

              mtdParsed = await parseStringPromise(content, xmlParserOptions);
            }

            if (mtd.decompositionConfig.decompositions.length > 0) {
              /**
               * Per descomposition we check if the folder does exists to get its content
               */
              for (const element of mtd.decompositionConfig.decompositions) {
                if (
                  fs.existsSync(
                    `${packageSourcePath}/${mtd.defaultDirectory}/${contentElement.name}/${element.defaultDirectory}`
                  )
                ) {
                  const foldercontent = await fs.readdir(
                    `${packageSourcePath}/${mtd.defaultDirectory}/${contentElement.name}/${element.defaultDirectory}`,
                    { encoding: 'utf8' }
                  );
                  const elementsToAdd = [];
                  for (const folderElement of foldercontent) {
                    const xmlelement = await fs.readFile(
                      `${packageSourcePath}/${mtd.defaultDirectory}/${contentElement.name}/${element.defaultDirectory}/${folderElement}`,
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
              `${this.flags.outputdir}/${namedPackageDir.name}/${mtd.defaultDirectory}/`
            );
            // TODO: to parse into markdown here!
            await fs.writeJson(
              `${this.flags.outputdir}/${namedPackageDir.name}/${mtd.defaultDirectory}/${contentElement.name}.json`,
              mtdParsed
            );
            const mdparsedcontent = await jsonToMarkdown(mtdParsed);
            await fs.writeFile(
              `${this.flags.outputdir}/${namedPackageDir.name}/${mtd.defaultDirectory}/${contentElement.name}.md`,
              mdparsedcontent
            );
            toReturn[mtd.defaultDirectory].push(mtdParsed);
          } else {
            // TODO: if is directory, check for content has '*-meta.xml' file

            if (
              mtd.decompositionConfig.strategy !== 'nonDecomposed' ||
              contentElement.isDirectory() ||
              !contentElement.name.includes('-meta.xml')
            ) {
              continue;
            }
            /**
             * when the type is not stored in subfolders
             */
            const elementName = contentElement.name.substr(
              0,
              contentElement.name.indexOf('.')
            );
            const content = await fs.readFile(
              `${packageSourcePath}/${mtd.defaultDirectory}/${contentElement.name}`,
              { encoding: 'utf8' }
            );
            const mtdParsed: Metadata = await parseStringPromise(
              content,
              xmlParserOptions
            );
            mtdParsed.fullName = elementName;
            await fs.mkdirp(
              `${this.flags.outputdir}/${namedPackageDir.name}/${mtd.defaultDirectory}/`
            );
            // TODO: to parse into markdown here!
            await fs.writeJson(
              `${this.flags.outputdir}/${namedPackageDir.name}/${mtd.defaultDirectory}/${elementName}.json`,
              mtdParsed
            );
            console.log('HERE!');
            console.log(mtdParsed);
            const mdparsedcontent = await jsonToMarkdown(mtdParsed);
            await fs.writeFile(
              `${this.flags.outputdir}/${namedPackageDir.name}/${mtd.defaultDirectory}/${elementName}.md`,
              mdparsedcontent
            );
            toReturn[mtd.defaultDirectory].push(mtdParsed);
          }
        }
      }
      this.ux.stopSpinner();
    }
    this.ux.stopSpinner();
    return toReturn;
  }

  private async getProjectPackagesToProcess(): Promise<NamedPackageDir[]> {
    if (!this.flags.packages?.length) {
      return this.project.getUniquePackageDirectories();
    }

    return this.project
      .getUniquePackageDirectories()
      .filter(element => this.flags.packages.includes(element.name));
  }
}
