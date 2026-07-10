import fs from "node:fs";
import path from "node:path";

export function writeGeneratedFile({
  generatePath,
  contents,
}: {
  generatePath: string;
  contents: string;
}) {
  const filePath = path.resolve(generatePath, "./src/generated.ts");

  fs.writeFileSync(filePath, contents);
}
