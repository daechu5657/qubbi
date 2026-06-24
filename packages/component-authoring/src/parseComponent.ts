import * as Contract from "@qubbi/contract";
import * as Openapi from "@qubbi/openapi";
import fg from "fast-glob";
import { existsSync } from "node:fs";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import {
  ArrowFunction,
  BindingElement,
  CallExpression,
  EnumDeclaration,
  EnumMember,
  Expression,
  FunctionDeclaration,
  FunctionExpression,
  JsxChild,
  JsxElement,
  JsxFragment,
  JsxSelfClosingElement,
  Node,
  ParameterDeclaration,
  Project,
  PropertySignature,
  SourceFile,
  SyntaxKind,
  Type,
  TypeNode,
} from "ts-morph";

const PACKAGE_NAME = "@qubbi/component-authoring";
const CREATE_COMPONENT_FUNCTION_NAME = "createComponent";
const DEFINE_FUNCTION_NAME = "define";
const CONTRACT_PACKAGE_ROOT_PATH = path.dirname(
  require.resolve("@qubbi/contract/package.json"),
);
const CONTRACT_PACKAGE_ENUM_FILE_SUFFIX = ".enum.d.ts";
const MAX_PROP_PARSE_DEPTH = 20;

const contractPackageProject = new Project({
  compilerOptions: {
    moduleResolution: 2,
    allowJs: true,
  },
});

type ComponentFunction =
  | FunctionDeclaration
  | FunctionExpression
  | ArrowFunction;
type JsxPartNode = JsxElement | JsxSelfClosingElement;
type JsxRootNode = JsxPartNode | JsxFragment;
type ComponentModel = Openapi.Models.ComponentManifestComponentModel;
type ComponentPropModel = Openapi.Models.ComponentManifestPropModel;
type ComponentPropValueModel = ComponentPropModel["value"];
type ComponentPartModel = Openapi.Models.ComponentManifestPartModel;
type ComponentStyleModel = Openapi.Models.ComponentManifestStyleModel;
type CreateComponentArgumentValue = Pick<
  ComponentModel,
  "name" | "placementType" | "variants"
>;

type ParsePropContext = {
  depth: number;
  maxDepth: number;
  visitedTypeNames: Set<string>;
};

type ParsePartContext = {
  factoryKey: string;
  variantKeys: string[];
  variantStyleMap: Map<string, ComponentStyleModel[]>;
  styleValueMap: Map<string, ComponentStyleModel[]>;
};

async function parseComponent({
  cwd,
  pattern,
  out,
}: {
  cwd: string;
  pattern: string;
  out: string;
}) {
  const files = await fg(pattern, {
    cwd,
    absolute: true,
    onlyFiles: true,
  });

  const project = createProject(cwd);
  const sourceFiles = project.addSourceFilesAtPaths(files);
  const components: ComponentModel[] = [];

  for (const sourceFile of sourceFiles) {
    const callExpressions = sourceFile.getDescendantsOfKind(
      SyntaxKind.CallExpression,
    );
    const factoryMap = collectFactoryMap(sourceFile, callExpressions);
    const componentMap = collectComponentMap(callExpressions, factoryMap);
    const createComponentArgumentMap = new Map<
      string,
      CreateComponentArgumentValue
    >();

    for (const [factoryKey, callExpression] of factoryMap) {
      createComponentArgumentMap.set(
        factoryKey,
        await parseCreateComponentArguments(factoryKey, callExpression),
      );
    }

    for (const [
      factoryKey,
      createComponentArgument,
    ] of createComponentArgumentMap) {
      const component = componentMap.get(factoryKey);

      if (!component) {
        throw new Error(
          `Missing ${DEFINE_FUNCTION_NAME}() for component factory: ${factoryKey}`,
        );
      }

      components.push({
        ...createComponentArgument,
        props: parseComponentProps(component),
        parts: parseComponentParts(
          component,
          factoryKey,
          createComponentArgument.variants.map((variant) => variant.key),
        ),
      });
    }
  }

  const result = {
    generatedAt: new Date().toISOString(),
    files: files.map((file) => path.relative(cwd, file).replaceAll("\\", "/")),
    components,
  };

  const outPath = path.isAbsolute(out) ? out : path.resolve(cwd, out);
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, JSON.stringify(result, null, 2), "utf8");

  return result;
}

function createProject(cwd: string) {
  const tsConfigFilePath = path.resolve(cwd, "tsconfig.json");

  if (existsSync(tsConfigFilePath)) {
    return new Project({
      tsConfigFilePath,
      skipAddingFilesFromTsConfig: true,
    });
  }

  return new Project();
}

function collectFactoryMap(
  sourceFile: SourceFile,
  callExpressions: CallExpression[],
) {
  const factoryMap = new Map<string, CallExpression>();

  for (const callExpression of callExpressions) {
    if (!isCreateComponentCall(callExpression)) {
      continue;
    }

    const variableDeclaration = callExpression.getFirstAncestorByKind(
      SyntaxKind.VariableDeclaration,
    );

    if (!variableDeclaration) {
      throw new Error(
        `${CREATE_COMPONENT_FUNCTION_NAME}() must be assigned to a variable in ${sourceFile.getBaseName()}`,
      );
    }

    factoryMap.set(variableDeclaration.getName(), callExpression);
  }

  return factoryMap;
}

