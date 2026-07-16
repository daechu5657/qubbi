import ts from "typescript";
import type { EnumState } from "../structures/EnumState.js";

export namespace EnumAnalyzer {
  export const analyze = (program: ts.Program): Map<string, EnumState> => {
    const result = new Map<string, EnumState>();

    for (const sourceFile of program.getSourceFiles()) {
      if (sourceFile.isDeclarationFile) continue;

      ts.forEachChild(sourceFile, function visit(node) {
        if (ts.isEnumDeclaration(node)) {
          result.set(node.name.text, { isUsed: false, declaration: node });
        }

        ts.forEachChild(node, visit);
      });
    }

    return result;
  };
}
