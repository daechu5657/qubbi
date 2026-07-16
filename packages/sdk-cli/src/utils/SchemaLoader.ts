import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const SCHEMA_PATH = "../../schema/cli.json";

export namespace SchemaLoader {
  export const load = (): unknown => {
    try {
      const schemaPath = path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        SCHEMA_PATH,
      );

      return JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
    } catch (error) {
      throw error;
    }
  };
}
