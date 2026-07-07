#!/usr/bin/env node

import { loadConfig } from "./loadConfig.js";
import { createTypes } from "./createTypes.js";
import type { INestiaConfig } from "@nestia/sdk";
import { loadSchema } from "./loadSchema.js";
import { validateConfig } from "./validateConfig.js";
import { loadAppModule } from "./loadAppModule.js";
import { loadPackagePath } from "./loadPackagePath.js";

export interface ConfigSchema {
  appModule: string;
  appModuleExport: string;
  exportPackageName: string;
  swagger: INestiaConfig["swagger"];
}

const SCHEMA_PATH = "../schema/cli.json";
const CONFIG_FILE_NAME = "sdk-cli.json";

async function main() {
  const schema = loadSchema(SCHEMA_PATH);
  const config = loadConfig(CONFIG_FILE_NAME);

  validateConfig({ config, schema });

  const generatePath = await loadPackagePath({ config });
  const AppModule = await loadAppModule({ config });

  createTypes({ config, AppModule, generatePath });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
