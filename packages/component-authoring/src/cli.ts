#!/usr/bin/env node

import { build } from "./build";
import { pack } from "./pack";
import { parseComponent } from "./parseComponent";

async function main() {
  const [, , command, ...args] = process.argv;

  if (command !== "prebuild") {
    console.log("Usage: component-authoring prebuild --root ...");
    return;
  }

  const root = getArg(args, "--root");
  if (!root) {
    throw new Error("--root are required.");
  }

  const cwd = process.cwd();

  await parseComponent(cwd, root);
  await build(cwd, root);
  await pack(cwd, root);
}

function getArg(args: string[], name: string) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
