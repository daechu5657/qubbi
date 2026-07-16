#!/usr/bin/env node

import { SdkGenerator } from "./SdkGenerator.js";

const CONFIG_FILE_NAME = "sdk-cli.json";

async function main() {
  await SdkGenerator.generate({ configFileName: CONFIG_FILE_NAME });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