function isCreateComponentCall(callExpression: CallExpression): boolean {
  const expression = callExpression.getExpression();

  if (expression.isKind(SyntaxKind.Identifier)) {
    const symbol = expression.getSymbol();
    if (!symbol) {
      return false;
    }

    return symbol
      .getDeclarations()
      .filter((declaration) => declaration.isKind(SyntaxKind.ImportSpecifier))
      .some((declaration) => {
        const importDeclaration = declaration.getFirstAncestorByKind(
          SyntaxKind.ImportDeclaration,
        );

        return (
          declaration.getName() === CREATE_COMPONENT_FUNCTION_NAME &&
          importDeclaration?.getModuleSpecifierValue() === PACKAGE_NAME
        );
      });
  }

  if (
    expression.isKind(SyntaxKind.PropertyAccessExpression) &&
    expression.getName() === CREATE_COMPONENT_FUNCTION_NAME
  ) {
    const namespaceExpression = expression.getExpression();
    if (!namespaceExpression.isKind(SyntaxKind.Identifier)) {
      return false;
    }

    const symbol = namespaceExpression.getSymbol();
    if (!symbol) {
      return false;
    }

    return symbol
      .getDeclarations()
      .filter((declaration) => declaration.isKind(SyntaxKind.NamespaceImport))
      .some((declaration) => {
        const importDeclaration = declaration.getFirstAncestorByKind(
          SyntaxKind.ImportDeclaration,
        );

        return importDeclaration?.getModuleSpecifierValue() === PACKAGE_NAME;
      });
  }

  return false;
}

function collectComponentMap(
  callExpressions: CallExpression[],
  factoryMap: Map<string, CallExpression>,
) {
  const componentMap = new Map<string, ComponentFunction>();

  for (const callExpression of callExpressions) {
    const expression = callExpression.getExpression();

    if (!expression.isKind(SyntaxKind.PropertyAccessExpression)) {
      continue;
    }

    const factoryExpression = expression.getExpression();
    if (!factoryExpression.isKind(SyntaxKind.Identifier)) {
      continue;
    }

    const factoryKey = factoryExpression.getText();
    if (
      !factoryMap.has(factoryKey) ||
      expression.getName() !== DEFINE_FUNCTION_NAME
    ) {
      continue;
    }

    if (componentMap.has(factoryKey)) {
      throw new Error(
        `Duplicate ${DEFINE_FUNCTION_NAME}() for component factory: ${factoryKey}`,
      );
    }

    const [defineArgument] = callExpression.getArguments();
    const component = defineArgument
      ? resolveDefineComponentArgument(defineArgument)
      : undefined;

    if (!component) {
      throw new Error(
        `Cannot resolve ${DEFINE_FUNCTION_NAME}() argument for component factory: ${factoryKey}`,
      );
    }

    componentMap.set(factoryKey, component);
  }

  return componentMap;
}

function resolveDefineComponentArgument(
  argument: Node,
): ComponentFunction | undefined {
  if (
    argument.isKind(SyntaxKind.ArrowFunction) ||
    argument.isKind(SyntaxKind.FunctionExpression)
  ) {
    return argument;
  }

  if (!argument.isKind(SyntaxKind.Identifier)) {
    return undefined;
  }

  const symbol = argument.getSymbol();
  if (!symbol) {
    return undefined;
  }

  for (const declaration of symbol.getDeclarations()) {
    if (declaration.isKind(SyntaxKind.FunctionDeclaration)) {
      return declaration;
    }

    if (declaration.isKind(SyntaxKind.VariableDeclaration)) {
      const initializer = declaration.getInitializer();

      if (
        initializer?.isKind(SyntaxKind.ArrowFunction) ||
        initializer?.isKind(SyntaxKind.FunctionExpression)
      ) {
        return initializer;
      }
    }
  }

  return undefined;
}

async function parseCreateComponentArguments(
  factoryKey: string,
  callExpression: CallExpression,
): Promise<CreateComponentArgumentValue> {
  const [factoryArgument] = callExpression.getArguments();

  if (!factoryArgument?.isKind(SyntaxKind.ObjectLiteralExpression)) {
    throw new Error(
      `${CREATE_COMPONENT_FUNCTION_NAME}() config must be an object literal: ${factoryKey}`,
    );
  }

  const createComponentArgumentValue = {
    variants: [] as CreateComponentArgumentValue["variants"],
  } as CreateComponentArgumentValue;

  for (const property of factoryArgument.getProperties()) {
    if (!property.isKind(SyntaxKind.PropertyAssignment)) {
      throw new Error(
        `${CREATE_COMPONENT_FUNCTION_NAME}() config only supports property assignments: ${factoryKey}`,
      );
    }

    const propertyName = property
      .getNameNode()
      .getText() as keyof CreateComponentArgumentValue;
    const value = property.getInitializer();

    if (!value) {
      throw new Error(
        `Missing ${CREATE_COMPONENT_FUNCTION_NAME}() config value "${propertyName}": ${factoryKey}`,
      );
    }

    if (propertyName === "name") {
      if (!value.isKind(SyntaxKind.StringLiteral)) {
        throw new Error(
          `Component name must be a string literal: ${factoryKey}`,
        );
      }

      const name = value.getLiteralValue();
      if (!name.length) {
        throw new Error(`Component name cannot be empty: ${factoryKey}`);
      }

      createComponentArgumentValue.name = name;
      continue;
    }

    if (propertyName === "placementType") {
      if (!value.isKind(SyntaxKind.PropertyAccessExpression)) {
        throw new Error(
          `Component placementType must be an enum member: ${factoryKey}`,
        );
      }

      const placementType = await resolveEnumMemberValue(value.getSymbol());
      if (placementType === undefined) {
        throw new Error(
          `Cannot resolve placementType enum value: ${factoryKey}`,
        );
      }

      createComponentArgumentValue.placementType =
        placementType as CreateComponentArgumentValue["placementType"];
      continue;
    }

    if (propertyName === "variants") {
      if (!value.isKind(SyntaxKind.ArrayLiteralExpression)) {
        throw new Error(
          `Component variants must be an array literal: ${factoryKey}`,
        );
      }

      createComponentArgumentValue.variants = value
        .getElements()
        .map((element, order) => {
          if (!element.isKind(SyntaxKind.StringLiteral)) {
            throw new Error(
              `Component variants only support string literals: ${factoryKey}`,
            );
          }

          return {
            key: element.getLiteralValue(),
            order,
          };
        });

      continue;
    }

    throw new Error(
      `Disallowed ${CREATE_COMPONENT_FUNCTION_NAME}() config property "${propertyName}": ${factoryKey}`,
    );
  }

  if (!createComponentArgumentValue.name) {
    throw new Error(`Component name is required: ${factoryKey}`);
  }

  if (!createComponentArgumentValue.placementType) {
    throw new Error(`Component placementType is required: ${factoryKey}`);
  }

  return createComponentArgumentValue;
}

