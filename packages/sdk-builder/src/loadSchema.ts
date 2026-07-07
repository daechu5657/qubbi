import * as path from "node:path";
import * as fs from "node:fs";
import { fileURLToPath } from "node:url";
import { ConfigSchema } from "./cli.js";

export function loadSchema(cliSchemaPath: string) {
  try {
    const schemaPath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      cliSchemaPath,
    );

    return JSON.parse(fs.readFileSync(schemaPath, "utf-8")) as ConfigSchema;
  } catch (error) {
    throw error;
  }
}
