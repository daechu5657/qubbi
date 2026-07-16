import type ts from "typescript";
import type { EnumState } from "./EnumState.js";

export interface ApisGenerationContext {
  models: Map<string, ts.ClassDeclaration>;
  enums: Map<string, EnumState>;
}
