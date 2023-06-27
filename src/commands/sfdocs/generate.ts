import * as path from 'path';
import { Flags, SfCommand } from '@salesforce/sf-plugins-core';
import { Messages, NamedPackageDir } from '@salesforce/core';
import * as fs from 'graceful-fs';
import { parseStringPromise, processors } from 'xml2js';
import * as Handlebars from 'handlebars';
import { MetadataTypeInfo, WorkspaceStrategy } from '../../lib/config/metadataTypeInfos';
import { typeInfos } from '../../lib/config/metadataTypeInfosConfig';
import { Metadata } from '../../lib/metadata/Metadata';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('sfdocs-sfdx-plugin', 'sfdocs.generate');

export type DocsGenerateResult = {
  outputdir: string;
  format: string;
  packages: NamedPackageDir[];
};

const xmlParserOptions = {
  explicitArray: false,
  explicitRoot: false,
  ignoreAttrs: true,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  valueProcessors: [processors.parseBooleans],
};

export default class Generate extends SfCommand<DocsGenerateResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');
  public static readonly requiresProject = true;

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
  };

  public async run(): Promise<DocsGenerateResult> {
    const { flags } = await this.parse(Generate);

    if (flags.reset && fs.existsSync(flags['output-dir'])) {
      fs.rmSync(flags['output-dir'], { recursive: true });
    }

    const pkgs = await this.getProjectPackages();
    await this.generateDocs(pkgs);

    this.log(messages.getMessage('info.generate', [flags['output-dir'], flags.format]));
    return {
      outputdir: flags['output-dir'],
      format: flags.format,
      packages: pkgs,
    };
  }

  private async getProjectPackages(): Promise<NamedPackageDir[]> {
    const { flags } = await this.parse(Generate);

    if (!flags.package?.length) {
      return this.project.getUniquePackageDirectories();
    }

    return this.project.getUniquePackageDirectories().filter((element) => flags.package.includes(element.name));
  }

  private async generateDocs(pkgs: NamedPackageDir[]): Promise<void> {
    const { flags } = await this.parse(Generate);

    for (const namedPackageDir of pkgs) {
      const packagePath = `${namedPackageDir.path}/main/default`;
      this.spinner.start(`Parsing ${namedPackageDir.name}`);

      for (const typeInfoDefinition in typeInfos.typeDefs) {
        // this is just a guard-in for the for loop to avoid eslint complains... to find alterantive
        if (!Object.prototype.hasOwnProperty.call(typeInfos.typeDefs, typeInfoDefinition)) {
          continue;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const mtd: MetadataTypeInfo = typeInfos.typeDefs[typeInfoDefinition];
        if (
          !fs.existsSync(`${packagePath}/${mtd.defaultDirectory}`) ||
          flags['ignore-type']?.includes(mtd.defaultDirectory) ||
          flags['ignore-type']?.includes(mtd.metadataName)
        ) {
          continue;
        }

        for (const contentElement of fs.readdirSync(`${packagePath}/${mtd.defaultDirectory}`, {
          withFileTypes: true,
        })) {
          /**
           * In SOURCE code metadata like SObjects is stored in folders per object.
           * The attribute that defines this seems to be: "workspaceStrategy": "folderPerSubtype",
           */
          switch (mtd.decompositionConfig.workspaceStrategy) {
            case WorkspaceStrategy.FolderPerSubtype:
              // this.parseFolderPerSubtype(); ??
              break;
            case WorkspaceStrategy.InFolderMetadataType:
              // console.log('In Folder MetadataType');
              break;
            default:
            // console.log('NonDecomposed');
          }

          const elementpath = `${packagePath}/${mtd.defaultDirectory}/${contentElement.name}`;
          const builtInTemplatesPath = path.resolve(__dirname, '..', '..', 'templates');
          if (mtd.decompositionConfig.workspaceStrategy === WorkspaceStrategy.FolderPerSubtype) {
            let mtdParsed: Metadata = { fullName: contentElement.name };
            if (fs.existsSync(`${elementpath}/${contentElement.name}.${mtd.ext}-meta.xml`)) {
              const content = fs.readFileSync(
                `${packagePath}/${mtd.defaultDirectory}/${contentElement.name}/${contentElement.name}.${mtd.ext}-meta.xml`,
                { encoding: 'utf8' }
              );

              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, no-await-in-loop
              mtdParsed = await parseStringPromise(content, xmlParserOptions);
            }

            if (mtd.decompositionConfig.decompositions.length > 0) {
              /**
               * Per descomposition we check if the folder does exists to get its content
               */
              for (const element of mtd.decompositionConfig.decompositions) {
                if (
                  fs.existsSync(
                    `${packagePath}/${mtd.defaultDirectory}/${contentElement.name}/${element.defaultDirectory}`
                  )
                ) {
                  const foldercontent = fs.readdirSync(
                    `${packagePath}/${mtd.defaultDirectory}/${contentElement.name}/${element.defaultDirectory}`,
                    { encoding: 'utf8' }
                  );
                  const elementsToAdd = [];
                  for (const folderElement of foldercontent) {
                    const xmlelement = fs.readFileSync(
                      `${packagePath}/${mtd.defaultDirectory}/${contentElement.name}/${element.defaultDirectory}/${folderElement}`,
                      { encoding: 'utf8' }
                    );
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, no-await-in-loop
                    const parsedelement = await parseStringPromise(xmlelement, xmlParserOptions);
                    elementsToAdd.push(parsedelement);
                  }
                  mtdParsed[element.xmlFragmentName] = elementsToAdd;
                }
              }
            }

            /**
             * store info somewhere
             */
            fs.mkdirSync(`${flags['output-dir']}/${namedPackageDir.name}/${mtd.defaultDirectory}/`, {
              recursive: true,
            });

            try {
              const template = Handlebars.compile(
                fs.readFileSync(`${builtInTemplatesPath}/${mtd.defaultDirectory}.md`, {
                  encoding: 'utf8',
                })
              );
              const generatedContent = template(mtdParsed);

              fs.writeFileSync(
                `${flags['output-dir']}/${namedPackageDir.name}/${mtd.defaultDirectory}/${contentElement.name}.md`,
                generatedContent,
                'utf-8'
              );
            } catch (err) {
              // do nothing
            }

            try {
              const template = Handlebars.compile(
                fs.readFileSync(`${builtInTemplatesPath}/${mtd.defaultDirectory}.html`, {
                  encoding: 'utf8',
                })
              );
              const generatedContent = template(mtdParsed);

              fs.writeFileSync(
                `${flags['output-dir']}/${namedPackageDir.name}/${mtd.defaultDirectory}/${contentElement.name}.html`,
                generatedContent,
                'utf-8'
              );
            } catch (err) {
              // do nothing
            }

            fs.writeFileSync(
              `${flags['output-dir']}/${namedPackageDir.name}/${mtd.defaultDirectory}/${contentElement.name}.json`,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              JSON.stringify(mtdParsed)
            );
          } else {
            // TODO: if is directory, check for content has '*-meta.xml' file
            /**
             * when the type is not stored in subfolders
             */
            const elementName = contentElement.name.substr(0, contentElement.name.indexOf('.'));
            const content = fs.readFileSync(`${packagePath}/${mtd.defaultDirectory}/${contentElement.name}`, {
              encoding: 'utf8',
            });
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-await-in-loop, @typescript-eslint/no-unsafe-call
            const mtdParsed: Metadata = await parseStringPromise(content, xmlParserOptions);
            mtdParsed.fullName = elementName;
            fs.mkdirSync(`${flags['output-dir']}/${namedPackageDir.name}/${mtd.defaultDirectory}/`, {
              recursive: true,
            });

            try {
              const template = Handlebars.compile(
                fs.readFileSync(`${builtInTemplatesPath}/${mtd.defaultDirectory}.md`, {
                  encoding: 'utf8',
                })
              );
              const generatedContent = template(mtdParsed);

              fs.writeFileSync(
                `${flags['output-dir']}/${namedPackageDir.name}/${mtd.defaultDirectory}/${elementName}.md`,
                generatedContent,
                'utf-8'
              );
            } catch (err) {
              // do nothing
            }

            try {
              const template = Handlebars.compile(
                fs.readFileSync(`${builtInTemplatesPath}/${mtd.defaultDirectory}.html`, {
                  encoding: 'utf8',
                })
              );
              const generatedContent = template(mtdParsed);

              fs.writeFileSync(
                `${flags['output-dir']}/${namedPackageDir.name}/${mtd.defaultDirectory}/${elementName}.html`,
                generatedContent,
                'utf-8'
              );
            } catch (err) {
              // do nothing
            }

            fs.writeFileSync(
              `${flags['output-dir']}/${namedPackageDir.name}/${mtd.defaultDirectory}/${elementName}.json`,
              JSON.stringify(mtdParsed)
            );
          }
        }
      }
      this.spinner.stop();
    }
  }
}
