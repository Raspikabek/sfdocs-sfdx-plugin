import { join } from 'path';
import { MockTestOrgData, TestContext } from '@salesforce/core/lib/testSetup';
import { expect } from 'chai';
// import * as sinon from 'sinon';
import { stubSfCommandUx } from '@salesforce/sf-plugins-core';
// import { stubMethod } from '@salesforce/ts-sinon';
import { SfProject } from '@salesforce/core';
import * as oclifUtils from '@oclif/core/lib/util';
import { MetadataConverter } from '@salesforce/source-deploy-retrieve';
import Generate from '../../../src/commands/docs/generate';

describe('Generate Docs', () => {
  const $$ = new TestContext();
  const testOrg = new MockTestOrgData();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // let buildComponentSetStub: sinon.SinonStub;

  // const defaultDir = join('my', 'default', 'package');
  // the test is using fs that's in the os temp dir
  // const projectDir = `${join($$.localPathRetrieverSync($$.id), defaultDir)}${sep}`;
  // const myApp = join('new', 'package', 'directory');
  // const packageXml = 'package.xml';

  // before(async () => {
  //   const testProjectPath = path.join(process.cwd(), 'test', 'MyTestProject');
  //   // eslint-disable-next-line no-console
  //   console.log(testProjectPath);
  //   $$.inProject(true);
  //   // $$.setConfigStubContents('testProject')
  //   testSession = await TestSession.create({
  //     project: {
  //       sourceDir: testProjectPath,
  //       name: 'MyTestProject',
  //       destinationDir: testProjectPath,
  //     },
  //   });
  // });

  beforeEach(async () => {
    await $$.stubAuths(testOrg);

    // TODO: move this to TestSetup
    // @ts-expect-error accessing a private property
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    SfProject.instances.clear();
    stubSfCommandUx($$.SANDBOX);
    // the 2 oclif flags should act as if the dir/file is there and ok
    $$.SANDBOX.stub(oclifUtils, 'fileExists').callsFake((path: string) => Promise.resolve(path));
    $$.SANDBOX.stub(oclifUtils, 'dirExists').callsFake((path: string) => Promise.resolve(path));
    const testFirstPackage = join('test', 'MyTestProject', 'force-app');
    const testSecondPackage = join('test', 'MyTestProject', 'force-second-app');
    $$.setConfigStubContents('SfProjectJson', {
      contents: {
        packageDirectories: [{ path: testFirstPackage, default: true }, { path: testSecondPackage }],
      },
    });
    $$.SANDBOX.stub(MetadataConverter.prototype, 'convert').resolves({ packagePath: 'temp' });
    // buildComponentSetStub = stubMethod($$.SANDBOX, ComponentSetBuilder, 'build').resolves({
    //   deploy: sinon.stub(),
    //   getPackageXml: () => packageXml,
    // });
  });

  afterEach(() => {
    $$.restore();
  });

  // after(async () => {
  //   await testSession?.clean();
  // });

  it('runs docs generate with all defaults', async () => {
    const result = await Generate.run([]);
    expect(result.outputdir).to.equal('docs');
    expect(result.format).to.equal('json');
    expect(result.packages[0].path).to.contain('force-app');
    expect(result.packages[0].default).to.be.true;
    expect(result.packages[1].path).to.contain('force-second-app');
  });

  // test
  //   .stdout()
  //   .command(['docs:generate'])
  //   .it('runs generation of documentation with defaults', (ctx) => {
  //     expect(ctx.stdout).to.contain('json');
  //     expect(ctx.stdout).to.contain('docs');
  //   });

  // test
  //   .stdout()
  //   .command(['docs:generate', '--json'])
  //   .it('runs generate --json', (ctx) => {
  //     const { result } = JSON.parse(ctx.stdout) as { result: DocsGenerateResult };
  //     expect(result.format).to.equal('json');
  //     expect(result.outputdir).to.equal('docs');
  //     expect(result.packages[0]['path']).to.equal('force-app');
  //     expect(result.packages[0]['default']).to.be.true;
  //     expect(result.packages).to.have.lengthOf(2);
  //   });

  // test
  //   .stdout()
  //   .command(['docs:generate', '--reset', '--json'])
  //   .it('runs generate --reset --json', (ctx) => {
  //     expect(ctx.stdout).to.contain('json');
  //     expect(ctx.stdout).to.contain('docs');
  //   });

  // test
  //   .stdout()
  //   .command(['docs:generate', '--format', 'markdown'])
  //   .it('runs generate --format markdown', (ctx) => {
  //     expect(ctx.stdout).to.contain('markdown');
  //     expect(ctx.stdout).to.contain('docs');
  //   });

  // test
  //   .stdout()
  //   .command(['docs:generate', '--format', 'markdown', '--json'])
  //   .it('runs generate --format markdown --json', (ctx) => {
  //     const { result } = JSON.parse(ctx.stdout) as { result: DocsGenerateResult };
  //     expect(result.format).to.equal('markdown');
  //     expect(result.packages).to.have.lengthOf(2);
  //   });

  // test
  //   .stdout()
  //   .command(['docs:generate', '--output-dir', 'alternative-dir', '--json'])
  //   .it('runs generate --format markdown --json', (ctx) => {
  //     const { result } = JSON.parse(ctx.stdout) as { result: DocsGenerateResult };
  //     expect(result.outputdir).to.equal('alternative-dir');
  //     expect(result.packages).to.have.lengthOf(2);
  //   });

  // test
  //   .stdout()
  //   .command(['docs:generate', '--package', 'force-app', '--json'])
  //   .it('runs generate --package force-app --json', (ctx) => {
  //     const { result } = JSON.parse(ctx.stdout) as { result: DocsGenerateResult };
  //     expect(result.outputdir).to.equal('docs');
  //     expect(result.packages[0]['path']).to.equal('force-app');
  //     expect(result.packages[0]['default']).to.be.true;
  //     expect(result.packages).to.have.lengthOf(1);
  //   });

  // test
  //   .stdout()
  //   .command(['docs:generate', '--package', 'force-second-app', '--json'])
  //   .it('runs generate --package force-second-app --json', (ctx) => {
  //     const { result } = JSON.parse(ctx.stdout) as { result: DocsGenerateResult };
  //     expect(result.outputdir).to.equal('docs');
  //     expect(result.packages[0]['path']).to.equal('force-second-app');
  //     expect(result.packages[0]['default']).to.be.undefined;
  //     expect(result.packages).to.have.lengthOf(1);
  //   });

  // test
  //   .stdout()
  //   .command(['docs:generate', '--package', 'non-existent-app', '--json'])
  //   .it('runs generate --package non-existent-app --json', (ctx) => {
  //     const { result } = JSON.parse(ctx.stdout) as { result: DocsGenerateResult };
  //     expect(result.outputdir).to.equal('docs');
  //     expect(result.packages).to.have.lengthOf(0);
  //   });
});
