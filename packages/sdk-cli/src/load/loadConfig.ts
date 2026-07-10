import * as path from "node:path";
import * as fs from "node:fs";
import { IConfig } from "../types.js";

export function loadConfig(fileName?: string) {
  try {
    return JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), fileName ?? "sdk-cli.json"),
        "utf-8",
      ),
    ) as IConfig;
  } catch (error) {
    throw error;
  }
}
