import * as path from "node:path";
import { ConfigSchema } from "./cli.js";
import { pathToFileURL } from "node:url";

export async function loadAppModule({ config }: { config: ConfigSchema }) {
  const appModulePath = path.resolve(process.cwd(), config.appModule);

  try {
    const mod = await import(pathToFileURL(appModulePath).href);

    return mod[config.appModuleExport];
  } catch (error) {
    throw error;
  }
}