async function resolveEnumMemberValue(
  symbol: ReturnType<Expression["getSymbol"]>,
) {
  if (!symbol) {
    return undefined;
  }

  for (const declaration of symbol.getDeclarations()) {
    if (declaration.isKind(SyntaxKind.EnumMember)) {
      return getEnumValue(declaration);
    }
  }

  return undefined;
}

function parseComponentProps(
  component: ComponentFunction,
): ComponentPropModel[] {
  const parameters = component.getParameters();

  if (!parameters.length) {
    return [];
  }

  if (parameters.length > 1) {
    throw new Error(
      "Component function must receive only one props parameter.",
    );
  }

  const [parameter] = parameters;
  const typeNode = parameter.getTypeNode();

  if (!typeNode) {
    return [];
  }

  const defaultValueMap = collectParameterDefaultValueMap(parameter);
  return parsePropModelsFromTypeNode(typeNode).map((prop) => {
    if (!defaultValueMap.has(prop.key)) {
      return prop;
    }

    return {
      ...prop,
      value: applyDefaultValue(prop.value, defaultValueMap.get(prop.key)),
    };
  });
}

function collectParameterDefaultValueMap(parameter: ParameterDeclaration) {
  const defaultValueMap = new Map<string, unknown>();
  const nameNode = parameter.getNameNode();

  if (!nameNode.isKind(SyntaxKind.ObjectBindingPattern)) {
    return defaultValueMap;
  }

  for (const element of nameNode.getElements()) {
    const initializer = element.getInitializer();
    if (!initializer) {
      continue;
    }

    defaultValueMap.set(
      getBindingElementKey(element),
      parseDefaultValue(initializer),
    );
  }

  return defaultValueMap;
}

function getBindingElementKey(element: BindingElement): string {
  const propertyNameNode = element.getPropertyNameNode();

  if (propertyNameNode) {
    return normalizePropertyName(propertyNameNode.getText());
  }

  return element.getName();
}

function parseDefaultValue(expression: Expression): unknown {
  if (expression.isKind(SyntaxKind.StringLiteral)) {
    return expression.getLiteralValue();
  }

  if (expression.isKind(SyntaxKind.NoSubstitutionTemplateLiteral)) {
    return expression.getLiteralText();
  }

  if (expression.isKind(SyntaxKind.NumericLiteral)) {
    return Number(expression.getText());
  }

  if (expression.isKind(SyntaxKind.TrueKeyword)) {
    return true;
  }

  if (expression.isKind(SyntaxKind.FalseKeyword)) {
    return false;
  }

  if (expression.isKind(SyntaxKind.ArrayLiteralExpression)) {
    return expression
      .getElements()
      .map((element) => parseDefaultValue(element));
  }

  if (expression.isKind(SyntaxKind.ObjectLiteralExpression)) {
    return Object.fromEntries(
      expression
        .getProperties()
        .filter((property) => property.isKind(SyntaxKind.PropertyAssignment))
        .map((property) => [
          normalizePropertyName(property.getNameNode().getText()),
          parseDefaultValue(property.getInitializerOrThrow()),
        ]),
    );
  }

  if (expression.isKind(SyntaxKind.ParenthesizedExpression)) {
    return parseDefaultValue(expression.getExpression());
  }

  return undefined;
}

function applyDefaultValue(
  value: ComponentPropValueModel,
  defaultValue: unknown,
): ComponentPropValueModel {
  if (defaultValue === undefined) {
    return value;
  }

  if (
    (value.type === Contract.Enums.ComponentPropType.String ||
      value.type === Contract.Enums.ComponentPropType.StringEnum) &&
    typeof defaultValue === "string"
  ) {
    return { ...value, defaultValue };
  }

  if (
    (value.type === Contract.Enums.ComponentPropType.Number ||
      value.type === Contract.Enums.ComponentPropType.NumberEnum) &&
    typeof defaultValue === "number"
  ) {
    return { ...value, defaultValue };
  }

  if (
    value.type === Contract.Enums.ComponentPropType.Boolean &&
    typeof defaultValue === "boolean"
  ) {
    return { ...value, defaultValue };
  }

  if (
    value.type === Contract.Enums.ComponentPropType.Array &&
    Array.isArray(defaultValue)
  ) {
    return { ...value, defaultValue: defaultValue as Record<string, never>[] };
  }

  return value;
}

function parsePropModelsFromTypeNode(typeNode: TypeNode): ComponentPropModel[] {
  const value = parsePropValue(typeNode, createPropParseContext());

  if (value.type !== Contract.Enums.ComponentPropType.Object) {
    return [];
  }

  return value.properties;
}

function parsePropSignature(
  property: PropertySignature,
  ctx = createPropParseContext(),
): ComponentPropModel {
  return {
    key: normalizePropertyName(property.getName()),
    required: !property.hasQuestionToken(),
    value: parsePropValue(property.getTypeNode(), ctx),
  };
}

