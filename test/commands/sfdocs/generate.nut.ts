import { execCmd, TestSession } from '@salesforce/cli-plugins-testkit';
import { expect } from 'chai';
import * as fs from 'graceful-fs';
import { DocsGenerateResult } from '../../../src/commands/sfdocs/generate';

let testSession: TestSession;
let error: boolean;

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

  it('should generate docs with reset option and not contain previous files', () => {
    fs.mkdirSync('docs/sample-app/objects', { recursive: true });
    fs.writeFileSync('docs/sample-app/objects/CustomObject.json', '{test: true}');

    const { result } = execCmd<DocsGenerateResult>('sfdocs generate --reset --json', {
      ensureExitCode: 0,
    }).jsonOutput;

    try {
      fs.readFileSync('docs/sample-app/objects/CustomObject.json');
    } catch (err) {
      error = true;
    }

    expect(result.format).to.equal('json');
    expect(result.outputdir).to.equal('docs');
    expect(error).to.be.true;
  });
});
