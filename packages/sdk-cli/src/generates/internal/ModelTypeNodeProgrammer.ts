import ts from "typescript";
import type { EnumState } from "../../structures/EnumState.js";

export namespace ModelTypeNodeProgrammer {
  export interface IContext {
    enums: Map<string, EnumState>;
    models: Map<string, ts.ClassDeclaration>;
    checker: ts.TypeChecker;
  }

  export const write = (node: ts.TypeNode, context: IContext): ts.TypeNode => {
    if (isSkippableNode(node)) {
      return node;
    }

    if (ts.isLiteralTypeNode(node)) {
      return ts.factory.createLiteralTypeNode(
        cloneLiteralTypeValue(node.literal),
      );
    }

    if (ts.isTypeReferenceNode(node)) {
      return handleTypeReferenceNode(node, context);
    }

    if (ts.isArrayTypeNode(node)) {
      return ts.factory.updateArrayTypeNode(
        node,
        write(node.elementType, context),
      );
    }

    if (ts.isUnionTypeNode(node)) {
      return ts.factory.updateUnionTypeNode(
        node,
        ts.factory.createNodeArray(
          node.types.map((type) => write(type, context)),
        ),
      );
    }

    if (ts.isIndexedAccessTypeNode(node)) {
      return ts.factory.updateIndexedAccessTypeNode(
        node,
        write(node.objectType, context),
        node.indexType,
      );
    }

    throw new Error(`unsupported error : ${ts.SyntaxKind[node.kind]}`);
  };

  const isSkippableNode = (node: ts.TypeNode): boolean =>
    (ts.isToken(node) &&
      (node.kind === ts.SyntaxKind.StringKeyword ||
        node.kind === ts.SyntaxKind.NumberKeyword ||
        node.kind === ts.SyntaxKind.BooleanKeyword ||
        node.kind === ts.SyntaxKind.BigIntKeyword ||
        node.kind === ts.SyntaxKind.UnknownKeyword)) ||
    ts.isTypeOperatorNode(node);

  const cloneLiteralTypeValue = (
    literal: ts.LiteralTypeNode["literal"],
  ): ts.LiteralTypeNode["literal"] => {
    if (ts.isStringLiteral(literal)) {
      return ts.factory.createStringLiteral(literal.text);
    }

    if (ts.isNumericLiteral(literal)) {
      return ts.factory.createNumericLiteral(literal.text);
    }

    if (literal.kind === ts.SyntaxKind.TrueKeyword) {
      return ts.factory.createTrue();
    }

    if (literal.kind === ts.SyntaxKind.FalseKeyword) {
      return ts.factory.createFalse();
    }

    if (literal.kind === ts.SyntaxKind.NullKeyword) {
      return ts.factory.createNull();
    }

    if (
      ts.isPrefixUnaryExpression(literal) &&
      ts.isNumericLiteral(literal.operand)
    ) {
      return ts.factory.createPrefixUnaryExpression(
        literal.operator,
        ts.factory.createNumericLiteral(literal.operand.text),
      );
    }

    throw new Error(`unsupported literal type: ${ts.SyntaxKind[literal.kind]}`);
  };

  const handleTypeReferenceNode = (
    node: ts.TypeReferenceNode,
    context: IContext,
  ): ts.TypeNode => {
    const typeArgs = node.typeArguments
      ? ts.factory.createNodeArray(
          node.typeArguments.map((typeArg) => write(typeArg, context)),
        )
      : undefined;

    if (ts.isIdentifier(node.typeName)) {
      return handleIdentifierTypeReference(
        node,
        node.typeName,
        typeArgs,
        context,
      );
    }

    if (ts.isQualifiedName(node.typeName)) {
      return handleQualifiedNameTypeReference(
        node,
        node.typeName,
        typeArgs,
        context,
      );
    }

    throw new Error(`unsupported error : ${ts.SyntaxKind[node.kind]}`);
  };

