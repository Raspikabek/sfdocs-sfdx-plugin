import * as path from 'path';
import { TestSession } from '@salesforce/cli-plugins-testkit';
// import { TestContext } from '@salesforce/core/lib/testSetup';
import { expect } from 'chai';
import { stubSfCommandUx } from '@salesforce/sf-plugins-core';
import Generate from '../../../src/commands/docs/generate';

describe('Generate Docs', () => {
  // const $$ = new TestContext();
  let sfCommandStubs: ReturnType<typeof stubSfCommandUx>;
  let testSession: TestSession;

  before(async () => {
    const testProjectPath = path.join(process.cwd(), 'test', 'MyTestProject');
    // eslint-disable-next-line no-console
    console.log(testProjectPath);
    testSession = await TestSession.create({
      project: {
        sourceDir: testProjectPath,
        name: 'MyTestProject',
        destinationDir: testProjectPath,
      },
    });
  });

  // beforeEach(() => {
  //   sfCommandStubs = stubSfCommandUx($$.SANDBOX);
  // });

  // afterEach(() => {
  //   $$.restore();
  // });

  after(async () => {
    await testSession?.clean();
  });

  it('runs docs generate', async () => {
    await Generate.run([]);
    const output = sfCommandStubs.log
      .getCalls()
      .flatMap((c) => c.args)
      .join('\n');
    expect(output).to.include('json');
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
