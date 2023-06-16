import { execCmd, TestSession } from '@salesforce/cli-plugins-testkit';
import { expect } from 'chai';
import { HelloWorldResult } from '../../../src/commands/sfdocs/world';

let testSession: TestSession;

describe('sfdocs world NUTs', () => {
  before('prepare session', async () => {
    testSession = await TestSession.create();
  });

  after(async () => {
    await testSession?.clean();
  });

  it('should say hello to the world', () => {
    const { result } = execCmd<HelloWorldResult>('sfdocs world --json', { ensureExitCode: 0 }).jsonOutput;
    expect(result.name).to.equal('World');
  });

  it('should say hello to a given person', () => {
    const { result } = execCmd<HelloWorldResult>('sfdocs world --name Astro --json', {
      ensureExitCode: 0,
    }).jsonOutput;
    expect(result.name).to.equal('Astro');
  });
});