function parsePropValue(
  typeNode: TypeNode | undefined,
  ctx: ParsePropContext,
): ComponentPropValueModel {
  if (!typeNode) {
    return unknownValue();
  }

  if (ctx.depth > ctx.maxDepth) {
    return unknownValue(typeNode.getText());
  }

  if (typeNode.isKind(SyntaxKind.ParenthesizedType)) {
    return parsePropValue(typeNode.getTypeNode(), ctx);
  }

  if (typeNode.isKind(SyntaxKind.StringKeyword)) {
    return { type: Contract.Enums.ComponentPropType.String };
  }

  if (typeNode.isKind(SyntaxKind.NumberKeyword)) {
    return { type: Contract.Enums.ComponentPropType.Number };
  }

  if (typeNode.isKind(SyntaxKind.BooleanKeyword)) {
    return { type: Contract.Enums.ComponentPropType.Boolean };
  }

  if (typeNode.isKind(SyntaxKind.LiteralType)) {
    return parseLiteralType(typeNode);
  }

  if (typeNode.isKind(SyntaxKind.UnionType)) {
    return parseUnionType(typeNode, ctx);
  }

  if (typeNode.isKind(SyntaxKind.ArrayType)) {
    return {
      type: Contract.Enums.ComponentPropType.Array,
      item: parsePropValue(
        typeNode.getElementTypeNode(),
        nextPropParseContext(ctx),
      ),
    };
  }

  if (typeNode.isKind(SyntaxKind.TupleType)) {
    return parseTupleType(typeNode, ctx);
  }

  if (typeNode.isKind(SyntaxKind.TypeLiteral)) {
    return {
      type: Contract.Enums.ComponentPropType.Object,
      properties: typeNode
        .getMembers()
        .filter((member): member is PropertySignature =>
          member.isKind(SyntaxKind.PropertySignature),
        )
        .map((member) => parsePropSignature(member, nextPropParseContext(ctx))),
    };
  }

  if (typeNode.isKind(SyntaxKind.TypeOperator)) {
    if (typeNode.getOperator() === SyntaxKind.ReadonlyKeyword) {
      return parsePropValue(typeNode.getTypeNode(), nextPropParseContext(ctx));
    }

    return parseTypeFallback(typeNode);
  }

  if (typeNode.isKind(SyntaxKind.IntersectionType)) {
    return parseIntersectionType(typeNode, ctx);
  }

  if (typeNode.isKind(SyntaxKind.TypeReference)) {
    return (
      resolveTypeReferenceNode(typeNode, ctx) ?? parseTypeFallback(typeNode)
    );
  }

  if (typeNode.isKind(SyntaxKind.IndexedAccessType)) {
    return (
      resolveIndexedAccessTypeNode(typeNode, ctx) ?? parseTypeFallback(typeNode)
    );
  }

  return parseTypeFallback(typeNode);
}

function createPropParseContext(): ParsePropContext {
  return {
    depth: 0,
    maxDepth: MAX_PROP_PARSE_DEPTH,
    visitedTypeNames: new Set<string>(),
  };
}

function nextPropParseContext(
  ctx: ParsePropContext,
  typeName?: string,
): ParsePropContext {
  const visitedTypeNames = new Set(ctx.visitedTypeNames);

  if (typeName) {
    visitedTypeNames.add(typeName);
  }

  return {
    ...ctx,
    depth: ctx.depth + 1,
    visitedTypeNames,
  };
}

function parseLiteralType(typeNode: TypeNode): ComponentPropValueModel {
  if (!typeNode.isKind(SyntaxKind.LiteralType)) {
    return parseTypeFallback(typeNode);
  }

  const literal = typeNode.getLiteral();

  if (literal.isKind(SyntaxKind.StringLiteral)) {
    return {
      type: Contract.Enums.ComponentPropType.StringEnum,
      values: [literal.getLiteralValue()],
    };
  }

  if (literal.isKind(SyntaxKind.NumericLiteral)) {
    return {
      type: Contract.Enums.ComponentPropType.NumberEnum,
      values: [Number(literal.getText())],
    };
  }

  if (
    literal.isKind(SyntaxKind.TrueKeyword) ||
    literal.isKind(SyntaxKind.FalseKeyword)
  ) {
    return { type: Contract.Enums.ComponentPropType.Boolean };
  }

  return parseTypeFallback(typeNode);
}

function parseUnionType(
  typeNode: TypeNode,
  ctx: ParsePropContext,
): ComponentPropValueModel {
  if (!typeNode.isKind(SyntaxKind.UnionType)) {
    return parseTypeFallback(typeNode);
  }

  const nodes = typeNode
    .getTypeNodes()
    .filter(
      (node) =>
        !node.isKind(SyntaxKind.UndefinedKeyword) &&
        !node.isKind(SyntaxKind.NullKeyword),
    );

  if (nodes.length === 1) {
    return parsePropValue(nodes[0], nextPropParseContext(ctx));
  }

  const literalValues = nodes.map((node) => parseLiteralType(node));
  const stringEnumValues = literalValues.flatMap((value) =>
    value.type === Contract.Enums.ComponentPropType.StringEnum
      ? value.values
      : [],
  );
  const numberEnumValues = literalValues.flatMap((value) =>
    value.type === Contract.Enums.ComponentPropType.NumberEnum
      ? value.values
      : [],
  );
  const booleanLiteralCount = literalValues.filter(
    (value) => value.type === Contract.Enums.ComponentPropType.Boolean,
  ).length;

  if (stringEnumValues.length === nodes.length) {
    return {
      type: Contract.Enums.ComponentPropType.StringEnum,
      values: stringEnumValues,
    };
  }

  if (numberEnumValues.length === nodes.length) {
    return {
      type: Contract.Enums.ComponentPropType.NumberEnum,
      values: numberEnumValues,
    };
  }

  if (booleanLiteralCount === nodes.length) {
    return { type: Contract.Enums.ComponentPropType.Boolean };
  }

  return parseTypeFallback(typeNode);
}

function parseTupleType(
  typeNode: TypeNode,
  ctx: ParsePropContext,
): ComponentPropValueModel {
  if (!typeNode.isKind(SyntaxKind.TupleType)) {
    return parseTypeFallback(typeNode);
  }

  const elementValues = typeNode
    .getElements()
    .map((element) => parsePropValue(element, nextPropParseContext(ctx)));

  if (!elementValues.length) {
    return {
      type: Contract.Enums.ComponentPropType.Array,
      item: unknownValue(),
    };
  }

  const [firstValue] = elementValues;
  const sameType = elementValues.every(
    (value) => value.type === firstValue.type,
  );

  return {
    type: Contract.Enums.ComponentPropType.Array,
    item: sameType ? firstValue : unknownValue(typeNode.getText()),
  };
}

