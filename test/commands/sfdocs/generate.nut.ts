import { execCmd, TestSession } from '@salesforce/cli-plugins-testkit';
import { expect } from 'chai';
import { DocsGenerateResult } from '../../../src/commands/sfdocs/generate';

let testSession: TestSession;

describe('sfdocs generate NUTs', () => {
  before('prepare session', async () => {
    testSession = await TestSession.create();
  });

  after(async () => {
    await testSession?.clean();
  });

  it('should generate defaults in docs folder and json format', () => {
    const { result } = execCmd<DocsGenerateResult>('sfdocs generate --json', { ensureExitCode: 0 }).jsonOutput;
    expect(result.outputdir).to.equal('docs');
    expect(result.format).to.equal('json');
  });

  it('should generate docs in markdown', () => {
    const { result } = execCmd<DocsGenerateResult>('sfdocs generate --format markdown --json', {
      ensureExitCode: 0,
    }).jsonOutput;
    expect(result.format).to.equal('markdown');
  });
});
