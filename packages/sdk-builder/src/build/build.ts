import { OpenApiV3_1 } from "@typia/interface";
import path from "node:path";
import ts from "typescript";
import * as prettier from "prettier";
import { createAxiosImport } from "../create/createAxiosImport.js";

const IGNORE_MODEL_NAMES = ["Properties0(string)string"];

interface EnumState {
  isUsed: boolean;
  declaration: ts.EnumDeclaration;
}

export async function build({
  document,
  serverRoot = process.cwd(),
  tsconfig = "./tsconfig.json",
}: {
  document: OpenApiV3_1.IDocument;
  serverRoot?: string;
  tsconfig?: string;
}) {
  const { enums, models, checker } = collectServer({
    serverRoot,
    tsconfig,
  });

  filterModels({ document, models, ignore: IGNORE_MODEL_NAMES });

  const modelStatements: ts.Statement[] = [];
  for (const [_, modelDecl] of models) {
    // modelStatements.push(
    //   handleClassDeclaration(modelDecl, enums, models, checker),
    // );
    modelStatements.push(
      createInterfaceDeclarationFromClass(modelDecl, enums, models, checker),
    );
  }

  const enumStatements: ts.Statement[] = [];
  for (const [_, { isUsed, declaration }] of enums) {
    if (isUsed) {
      enumStatements.push(createEnumDeclaration(declaration));
    }
  }

  const modelsNamespace = ts.factory.createModuleDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier("Models"),
    ts.factory.createModuleBlock(modelStatements),
    ts.NodeFlags.Namespace,
  );

  const enumsNamespace = ts.factory.createModuleDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier("Enums"),
    ts.factory.createModuleBlock(enumStatements),
    ts.NodeFlags.Namespace,
  );

  const sourceFile = createSourceFile(
    interleaveNewLines([
      createAxiosImport(),
      createCssTypeImport(),
      modelsNamespace,
      enumsNamespace,
    ]),
  );

  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
  });

  const code = printer.printFile(sourceFile);

  const formatted = await prettier.format(code, { parser: "typescript" });

  return formatted;
}

function createSourceFile(statements: ts.Statement[]): ts.SourceFile {
  return ts.factory.createSourceFile(
    statements,
    ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
    ts.NodeFlags.None,
  );
}

function createCssTypeImport(): ts.ImportDeclaration {
  return ts.factory.createImportDeclaration(
    undefined,
    ts.factory.createImportClause(
      true,
      undefined,
      ts.factory.createNamedImports([
        ts.factory.createImportSpecifier(
          false,
          undefined,
          ts.factory.createIdentifier("Properties"),
        ),
      ]),
    ),
    ts.factory.createStringLiteral("csstype"),
    undefined,
  );
}

function interleaveNewLines(statements: ts.Statement[]): ts.Statement[] {
  return statements.flatMap((statement, i) =>
    i === 0 ? [statement] : [createNewLineNode(), statement],
  );
}

function createNewLineNode() {
  return ts.factory.createIdentifier("\n") as any;
}

function createEnumDeclaration(
  declaration: ts.EnumDeclaration,
): ts.EnumDeclaration {
  return ts.factory.createEnumDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    declaration.name.text,
    declaration.members.map((member) =>
      ts.factory.createEnumMember(
        cloneEnumMemberName(member.name),
        cloneEnumInitializer(member.initializer),
      ),
    ),
  );
}

function cloneEnumMemberName(name: ts.PropertyName): ts.PropertyName {
  if (ts.isIdentifier(name)) return ts.factory.createIdentifier(name.text);
  if (ts.isStringLiteral(name))
    return ts.factory.createStringLiteral(name.text);
  if (ts.isNumericLiteral(name))
    return ts.factory.createNumericLiteral(name.text);

  throw new Error(`unsupported enum member name`);
}

function cloneEnumInitializer(
  initializer: ts.Expression | undefined,
): ts.Expression | undefined {
  if (!initializer) return undefined;

  if (ts.isStringLiteral(initializer)) {
    return ts.factory.createStringLiteral(initializer.text);
  }

  if (ts.isNumericLiteral(initializer)) {
    return ts.factory.createNumericLiteral(initializer.text);
  }

  throw new Error(`unsupported enum initializer`);
}

function collectServer({
  serverRoot,
  tsconfig,
}: {
  serverRoot: string;
  tsconfig: string;
}) {
  const program = createProgram(path.resolve(serverRoot, tsconfig));
  const checker = program.getTypeChecker();

  const enums = collectEnums(program);
  const models = collectModels(program);

  return { enums, models, checker };
}