function parseIntersectionType(
  typeNode: TypeNode,
  ctx: ParsePropContext,
): ComponentPropValueModel {
  if (!typeNode.isKind(SyntaxKind.IntersectionType)) {
    return parseTypeFallback(typeNode);
  }

  const objectValues = typeNode
    .getTypeNodes()
    .map((node) => parsePropValue(node, nextPropParseContext(ctx)));

  if (
    objectValues.every(
      (value) => value.type === Contract.Enums.ComponentPropType.Object,
    )
  ) {
    return {
      type: Contract.Enums.ComponentPropType.Object,
      properties: objectValues.flatMap((value) =>
        value.type === Contract.Enums.ComponentPropType.Object
          ? value.properties
          : [],
      ),
    };
  }

  return parseTypeFallback(typeNode);
}

function resolveTypeReferenceNode(
  typeNode: TypeNode,
  ctx: ParsePropContext,
): ComponentPropValueModel | undefined {
  if (!typeNode.isKind(SyntaxKind.TypeReference)) {
    return undefined;
  }

  if (isStylePropertiesType(typeNode.getType())) {
    return { type: Contract.Enums.ComponentPropType.StyleProperties };
  }

  const typeName = typeNode.getTypeName().getText();

  if (typeName === "Array" || typeName === "ReadonlyArray") {
    const [itemTypeNode] = typeNode.getTypeArguments();

    return {
      type: Contract.Enums.ComponentPropType.Array,
      item: parsePropValue(itemTypeNode, nextPropParseContext(ctx)),
    };
  }

  const symbol =
    typeNode.getType().getAliasSymbol() ??
    typeNode.getType().getSymbol() ??
    typeNode.getTypeName().getSymbol();

  const symbolName = symbol?.getName();

  if (symbolName && ctx.visitedTypeNames.has(symbolName)) {
    return unknownValue(typeNode.getText());
  }

  const declaration = symbol?.getDeclarations()[0];
  if (!declaration) {
    return undefined;
  }

  const nextContext = nextPropParseContext(ctx, symbolName);

  if (declaration.isKind(SyntaxKind.InterfaceDeclaration)) {
    return {
      type: Contract.Enums.ComponentPropType.Object,
      properties: declaration
        .getProperties()
        .map((property) => parsePropSignature(property, nextContext)),
    };
  }

  if (declaration.isKind(SyntaxKind.TypeAliasDeclaration)) {
    const aliasTypeNode = declaration.getTypeNode();

    return aliasTypeNode
      ? parsePropValue(aliasTypeNode, nextContext)
      : unknownValue(typeNode.getText());
  }

  return undefined;
}

function resolveIndexedAccessTypeNode(
  typeNode: TypeNode,
  ctx: ParsePropContext,
): ComponentPropValueModel | undefined {
  if (!typeNode.isKind(SyntaxKind.IndexedAccessType)) {
    return undefined;
  }

  const keys = resolveIndexedAccessKeys(typeNode.getIndexTypeNode(), ctx);
  if (!keys.length) {
    return parseTypeFallback(typeNode);
  }

  const objectValue = parsePropValue(
    typeNode.getObjectTypeNode(),
    nextPropParseContext(ctx),
  );

  if (objectValue.type !== Contract.Enums.ComponentPropType.Object) {
    return parseTypeFallback(typeNode);
  }

  const matchedProperties = keys
    .map((key) =>
      objectValue.properties.find((property) => property.key === key),
    )
    .filter((property): property is ComponentPropModel => Boolean(property));

  if (!matchedProperties.length) {
    return parseTypeFallback(typeNode);
  }

  if (matchedProperties.length === 1) {
    return matchedProperties[0].value;
  }

  return mergeIndexedAccessUnionValues(
    matchedProperties.map((property) => property.value),
    typeNode,
  );
}

function resolveIndexedAccessKeys(
  typeNode: TypeNode,
  ctx: ParsePropContext,
): string[] {
  if (typeNode.isKind(SyntaxKind.ParenthesizedType)) {
    return resolveIndexedAccessKeys(typeNode.getTypeNode(), ctx);
  }

  if (typeNode.isKind(SyntaxKind.LiteralType)) {
    const literal = typeNode.getLiteral();

    if (literal.isKind(SyntaxKind.StringLiteral)) {
      return [literal.getLiteralValue()];
    }

    if (literal.isKind(SyntaxKind.NumericLiteral)) {
      return [literal.getText()];
    }

    return [];
  }

  if (typeNode.isKind(SyntaxKind.UnionType)) {
    return typeNode
      .getTypeNodes()
      .flatMap((node) => resolveIndexedAccessKeys(node, ctx));
  }

  if (typeNode.isKind(SyntaxKind.TypeReference)) {
    const resolved = resolveTypeReferenceToTypeNode(typeNode);
    return resolved ? resolveIndexedAccessKeys(resolved, ctx) : [];
  }

  if (typeNode.isKind(SyntaxKind.IndexedAccessType)) {
    const resolved = resolveIndexedAccessTypeNode(typeNode, ctx);

    if (resolved?.type === Contract.Enums.ComponentPropType.StringEnum) {
      return resolved.values;
    }

    return [];
  }

  return [];
}

function resolveTypeReferenceToTypeNode(
  typeNode: TypeNode,
): TypeNode | undefined {
  if (!typeNode.isKind(SyntaxKind.TypeReference)) {
    return undefined;
  }

  const symbol =
    typeNode.getType().getAliasSymbol() ??
    typeNode.getType().getSymbol() ??
    typeNode.getTypeName().getSymbol();

  const declaration = symbol?.getDeclarations()[0];
  if (!declaration?.isKind(SyntaxKind.TypeAliasDeclaration)) {
    return undefined;
  }

  return declaration.getTypeNode();
}

