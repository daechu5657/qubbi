import type ts from "typescript";
import type { EnumState } from "./EnumState.js";

export interface ServerProgramState {
  checker: ts.TypeChecker;
  enums: Map<string, EnumState>;
  models: Map<string, ts.ClassDeclaration>;
}