function createProgram(tsconfigPath: string) {
  const config = ts.readConfigFile(tsconfigPath, ts.sys.readFile);

  if (config.error) {
    throw new Error(
      ts.flattenDiagnosticMessageText(config.error.messageText, "\n"),
    );
  }

  const parsed = ts.parseJsonConfigFileContent(
    config.config,
    ts.sys,
    path.dirname(tsconfigPath),
  );

  return ts.createProgram(parsed.fileNames, {
    ...parsed.options,
    skipLibCheck: true,
  });
}

function collectEnums(program: ts.Program) {
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
}

function collectModels(program: ts.Program) {
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
}

function filterModels({
  document,
  ignore,
  models,
}: {
  document: OpenApiV3_1.IDocument;
  ignore: string[];
  models: Map<string, ts.ClassDeclaration>;
}) {
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
}

function handleClassDeclaration(
  node: ts.ClassDeclaration,
  enums: Map<string, EnumState>,
  models: Map<string, ts.ClassDeclaration>,
  checker: ts.TypeChecker,
): ts.ClassDeclaration {
  return ts.factory.updateClassDeclaration(
    node,
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    node.name,
    node.typeParameters,
    node.heritageClauses,
    node.members.map((member) =>
      handleClassElement(member, enums, models, checker),
    ),
  );
}

function createInterfaceDeclarationFromClass(
  node: ts.ClassDeclaration,
  enums: Map<string, EnumState>,
  models: Map<string, ts.ClassDeclaration>,
  checker: ts.TypeChecker,
): ts.InterfaceDeclaration {
  if (!node.name) {
    throw new Error("class name is undefined");
  }

  return ts.factory.createInterfaceDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    node.name,
    node.typeParameters,
    undefined,
    node.members.map((member) =>
      createTypeElementFromClassElement(member, enums, models, checker),
    ),
  );
}

function createTypeElementFromClassElement(
  node: ts.ClassElement,
  enums: Map<string, EnumState>,
  models: Map<string, ts.ClassDeclaration>,
  checker: ts.TypeChecker,
): ts.TypeElement {
  if (ts.isPropertyDeclaration(node)) {
    return createPropertySignatureFromPropertyDeclaration(
      node,
      enums,
      models,
      checker,
    );
  }

  throw new Error(`unsupported class member: ${ts.SyntaxKind[node.kind]}`);
}

function createPropertySignatureFromPropertyDeclaration(
  node: ts.PropertyDeclaration,
  enums: Map<string, EnumState>,
  models: Map<string, ts.ClassDeclaration>,
  checker: ts.TypeChecker,
): ts.PropertySignature {
  if (!node.type) {
    throw new Error("property type is undefined");
  }

  return ts.factory.createPropertySignature(
    undefined,
    clonePropertyName(node.name),
    node.questionToken,
    handleTypeNode(node.type, enums, models, checker),
  );
}

function clonePropertyName(name: ts.PropertyName): ts.PropertyName {
  if (ts.isIdentifier(name)) {
    return ts.factory.createIdentifier(name.text);
  }

  if (ts.isStringLiteral(name)) {
    return ts.factory.createStringLiteral(name.text);
  }

  if (ts.isNumericLiteral(name)) {
    return ts.factory.createNumericLiteral(name.text);
  }

  throw new Error(`unsupported property name: ${ts.SyntaxKind[name.kind]}`);
}

function handleClassElement(
  node: ts.ClassElement,
  enums: Map<string, EnumState>,
  models: Map<string, ts.ClassDeclaration>,
  checker: ts.TypeChecker,
): ts.ClassElement {
  if (ts.isPropertyDeclaration(node)) {
    return handlePropertyDeclaration(node, enums, models, checker);
  }

  throw new Error(`unsupported error ${ts.SyntaxKind[node.kind]}`);
}

function handlePropertyDeclaration(
  node: ts.PropertyDeclaration,
  enums: Map<string, EnumState>,
  models: Map<string, ts.ClassDeclaration>,
  checker: ts.TypeChecker,
): ts.PropertyDeclaration {
  if (!node.type) {
    throw new Error(`node type undefined : ${node}`);
  }

  const nextType = handleTypeNode(node.type, enums, models, checker);

  return ts.factory.updatePropertyDeclaration(
    node,
    node.modifiers,
    node.name,
    node.questionToken ?? node.exclamationToken,
    nextType,
    node.initializer,
  );
}

