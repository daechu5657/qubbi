#!/usr/bin/env node

import path from "node:path";
import { writeFileSync } from "node:fs";
import { loadConfig } from "./load/loadConfig.js";
import { loadSchema } from "./load/loadSchema.js";
import { validateConfig } from "./validate/validateConfig.js";
import { loadAppModule } from "./load/loadAppModule.js";
import { loadPackagePath } from "./load/loadPackagePath.js";
import { createDocument } from "./create/createDocument.js";
import { build } from "./build/build.js";

const CONFIG_FILE_NAME = "sdk-cli.json";

async function main() {
  const schema = loadSchema();
  const config = loadConfig(CONFIG_FILE_NAME);
  validateConfig({ config, schema });

  const generatePath = await loadPackagePath({ config });
  const AppModule = await loadAppModule({ config });
  const document = await createDocument({ AppModule, config });

  const contents = await build({ document });
  const filePath = path.resolve(generatePath, "./src/generated.ts");

  writeFileSync(filePath, contents);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
