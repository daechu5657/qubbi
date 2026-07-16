import ts from "typescript";

export namespace AxiosImportProgrammer {
  export const write = (): ts.ImportDeclaration =>
    ts.factory.createImportDeclaration(
      undefined,
      ts.factory.createImportClause(
        true,
        undefined,
        ts.factory.createNamedImports([
          ts.factory.createImportSpecifier(
            false,
            undefined,
            ts.factory.createIdentifier("AxiosInstance"),
          ),
        ]),
      ),
      ts.factory.createStringLiteral("axios"),
      undefined,
    );
}