function mergeIndexedAccessUnionValues(
  values: ComponentPropValueModel[],
  fallbackNode: TypeNode,
): ComponentPropValueModel {
  if (
    values.every(
      (value) =>
        value.type === Contract.Enums.ComponentPropType.String ||
        value.type === Contract.Enums.ComponentPropType.StringEnum,
    )
  ) {
    return {
      type: Contract.Enums.ComponentPropType.StringEnum,
      values: values.flatMap((value) =>
        value.type === Contract.Enums.ComponentPropType.StringEnum
          ? value.values
          : [],
      ),
    };
  }

  if (
    values.every(
      (value) =>
        value.type === Contract.Enums.ComponentPropType.Number ||
        value.type === Contract.Enums.ComponentPropType.NumberEnum,
    )
  ) {
    return {
      type: Contract.Enums.ComponentPropType.NumberEnum,
      values: values.flatMap((value) =>
        value.type === Contract.Enums.ComponentPropType.NumberEnum
          ? value.values
          : [],
      ),
    };
  }

  return parseTypeFallback(fallbackNode);
}

function parseTypeFallback(typeNode: TypeNode): ComponentPropValueModel {
  const type = typeNode.getType();

  if (isStylePropertiesType(type)) {
    return { type: Contract.Enums.ComponentPropType.StyleProperties };
  }

  if (type.isString()) {
    return { type: Contract.Enums.ComponentPropType.String };
  }

  if (type.isNumber()) {
    return { type: Contract.Enums.ComponentPropType.Number };
  }

  if (type.isBoolean()) {
    return { type: Contract.Enums.ComponentPropType.Boolean };
  }

  if (type.isStringLiteral()) {
    return {
      type: Contract.Enums.ComponentPropType.StringEnum,
      values: [String(type.getLiteralValue())],
    };
  }

  if (type.isNumberLiteral()) {
    return {
      type: Contract.Enums.ComponentPropType.NumberEnum,
      values: [Number(type.getLiteralValue())],
    };
  }

  if (type.isBooleanLiteral()) {
    return { type: Contract.Enums.ComponentPropType.Boolean };
  }

  return unknownValue(typeNode.getText());
}

function unknownValue(rawType?: string): ComponentPropValueModel {
  return {
    type: Contract.Enums.ComponentPropType.Unknown,
    rawType,
  };
}

function parseComponentParts(
  component: ComponentFunction,
  factoryKey: string,
  variantKeys: string[],
): ComponentPartModel[] {
  const context = createParsePartContext(component, factoryKey, variantKeys);

  return getComponentJsxRoots(component).flatMap((root, order) =>
    root.isKind(SyntaxKind.JsxFragment)
      ? parseJsxChildren(root.getJsxChildren(), context)
      : [parseJsxPart(root, order, context)],
  );
}

function createParsePartContext(
  component: ComponentFunction,
  factoryKey: string,
  variantKeys: string[],
): ParsePartContext {
  const context: ParsePartContext = {
    factoryKey,
    variantKeys,
    variantStyleMap: new Map<string, ComponentStyleModel[]>(),
    styleValueMap: new Map<string, ComponentStyleModel[]>(),
  };

  collectVariantStyleMap(component, context);
  collectStyleValueMap(component, context);

  return context;
}

function collectVariantStyleMap(
  component: ComponentFunction,
  context: ParsePartContext,
) {
  for (const variableDeclaration of component.getDescendantsOfKind(
    SyntaxKind.VariableDeclaration,
  )) {
    const initializer = variableDeclaration.getInitializer();
    if (!initializer?.isKind(SyntaxKind.CallExpression)) {
      continue;
    }

    if (!isFactoryUseVariantStyleCall(initializer, context.factoryKey)) {
      continue;
    }

    context.variantStyleMap.set(
      variableDeclaration.getName(),
      parseUseVariantStyleCall(initializer, context.variantKeys),
    );
  }
}

function collectStyleValueMap(
  component: ComponentFunction,
  context: ParsePartContext,
) {
  for (const variableDeclaration of component.getDescendantsOfKind(
    SyntaxKind.VariableDeclaration,
  )) {
    const initializer = variableDeclaration.getInitializer();
    if (!initializer) {
      continue;
    }

    const styles = parseStyleExpression(initializer, context);
    if (styles.length) {
      context.styleValueMap.set(variableDeclaration.getName(), styles);
    }
  }
}

function isFactoryUseVariantStyleCall(
  callExpression: CallExpression,
  factoryKey: string,
): boolean {
  const expression = callExpression.getExpression();

  if (!expression.isKind(SyntaxKind.PropertyAccessExpression)) {
    return false;
  }

  return (
    expression.getName() === "useVariantStyle" &&
    expression.getExpression().getText() === factoryKey
  );
}

function parseUseVariantStyleCall(
  callExpression: CallExpression,
  variantKeys: string[],
): ComponentStyleModel[] {
  const [defaultStyleArgument, variantStyleArgument] =
    callExpression.getArguments();
  const defaultStyleMap = defaultStyleArgument?.isKind(
    SyntaxKind.ObjectLiteralExpression,
  )
    ? parseStyleObjectLiteralToMap(defaultStyleArgument)
    : new Map<string, string>();
  const variantStyleMap = variantStyleArgument?.isKind(
    SyntaxKind.ObjectLiteralExpression,
  )
    ? parseVariantStyleObjectLiteral(variantStyleArgument)
    : new Map<string, Map<string, string>>();
  const resolvedVariantKeys = resolveStyleVariantKeys(
    variantKeys,
    variantStyleMap,
  );

  return resolvedVariantKeys.flatMap((variantKey) => {
    const mergedStyleMap = new Map(defaultStyleMap);
    const styleMap = variantStyleMap.get(variantKey);

    if (styleMap) {
      for (const [cssProperty, rawValue] of styleMap) {
        mergedStyleMap.set(cssProperty, rawValue);
      }
    }

    return styleMapToStyles(variantKey, mergedStyleMap);
  });
}

