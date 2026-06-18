import * as fs from "node:fs/promises";
import * as path from "node:path";
import fg from "fast-glob";

async function parseComponent({
  cwd,
  pattern,
  out,
}: {
  cwd: string;
  pattern: string;
  out: string;
}) {
  const files = await fg(pattern, {
    cwd,
    absolute: true,
    onlyFiles: true,
  });

  const result = {
    generatedAt: new Date().toISOString(),
    files: files.map((file) => path.relative(cwd, file).replaceAll("\\", "/")),
  };

  const outPath = path.resolve(cwd, out);
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, JSON.stringify(result, null, 2), "utf8");

  return result;
}

export { parseComponent };