function handleTypeNode(
  node: ts.TypeNode,
  enums: Map<string, EnumState>,
  models: Map<string, ts.ClassDeclaration>,
  checker: ts.TypeChecker,
): ts.TypeNode {
  if (isSkippableNode(node)) {
    return node;
  }

  if (ts.isTypeReferenceNode(node)) {
    return handleTypeReferenceNode(node, enums, models, checker);
  }

  if (ts.isArrayTypeNode(node)) {
    return ts.factory.updateArrayTypeNode(
      node,
      handleTypeNode(node.elementType, enums, models, checker),
    );
  }

  if (ts.isUnionTypeNode(node)) {
    return ts.factory.updateUnionTypeNode(
      node,
      ts.factory.createNodeArray(
        node.types.map((type) => handleTypeNode(type, enums, models, checker)),
      ),
    );
  }

  if (ts.isIndexedAccessTypeNode(node)) {
    return ts.factory.updateIndexedAccessTypeNode(
      node,
      handleTypeNode(node.objectType, enums, models, checker),
      node.indexType,
    );
  }

  throw new Error(`unsupported error : ${ts.SyntaxKind[node.kind]}`);
}

function isSkippableNode(node: ts.TypeNode) {
  return (
    (ts.isToken(node) &&
      (node.kind === ts.SyntaxKind.StringKeyword ||
        node.kind === ts.SyntaxKind.NumberKeyword ||
        node.kind === ts.SyntaxKind.BooleanKeyword ||
        node.kind === ts.SyntaxKind.UnknownKeyword)) ||
    ts.isTypeOperatorNode(node)
  );
}

function isEnum(
  identifier: ts.Identifier,
  checker: ts.TypeChecker,
  enumDecl: ts.EnumDeclaration,
) {
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
}

function isModel(
  identifier: ts.Identifier,
  checker: ts.TypeChecker,
  modelDecl: ts.ClassDeclaration,
) {
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
}

function getTypeAliasType(
  identifier: ts.Identifier,
  checker: ts.TypeChecker,
): ts.TypeNode | undefined {
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
}

function handleTypeReferenceNode(
  node: ts.TypeReferenceNode,
  enums: Map<string, EnumState>,
  models: Map<string, ts.ClassDeclaration>,
  checker: ts.TypeChecker,
): ts.TypeNode {
  const typeArgs = node.typeArguments
    ? ts.factory.createNodeArray(
        node.typeArguments.map((typeArg) =>
          handleTypeNode(typeArg, enums, models, checker),
        ),
      )
    : undefined;

  if (ts.isIdentifier(node.typeName)) {
    return handleIdentifierTypeReference(
      node,
      node.typeName,
      typeArgs,
      enums,
      models,
      checker,
    );
  }

  if (ts.isQualifiedName(node.typeName)) {
    return handleQualifiedNameTypeReference(
      node,
      node.typeName,
      typeArgs,
      enums,
      checker,
    );
  }

  throw new Error(`unsupported error : ${ts.SyntaxKind[node.kind]}`);
}

function handleIdentifierTypeReference(
  node: ts.TypeReferenceNode,
  identifier: ts.Identifier,
  typeArgs: ts.NodeArray<ts.TypeNode> | undefined,
  enums: Map<string, EnumState>,
  models: Map<string, ts.ClassDeclaration>,
  checker: ts.TypeChecker,
): ts.TypeNode {
  const targetEnumState = enums.get(identifier.text);

  if (
    targetEnumState &&
    isEnum(identifier, checker, targetEnumState.declaration)
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

  const targetModelDecl = models.get(identifier.text);

  if (targetModelDecl && isModel(identifier, checker, targetModelDecl)) {
    return ts.factory.updateTypeReferenceNode(
      node,
      ts.factory.createQualifiedName(
        ts.factory.createIdentifier("Models"),
        ts.factory.createIdentifier(identifier.text),
      ),
      typeArgs,
    );
  }

  const aliasType = getTypeAliasType(identifier, checker);

  if (aliasType) {
    return handleTypeNode(aliasType, enums, models, checker);
  }

  return ts.factory.updateTypeReferenceNode(node, identifier, typeArgs);
}

function handleQualifiedNameTypeReference(
  node: ts.TypeReferenceNode,
  qualifiedName: ts.QualifiedName,
  typeArgs: ts.NodeArray<ts.TypeNode> | undefined,
  enums: Map<string, EnumState>,
  checker: ts.TypeChecker,
): ts.TypeNode {
  const left = qualifiedName.left;

  if (ts.isIdentifier(left)) {
    const targetEnumState = enums.get(left.text);

    if (targetEnumState && isEnum(left, checker, targetEnumState.declaration)) {
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
}
