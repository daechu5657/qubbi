import * as fs from "node:fs";
import * as path from "node:path";
import type { Config } from "../structures/Config.js";

export namespace ConfigLoader {
  export const load = (fileName?: string): Config => {
    try {
      return JSON.parse(
        fs.readFileSync(
          path.join(process.cwd(), fileName ?? "sdk-cli.json"),
          "utf-8",
        ),
      ) as Config;
    } catch (error) {
      throw error;
    }
  };
}
