import ts from "typescript";

export namespace SourceFileComposer {
  export const compose = (statements: ts.Statement[]): ts.SourceFile =>
    ts.factory.createSourceFile(
      statements,
      ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
      ts.NodeFlags.None,
    );

  export const interleaveNewLines = (
    statements: ts.Statement[],
  ): ts.Statement[] =>
    statements.flatMap((statement, i) =>
      i === 0 ? [statement] : [createNewLineNode(), statement],
    );

  const createNewLineNode = (): ts.Statement =>
    ts.factory.createIdentifier("\n") as unknown as ts.Statement;
}