  const handleIdentifierTypeReference = (
    node: ts.TypeReferenceNode,
    identifier: ts.Identifier,
    typeArgs: ts.NodeArray<ts.TypeNode> | undefined,
    context: IContext,
  ): ts.TypeNode => {
    const targetEnumState = context.enums.get(identifier.text);

    if (
      targetEnumState &&
      isEnum(identifier, context.checker, targetEnumState.declaration)
    ) {
      targetEnumState.isUsed = true;

      return ts.factory.updateTypeReferenceNode(
        node,
        ts.factory.createQualifiedName(
          ts.factory.createIdentifier("Enums"),
          ts.factory.createIdentifier(identifier.text),
        ),
        typeArgs,
      );
    }

    const targetModelDecl = context.models.get(identifier.text);

    if (
      targetModelDecl &&
      isModel(identifier, context.checker, targetModelDecl)
    ) {
      return ts.factory.updateTypeReferenceNode(
        node,
        ts.factory.createQualifiedName(
          ts.factory.createIdentifier("Models"),
          ts.factory.createIdentifier(identifier.text),
        ),
        typeArgs,
      );
    }

    const aliasType = getTypeAliasType(identifier, context.checker);

    if (aliasType) {
      return write(aliasType, context);
    }

    return ts.factory.updateTypeReferenceNode(node, identifier, typeArgs);
  };

  const handleQualifiedNameTypeReference = (
    node: ts.TypeReferenceNode,
    qualifiedName: ts.QualifiedName,
    typeArgs: ts.NodeArray<ts.TypeNode> | undefined,
    context: IContext,
  ): ts.TypeNode => {
    const left = qualifiedName.left;

    if (ts.isIdentifier(left)) {
      const targetEnumState = context.enums.get(left.text);

      if (
        targetEnumState &&
        isEnum(left, context.checker, targetEnumState.declaration)
      ) {
        targetEnumState.isUsed = true;

        return ts.factory.updateTypeReferenceNode(
          node,
          ts.factory.createQualifiedName(
            ts.factory.createQualifiedName(
              ts.factory.createIdentifier("Enums"),
              ts.factory.createIdentifier(left.text),
            ),
            qualifiedName.right,
          ),
          typeArgs,
        );
      }
    }

    throw new Error(`unsupported qualified name`);
  };

  const isEnum = (
    identifier: ts.Identifier,
    checker: ts.TypeChecker,
    enumDecl: ts.EnumDeclaration,
  ): boolean => {
    let symbol = checker.getSymbolAtLocation(identifier);
    if (!symbol) {
      return false;
    }

    if ((symbol.flags & ts.SymbolFlags.Alias) !== 0) {
      symbol = checker.getAliasedSymbol(symbol);
    }

    const enumFlags = ts.SymbolFlags.Enum | ts.SymbolFlags.ConstEnum;
    if ((symbol.flags & enumFlags) === 0) {
      return false;
    }

    if (!symbol.declarations || symbol.declarations.length === 0) {
      return false;
    }

    return symbol.declarations.includes(enumDecl);
  };

  const isModel = (
    identifier: ts.Identifier,
    checker: ts.TypeChecker,
    modelDecl: ts.ClassDeclaration,
  ): boolean => {
    let symbol = checker.getSymbolAtLocation(identifier);
    if (!symbol) {
      return false;
    }

    if ((symbol.flags & ts.SymbolFlags.Alias) !== 0) {
      symbol = checker.getAliasedSymbol(symbol);
    }

    if ((symbol.flags & ts.SymbolFlags.Class) === 0) {
      return false;
    }

    if (!symbol.declarations || symbol.declarations.length === 0) {
      return false;
    }

    return symbol.declarations.includes(modelDecl);
  };

  const getTypeAliasType = (
    identifier: ts.Identifier,
    checker: ts.TypeChecker,
  ): ts.TypeNode | undefined => {
    let symbol = checker.getSymbolAtLocation(identifier);
    if (!symbol) return undefined;

    if ((symbol.flags & ts.SymbolFlags.Alias) !== 0) {
      symbol = checker.getAliasedSymbol(symbol);
    }

    if ((symbol.flags & ts.SymbolFlags.TypeAlias) === 0) {
      return undefined;
    }

    const declaration = symbol.declarations?.find(ts.isTypeAliasDeclaration);

    return declaration?.type;
  };
}