function resolveStyleVariantKeys(
  variantKeys: string[],
  variantStyleMap: Map<string, Map<string, string>>,
) {
  if (variantKeys.length) {
    return variantKeys;
  }

  if (variantStyleMap.size) {
    return [...variantStyleMap.keys()];
  }

  return ["default"];
}

function parseVariantStyleObjectLiteral(
  objectLiteral: Expression,
): Map<string, Map<string, string>> {
  const variantStyleMap = new Map<string, Map<string, string>>();

  if (!objectLiteral.isKind(SyntaxKind.ObjectLiteralExpression)) {
    return variantStyleMap;
  }

  for (const property of objectLiteral.getProperties()) {
    if (!property.isKind(SyntaxKind.PropertyAssignment)) {
      continue;
    }

    const initializer = property.getInitializer();
    if (!initializer?.isKind(SyntaxKind.ObjectLiteralExpression)) {
      continue;
    }

    variantStyleMap.set(
      normalizePropertyName(property.getNameNode().getText()),
      parseStyleObjectLiteralToMap(initializer),
    );
  }

  return variantStyleMap;
}

function parseStyleExpression(
  expression: Node,
  context: ParsePartContext,
): ComponentStyleModel[] {
  if (expression.isKind(SyntaxKind.ParenthesizedExpression)) {
    return parseStyleExpression(expression.getExpression(), context);
  }

  if (expression.isKind(SyntaxKind.Identifier)) {
    return (
      context.styleValueMap.get(expression.getText()) ??
      context.variantStyleMap.get(expression.getText()) ??
      []
    );
  }

  if (expression.isKind(SyntaxKind.CallExpression)) {
    const callExpression = expression.getExpression();

    if (callExpression.isKind(SyntaxKind.Identifier)) {
      return context.variantStyleMap.get(callExpression.getText()) ?? [];
    }

    return [];
  }

  if (expression.isKind(SyntaxKind.ObjectLiteralExpression)) {
    return parseInlineStyleObjectLiteral(expression, context);
  }

  return [];
}

function parseInlineStyleObjectLiteral(
  objectLiteral: Expression,
  context: ParsePartContext,
): ComponentStyleModel[] {
  const styles: ComponentStyleModel[] = [];

  if (!objectLiteral.isKind(SyntaxKind.ObjectLiteralExpression)) {
    return styles;
  }

  for (const property of objectLiteral.getProperties()) {
    if (property.isKind(SyntaxKind.SpreadAssignment)) {
      styles.push(...parseStyleExpression(property.getExpression(), context));
      continue;
    }

    if (!property.isKind(SyntaxKind.PropertyAssignment)) {
      continue;
    }

    const rawValue = parseCssRawValue(property.getInitializer());
    if (rawValue === undefined) {
      continue;
    }

    styles.push(
      ...createCommonStyles(context.variantKeys, {
        cssProperty: normalizePropertyName(property.getNameNode().getText()),
        rawValue,
      }),
    );
  }

  return mergeStyleEntries(styles);
}

function parseStyleObjectLiteralToMap(
  objectLiteral: Expression,
): Map<string, string> {
  const styleMap = new Map<string, string>();

  if (!objectLiteral.isKind(SyntaxKind.ObjectLiteralExpression)) {
    return styleMap;
  }

  for (const property of objectLiteral.getProperties()) {
    if (!property.isKind(SyntaxKind.PropertyAssignment)) {
      continue;
    }

    const rawValue = parseCssRawValue(property.getInitializer());
    if (rawValue === undefined) {
      continue;
    }

    styleMap.set(
      normalizePropertyName(property.getNameNode().getText()),
      rawValue,
    );
  }

  return styleMap;
}

function parseCssRawValue(
  expression: Expression | undefined,
): string | undefined {
  if (!expression) {
    return undefined;
  }

  if (expression.isKind(SyntaxKind.StringLiteral)) {
    return expression.getLiteralValue();
  }

  if (expression.isKind(SyntaxKind.NoSubstitutionTemplateLiteral)) {
    return expression.getLiteralText();
  }

  if (expression.isKind(SyntaxKind.NumericLiteral)) {
    return expression.getText();
  }

  if (expression.isKind(SyntaxKind.ParenthesizedExpression)) {
    return parseCssRawValue(expression.getExpression());
  }

  return undefined;
}

function styleMapToStyles(
  variantKey: string,
  styleMap: Map<string, string>,
): ComponentStyleModel[] {
  return [...styleMap].map(([cssProperty, rawValue]) => ({
    variantKey,
    cssProperty,
    rawValue,
  }));
}

function createCommonStyles(
  variantKeys: string[],
  style: Pick<ComponentStyleModel, "cssProperty" | "rawValue">,
): ComponentStyleModel[] {
  return resolveStyleVariantKeys(variantKeys, new Map()).map((variantKey) => ({
    variantKey,
    ...style,
  }));
}

function mergeStyleEntries(
  styles: ComponentStyleModel[],
): ComponentStyleModel[] {
  const styleMap = new Map<string, ComponentStyleModel>();

  for (const style of styles) {
    styleMap.set(`${style.variantKey}:${style.cssProperty}`, style);
  }

  return [...styleMap.values()];
}

function getComponentJsxRoots(component: ComponentFunction): JsxRootNode[] {
  const body = component.getBody();

  if (!body) {
    return [];
  }

  if (!body.isKind(SyntaxKind.Block)) {
    return getJsxRootsFromExpression(body);
  }

  for (const statement of body.getStatements()) {
    if (!statement.isKind(SyntaxKind.ReturnStatement)) {
      continue;
    }

    return getJsxRootsFromExpression(statement.getExpression());
  }

  return [];
}

