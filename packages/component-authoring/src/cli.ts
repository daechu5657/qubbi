#!/usr/bin/env node

import { parseComponent } from "./parseComponent";

async function main() {
  const [, , command, ...args] = process.argv;

  if (command !== "parse") {
    console.log("Usage: component-authoring parse --pattern ... --out ...");
    return;
  }

  const pattern = getArg(args, "--pattern");
  const out = getArg(args, "--out");

  if (!pattern || !out) {
    throw new Error("--pattern and --out are required.");
  }

  await parseComponent({
    cwd: process.cwd(),
    pattern,
    out,
  });
}

function getArg(args: string[], name: string) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
