import * as path from 'path';
import { expect, test } from '@oclif/test';
import { TestSession } from '@salesforce/cli-plugins-testkit';
import { DocsGenerateResult } from '../../../src/commands/sfdocs/generate';

describe('Generate Docs', () => {
  let testSession: TestSession;
  before(async () => {
    testSession = await TestSession.create({
      project: {
        sourceDir: path.join(process.cwd(), 'test/MyTestProject'),
      },
    });
  });

  after(async () => {
    await testSession?.clean();
  });

  test
    .stdout()
    .command(['sfdocs:generate'])
    .it('runs generation of documentation with defaults', (ctx) => {
      expect(ctx.stdout).to.contain('json');
      expect(ctx.stdout).to.contain('docs');
    });

  test
    .stdout()
    .command(['sfdocs:generate', '--json'])
    .it('runs generate --json', (ctx) => {
      const { result } = JSON.parse(ctx.stdout) as { result: DocsGenerateResult };
      expect(result.format).to.equal('json');
      expect(result.outputdir).to.equal('docs');
      expect(result.packages[0]['path']).to.equal('force-app');
      expect(result.packages[0]['default']).to.be.true;
      expect(result.packages).to.have.lengthOf(2);
    });

  test
    .stdout()
    .command(['sfdocs:generate', '--reset', '--json'])
    .it('runs generate --reset --json', (ctx) => {
      expect(ctx.stdout).to.contain('json');
      expect(ctx.stdout).to.contain('docs');
    });

  test
    .stdout()
    .command(['sfdocs:generate', '--format', 'markdown'])
    .it('runs generate --format markdown', (ctx) => {
      expect(ctx.stdout).to.contain('markdown');
      expect(ctx.stdout).to.contain('docs');
    });

  test
    .stdout()
    .command(['sfdocs:generate', '--format', 'markdown', '--json'])
    .it('runs generate --format markdown --json', (ctx) => {
      const { result } = JSON.parse(ctx.stdout) as { result: DocsGenerateResult };
      expect(result.format).to.equal('markdown');
      expect(result.packages).to.have.lengthOf(2);
    });

  test
    .stdout()
    .command(['sfdocs:generate', '--output-dir', 'alternative-dir', '--json'])
    .it('runs generate --format markdown --json', (ctx) => {
      const { result } = JSON.parse(ctx.stdout) as { result: DocsGenerateResult };
      expect(result.outputdir).to.equal('alternative-dir');
      expect(result.packages).to.have.lengthOf(2);
    });

  test
    .stdout()
    .command(['sfdocs:generate', '--package', 'force-app', '--json'])
    .it('runs generate --package force-app --json', (ctx) => {
      const { result } = JSON.parse(ctx.stdout) as { result: DocsGenerateResult };
      expect(result.outputdir).to.equal('docs');
      expect(result.packages[0]['path']).to.equal('force-app');
      expect(result.packages[0]['default']).to.be.true;
      expect(result.packages).to.have.lengthOf(1);
    });

  test
    .stdout()
    .command(['sfdocs:generate', '--package', 'force-second-app', '--json'])
    .it('runs generate --package force-second-app --json', (ctx) => {
      const { result } = JSON.parse(ctx.stdout) as { result: DocsGenerateResult };
      expect(result.outputdir).to.equal('docs');
      expect(result.packages[0]['path']).to.equal('force-second-app');
      expect(result.packages[0]['default']).to.be.undefined;
      expect(result.packages).to.have.lengthOf(1);
    });

  test
    .stdout()
    .command(['sfdocs:generate', '--package', 'non-existent-app', '--json'])
    .it('runs generate --package non-existent-app --json', (ctx) => {
      const { result } = JSON.parse(ctx.stdout) as { result: DocsGenerateResult };
      expect(result.outputdir).to.equal('docs');
      expect(result.packages).to.have.lengthOf(0);
    });
});
