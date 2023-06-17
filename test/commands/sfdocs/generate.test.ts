import { expect, test } from '@oclif/test';
import { DocsGenerateResult } from '../../../src/commands/sfdocs/generate';

describe('Generate Docs', () => {
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
    .it('runs generate --json (runs with defaults)', (ctx) => {
      const { result } = JSON.parse(ctx.stdout) as { result: DocsGenerateResult };
      expect(result.format).to.equal('json');
      expect(result.outputdir).to.equal('docs');
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
    });

  test
    .stdout()
    .command(['sfdocs:generate', '--output-dir', 'alternative-dir', '--json'])
    .it('runs generate --format markdown --json', (ctx) => {
      const { result } = JSON.parse(ctx.stdout) as { result: DocsGenerateResult };
      expect(result.outputdir).to.equal('alternative-dir');
    });

  test.stdout();
});
