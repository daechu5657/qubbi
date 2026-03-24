import { promises as fs } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

type ComponentDefinitionLike = {
  name: string;
  tagName: string;
  baseProps: unknown[];
  variants: string[];
  variantOverrides: Record<string, unknown[]>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isComponentDefinition(
  value: unknown,
): value is ComponentDefinitionLike {
  if (!isRecord(value)) return false;

  return (
    typeof value.name === "string" &&
    typeof value.tagName === "string" &&
    Array.isArray(value.baseProps) &&
    Array.isArray(value.variants) &&
    isRecord(value.variantOverrides)
  );
}

async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

async function main() {
  const distDir = path.resolve(process.cwd(), "dist");
  const outPath = path.join(distDir, "component-definitions.json");

  const files = (await walk(distDir)).filter((file) => {
    const p = file.replace(/\\/g, "/");
    return (
      p.endsWith(".js") &&
      !p.endsWith("/define-component.js") &&
      !p.endsWith("/scripts/extract-definition.js") &&
      !p.includes("/scripts/")
    );
  });

  const items: Array<{
    exportName: string;
    file: string;
    definition: ComponentDefinitionLike;
  }> = [];

  for (const file of files) {
    const mod = await import(pathToFileURL(file).href);

    for (const [exportName, value] of Object.entries(mod)) {
      if (!isComponentDefinition(value)) continue;

      items.push({
        exportName,
        file: path.relative(distDir, file).replace(/\\/g, "/"),
        definition: value,
      });
    }
  }

  await fs.writeFile(
    outPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        count: items.length,
        items,
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log(`written: ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
