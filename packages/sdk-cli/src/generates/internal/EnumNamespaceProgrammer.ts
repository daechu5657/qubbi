import ts from "typescript";
import type { EnumState } from "../../structures/EnumState.js";

export namespace EnumNamespaceProgrammer {
  export const write = ({
    enums,
  }: {
    enums: Map<string, EnumState>;
  }): ts.ModuleDeclaration => {
    const enumStatements: ts.Statement[] = [];

    for (const [, { isUsed, declaration }] of enums) {
      if (isUsed) {
        enumStatements.push(createEnumDeclaration(declaration));
      }
    }

    return ts.factory.createModuleDeclaration(
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      ts.factory.createIdentifier("Enums"),
      ts.factory.createModuleBlock(enumStatements),
      ts.NodeFlags.Namespace,
    );
  };

  const createEnumDeclaration = (
    declaration: ts.EnumDeclaration,
  ): ts.EnumDeclaration =>
    ts.factory.createEnumDeclaration(
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      declaration.name.text,
      declaration.members.map((member) =>
        ts.factory.createEnumMember(
          cloneEnumMemberName(member.name),
          cloneEnumInitializer(member.initializer),
        ),
      ),
    );

  const cloneEnumMemberName = (name: ts.PropertyName): ts.PropertyName => {
    if (ts.isIdentifier(name)) return ts.factory.createIdentifier(name.text);
    if (ts.isStringLiteral(name))
      return ts.factory.createStringLiteral(name.text);
    if (ts.isNumericLiteral(name))
      return ts.factory.createNumericLiteral(name.text);

    throw new Error(`unsupported enum member name`);
  };

  const cloneEnumInitializer = (
    initializer: ts.Expression | undefined,
  ): ts.Expression | undefined => {
    if (!initializer) return undefined;

    if (ts.isStringLiteral(initializer)) {
      return ts.factory.createStringLiteral(initializer.text);
    }

    if (ts.isNumericLiteral(initializer)) {
      return ts.factory.createNumericLiteral(initializer.text);
    }

    throw new Error(`unsupported enum initializer`);
  };
}
