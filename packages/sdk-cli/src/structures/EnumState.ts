import type ts from "typescript";

export interface EnumState {
  isUsed: boolean;
  declaration: ts.EnumDeclaration;
}
