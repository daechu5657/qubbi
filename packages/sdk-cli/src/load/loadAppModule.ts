import * as path from "node:path";
import { pathToFileURL } from "node:url";
import { IConfig } from "../types.js";

export async function loadAppModule({ config }: { config: IConfig }) {
  const appModulePath = path.resolve(process.cwd(), config.appModule);

  try {
    const mod = await import(pathToFileURL(appModulePath).href);

    return mod[config.appModuleExport];
  } catch (error) {
    throw error;
  }
}
