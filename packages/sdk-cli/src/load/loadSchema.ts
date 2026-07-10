import * as path from "node:path";
import * as fs from "node:fs";
import { fileURLToPath } from "node:url";
import { IConfig } from "../types.js";

const SCHEMA_PATH = "../../schema/cli.json";

export function loadSchema() {
  try {
    const schemaPath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      SCHEMA_PATH,
    );

    return JSON.parse(fs.readFileSync(schemaPath, "utf-8")) as IConfig;
  } catch (error) {
    throw error;
  }
}
