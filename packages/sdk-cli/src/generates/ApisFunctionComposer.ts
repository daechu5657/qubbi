import type { OpenApiV3_1 } from "@typia/interface";
import type ts from "typescript";
import { OpenApiAccessorAnalyzer } from "../analyses/OpenApiAccessorAnalyzer.js";
import { ApisFunctionProgrammer } from "./internal/ApisFunctionProgrammer.js";
import type { EnumState } from "../structures/EnumState.js";

export namespace ApisFunctionComposer {
  export const compose = ({
    document,
    models,
    enums,
  }: {
    document: OpenApiV3_1.IDocument;
    models: Map<string, ts.ClassDeclaration>;
    enums: Map<string, EnumState>;
  }): ts.FunctionDeclaration => {
    const accessorMap = OpenApiAccessorAnalyzer.analyze(document);

    return ApisFunctionProgrammer.write(accessorMap, { models, enums });
  };
}
