import * as path from 'path';
import * as defaultHelpers from '..//helpers/default';

export interface HelperModule {
  [key: string]: Handlebars.HelperDelegate;
}

export async function loadHelpers(customHelpersPath: string | undefined): Promise<HelperModule> {
  let helpers = defaultHelpers.default as HelperModule;
  if (customHelpersPath !== undefined) {
    const handlebarHelpersPath = path.resolve(customHelpersPath);
    // TODO: find a way to import dynamically better with no lint errors & from JS file and not TS?
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const customHelpersModule = await import(handlebarHelpersPath);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const newHelpers: HelperModule = customHelpersModule.default as HelperModule;
    helpers = {
      ...helpers,
      ...newHelpers,
    };
  }
  return helpers;
}
