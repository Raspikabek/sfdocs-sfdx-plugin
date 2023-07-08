import { join } from 'path';
import { expect } from 'chai';
import { loadHelpers, HelperModule } from '../../src/service/helpersModule';
import * as defaultHelpers from '../../src/helpers/default';

describe('Service Helpers Module', () => {
  it('should load default helpers when customHelpersPath is undefined', async () => {
    const customHelpersPath: string | undefined = undefined;
    const helpers: HelperModule = await loadHelpers(customHelpersPath);
    expect(helpers).equal(defaultHelpers.default);
  });

  it('should load custom helpers when customHelpersPath is provided', async () => {
    const customHelpersPath: string | undefined = join('test', 'MyTestProject', 'customHelpers.ts');

    // Mock the import of custom helpers
    const customHelpers: HelperModule = {
      questionmark: (text: string): string => {
        if (text === null || text === undefined) {
          return '';
        }
        return `${text}????`;
      },
      uppercase: (text: string): string => {
        if (text === null || text === undefined) {
          return '';
        }
        return text.toLowerCase();
      },
    };

    const helpers: HelperModule = await loadHelpers(customHelpersPath);

    // Assert that the loaded helpers contain the default helpers merged with custom helpers
    const expectedHelpers: HelperModule = {
      ...defaultHelpers.default,
      ...customHelpers,
    };
    expect(Object.keys(helpers)).to.contain.members(Object.keys(expectedHelpers));
  });
});
