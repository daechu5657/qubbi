import * as path from "node:path";
import { pathToFileURL } from "node:url";
import type { Config } from "../structures/Config.js";

export namespace AppModuleLoader {
  export const load = async ({ config }: { config: Config }): Promise<any> => {
    const appModulePath = path.resolve(process.cwd(), config.appModule);

    try {
      const mod = await import(pathToFileURL(appModulePath).href);

      return mod[config.appModuleExport];
    } catch (error) {
      throw error;
    }
  };
}