function getJsxRootsFromExpression(
  expression: Node | undefined,
): JsxRootNode[] {
  if (!expression) {
    return [];
  }

  if (expression.isKind(SyntaxKind.ParenthesizedExpression)) {
    return getJsxRootsFromExpression(expression.getExpression());
  }

  if (
    expression.isKind(SyntaxKind.JsxElement) ||
    expression.isKind(SyntaxKind.JsxSelfClosingElement) ||
    expression.isKind(SyntaxKind.JsxFragment)
  ) {
    return [expression];
  }

  return [];
}

function parseJsxChildren(
  children: JsxChild[],
  context: ParsePartContext,
): ComponentPartModel[] {
  const parts: ComponentPartModel[] = [];

  for (const child of children) {
    if (
      child.isKind(SyntaxKind.JsxElement) ||
      child.isKind(SyntaxKind.JsxSelfClosingElement)
    ) {
      parts.push(parseJsxPart(child, parts.length, context));
      continue;
    }

    if (child.isKind(SyntaxKind.JsxFragment)) {
      for (const fragmentPart of parseJsxChildren(
        child.getJsxChildren(),
        context,
      )) {
        parts.push({
          ...fragmentPart,
          order: parts.length,
        });
      }
    }
  }

  return parts;
}

function parseJsxPart(
  node: JsxPartNode,
  order: number,
  context: ParsePartContext,
): ComponentPartModel {
  const tagName = getJsxTagName(node);

  return {
    tagName,
    kind: getComponentPartKind(tagName),
    order,
    styles: parseJsxStyleAttribute(node, context),
    children: node.isKind(SyntaxKind.JsxElement)
      ? parseJsxChildren(node.getJsxChildren(), context)
      : [],
  };
}

function parseJsxStyleAttribute(
  node: JsxPartNode,
  context: ParsePartContext,
): ComponentStyleModel[] {
  const attributedNode = node.isKind(SyntaxKind.JsxElement)
    ? node.getOpeningElement()
    : node;
  const styleAttribute = attributedNode.getAttribute("style");

  if (!styleAttribute?.isKind(SyntaxKind.JsxAttribute)) {
    return [];
  }

  const initializer = styleAttribute.getInitializer();

  if (!initializer) {
    return [];
  }

  if (initializer.isKind(SyntaxKind.JsxExpression)) {
    const expression = initializer.getExpression();

    return expression ? parseStyleExpression(expression, context) : [];
  }

  return [];
}

function getJsxTagName(node: JsxPartNode): string {
  if (node.isKind(SyntaxKind.JsxElement)) {
    return node.getOpeningElement().getTagNameNode().getText();
  }

  return node.getTagNameNode().getText();
}

function getComponentPartKind(tagName: string) {
  const firstCharacter = tagName[0];

  if (firstCharacter && firstCharacter === firstCharacter.toLowerCase()) {
    return Contract.Enums.ComponentPartKind.Element;
  }

  return Contract.Enums.ComponentPartKind.Component;
}

async function getEnumValue(enumMember: EnumMember) {
  const enumDeclaration = enumMember.getParentIfKind(
    SyntaxKind.EnumDeclaration,
  );

  if (!enumDeclaration) {
    throw new Error(`Cannot find EnumDeclaration`);
  }

  const enumFileName = `${pascalToCamel(enumDeclaration.getName())}${CONTRACT_PACKAGE_ENUM_FILE_SUFFIX}`;
  const pattern = `**/${enumFileName}`;

  const [targetEnumFilePath] = await fg(pattern, {
    cwd: CONTRACT_PACKAGE_ROOT_PATH,
    absolute: true,
    onlyFiles: true,
  });

  if (!targetEnumFilePath) {
    throw new Error(`Cannot find EnumDeclaration`);
  }

  const sourceFile =
    contractPackageProject.addSourceFileAtPath(targetEnumFilePath);
  const targetEnumDeclaration = sourceFile.getEnum(enumDeclaration.getName());

  if (!targetEnumDeclaration) {
    throw new Error(`Cannot find target EnumDeclaration`);
  }

  if (!isEnumDeclarationEqual(targetEnumDeclaration, enumDeclaration)) {
    throw new Error(`Undefined EnumMember`);
  }

  return targetEnumDeclaration
    .getMembers()
    .find((member) => member.getName() === enumMember.getName())!
    .getValue();
}

function isStylePropertiesType(type: Type): boolean {
  const symbol = type.getAliasSymbol() ?? type.getSymbol();

  if (!symbol) {
    return (
      type.getText().includes("csstype") &&
      type.getText().includes("Properties")
    );
  }

  if (symbol.getName() !== "Properties") {
    return false;
  }

  return symbol.getDeclarations().some((declaration) => {
    const filePath = declaration
      .getSourceFile()
      .getFilePath()
      .replaceAll("\\", "/");

    return (
      filePath.includes("/node_modules/") &&
      filePath.includes("/csstype/") &&
      filePath.endsWith("/index.d.ts")
    );
  });
}

function isEnumDeclarationEqual(
  enumA: EnumDeclaration,
  enumB: EnumDeclaration,
): boolean {
  if (enumA.getName() !== enumB.getName()) {
    return false;
  }

  const membersA = enumA.getMembers();
  const membersB = enumB.getMembers();

  if (membersA.length !== membersB.length) {
    return false;
  }

  const mapA = new Map(
    membersA.map((member) => [member.getName(), member.getValue()]),
  );

  for (const memberB of membersB) {
    const keyB = memberB.getName();
    const valueB = memberB.getValue();

    if (!mapA.has(keyB)) {
      return false;
    }

    if (mapA.get(keyB) !== valueB) {
      return false;
    }
  }

  return true;
}

function normalizePropertyName(name: string): string {
  return name.replace(/^["']|["']$/g, "");
}

function pascalToCamel(str: string): string {
  if (!str) {
    return "";
  }

  return str.charAt(0).toLowerCase() + str.slice(1);
}

export { parseComponent };
