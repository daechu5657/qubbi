import type { OpenApiV3_1 } from "@typia/interface";
import ts from "typescript";

export namespace ModelAnalyzer {
  export const analyze = (
    program: ts.Program,
  ): Map<string, ts.ClassDeclaration> => {
    const result = new Map<string, ts.ClassDeclaration>();

    for (const sourceFile of program.getSourceFiles()) {
      if (sourceFile.isDeclarationFile) continue;

      ts.forEachChild(sourceFile, function visit(node) {
        if (!ts.isClassDeclaration(node) || !node.name) {
          ts.forEachChild(node, visit);
          return;
        }

        result.set(node.name.text, node);

        ts.forEachChild(node, visit);
      });
    }

    return result;
  };

  export const filter = ({
    document,
    ignore,
    models,
  }: {
    document: OpenApiV3_1.IDocument;
    ignore: string[];
    models: Map<string, ts.ClassDeclaration>;
  }): void => {
    const schemaKeys =
      document.components && document.components.schemas
        ? Object.keys(document.components.schemas)
        : [];

    const filteredSchemaKeys = schemaKeys.filter((v) => !ignore.includes(v));

    for (const [modelName] of models) {
      if (!filteredSchemaKeys.includes(modelName)) {
        models.delete(modelName);
      }
    }
  };
}
