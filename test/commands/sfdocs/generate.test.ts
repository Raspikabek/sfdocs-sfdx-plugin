import { expect, test } from '@salesforce/command/lib/test';

describe('sfdocs:generate', () => {
  test
    .stdout()
    .command(['sfdocs:generate', '--resultformat', 'markdown'])
    .it('runs sfdocs:generate --resultformat markdown', (ctx) => {
      expect(ctx.stdout).to.contains('HELLO WORLD!\n');
    });
});
