import { join } from 'path';
import { MockTestOrgData, TestContext } from '@salesforce/core/lib/testSetup';
import { expect } from 'chai';
import { stubSfCommandUx } from '@salesforce/sf-plugins-core';
import { SfProject } from '@salesforce/core';
import * as oclifUtils from '@oclif/core/lib/util';
import { MetadataConverter } from '@salesforce/source-deploy-retrieve';
import Generate from '../../../src/commands/docs/generate';

describe('Generate Docs', () => {
  const $$ = new TestContext();
  const testOrg = new MockTestOrgData();

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
  });

  afterEach(() => {
    $$.restore();
  });

  it('runs docs generate with all defaults', async () => {
    const result = await Generate.run([]);
    expect(result.outputdir).to.equal('docs');
    expect(result.format).to.equal('json');
    expect(result.packages[0].path).to.contain('force-app');
    expect(result.packages[0].default).to.be.true;
    expect(result.packages[1].path).to.contain('force-second-app');
  });
});
