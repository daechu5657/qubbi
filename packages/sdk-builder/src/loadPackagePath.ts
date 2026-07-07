import * as fs from "node:fs";
import * as path from "node:path";
import * as yaml from "js-yaml";
import fg from "fast-glob";
import { ConfigSchema } from "./cli.js";

export async function loadPackagePath({ config }: { config: ConfigSchema }) {
  const file = fs.readFileSync(
    path.join(process.cwd(), "../../pnpm-workspace.yaml"),
    "utf8",
  );

  const parsed = yaml.load(file) as { packages: string[] };
  const pattern = parsed.packages.map(
    (v) => v.split("/")[0] + "/**/package.json",
  );
  const cwd = path.resolve(process.cwd(), "../../");
  const ignore = ["**/node_modules/**"];

  const packages = await fg(pattern, {
    cwd,
    ignore,
    absolute: true,
    onlyFiles: true,
  });

  const target = packages.find((pkgPath) => {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    return pkg.name === config.exportPackageName;
  });

  if (!target) {
    throw new Error(`cannot find ${config.exportPackageName} package`);
  }

  return target.split("/package.json")[0];
}
