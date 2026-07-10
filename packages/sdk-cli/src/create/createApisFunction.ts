import ts from "typescript";
import { OpenApiV3_1 } from "@typia/interface";
import type { EnumState } from "./createGeneratedFile.js";

interface ExtendedOperation extends OpenApiV3_1.IOperation {
  parameters?: Array<OpenApiV3_1.IOperation.IParameter>;
  "x-samchon-accessor": string[];
}

type AccessorMap = Map<string, AccessorMapValue>;

type AccessorMapValue = AccessorValue | AccessorMap;

interface AccessorValue {
  url: string;
  method: OpenApiV3_1.Method;
  operation: ExtendedOperation;
}

interface CreateApisContext {
  models: Map<string, ts.ClassDeclaration>;
  enums: Map<string, EnumState>;
}

const HTTP_METHODS = new Set<OpenApiV3_1.Method>([
  "get",
  "post",
  "put",
  "delete",
  "options",
  "head",
  "patch",
  "trace",
]);

interface OperationParameterDeclaration {
  name: string;
  required: boolean;
  signature: ts.PropertySignature;
}

export function createApisFunction({
  document,
  models,
  enums,
}: {
  document: OpenApiV3_1.IDocument;
  models: Map<string, ts.ClassDeclaration>;
  enums: Map<string, EnumState>;
}) {
  const accessorMap = collectAccessor(document);
  const result = createApisFunctionDeclaration(accessorMap, { models, enums });

  return result;
}

function collectAccessor(document: OpenApiV3_1.IDocument) {
  if (!document.paths) {
    throw new Error("OpenApiV3_1.IPath undefined");
  }

  const result: AccessorMap = new Map();

  for (const url in document.paths) {
    const path = document.paths[url];
    const entries = Object.entries(path).filter(
      (entry): entry is [OpenApiV3_1.Method, ExtendedOperation] =>
        HTTP_METHODS.has(entry[0] as OpenApiV3_1.Method) && !!entry[1],
    );

    for (const entry of entries) {
      collectOperations({ map: result, entry, url });
    }
  }

  return result;
}

function collectOperations({
  map,
  entry,
  url,
  accessor,
}: {
  map: AccessorMap;
  entry: [OpenApiV3_1.Method, ExtendedOperation];
  url: string;
  accessor?: string[];
}) {
  const [method, operation] = entry;
  const currentAccessor = accessor ?? operation["x-samchon-accessor"];
  const [key, ...restAccessor] = currentAccessor;

  if (!key) {
    throw new Error("x-samchon-accessor is empty");
  }

  if (!restAccessor.length) {
    map.set(key, {
      method,
      operation,
      url,
    });

    return;
  }

  const target = map.get(key);
  if (!target) {
    const newMap = new Map();
    map.set(key, newMap);

    return collectOperations({
      map: newMap,
      entry,
      url,
      accessor: restAccessor,
    });
  }

  if (target instanceof Map) {
    return collectOperations({
      map: target,
      entry,
      url,
      accessor: restAccessor,
    });
  }

  throw new Error(`duplicate functon name ${key}`);
}

function createApisFunctionDeclaration(
  accessorMap: AccessorMap,
  context: CreateApisContext,
): ts.FunctionDeclaration {
  const functionName = "createApis";
  const instanceName = "instance";

  const parameter = [
    ts.factory.createParameterDeclaration(
      undefined,
      undefined,
      instanceName,
      undefined,
      ts.factory.createTypeReferenceNode(
        ts.factory.createIdentifier("AxiosInstance"),
      ),
    ),
  ];

  const body = createApisFunctionBody(accessorMap, context);

  return ts.factory.createFunctionDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    undefined,
    functionName,
    undefined,
    parameter,
    undefined,
    body,
  );
}

function createApisFunctionBody(
  accessorMap: AccessorMap,
  context: CreateApisContext,
) {
  const properties = [...accessorMap.entries()].flatMap(([key, value]) =>
    createPropertyAssignment(key, value, context),
  );

  const block = ts.factory.createBlock([
    ts.factory.createReturnStatement(
      ts.factory.createObjectLiteralExpression(properties, true),
    ),
  ]);

  return block;
}

function createPropertyAssignment(
  key: string,
  value: AccessorMapValue,
  context: CreateApisContext,
): ts.PropertyAssignment[] {
  if (value instanceof Map) {
    const properties = [...value.entries()].flatMap(([nextKey, nextValue]) =>
      createPropertyAssignment(nextKey, nextValue, context),
    );

    return [
      ts.factory.createPropertyAssignment(
        key,
        ts.factory.createObjectLiteralExpression(properties),
      ),
    ];
  }

  return [
    ts.factory.createPropertyAssignment(
      key,
      createArrowFunction(value, context),
    ),
  ];
}

function createArrowFunction(
  value: AccessorValue,
  context: CreateApisContext,
): ts.ArrowFunction {
  const parameters = createArrowFunctionParameter(value, context);
  const body = createArrowFunctionBody(value, context);

  return ts.factory.createArrowFunction(
    undefined,
    undefined,
    parameters,
    undefined,
    ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
    body,
  );
}

function createArrowFunctionParameter(
  value: AccessorValue,
  context: CreateApisContext,
): ts.ParameterDeclaration[] {
  const parameters = createOperationParameterDeclarations(value, context);
  const body = createOperationRequestBodyParameterDeclaration(value, context);
  const declarations = [...parameters, body].filter(
    (declaration): declaration is OperationParameterDeclaration =>
      declaration !== undefined,
  );

  const hasRequiredDeclaration = declarations.some(
    (declaration) => declaration.required,
  );

  const objectBindingPattern = ts.factory.createObjectBindingPattern(
    declarations.map((declaration) =>
      ts.factory.createBindingElement(
        undefined,
        undefined,
        declaration.name,
        undefined,
      ),
    ),
  );

  const typeNode = ts.factory.createTypeLiteralNode(
    declarations.map((declaration) => declaration.signature),
  );

  const initializer = hasRequiredDeclaration
    ? undefined
    : ts.factory.createObjectLiteralExpression([], false);

  return [
    ts.factory.createParameterDeclaration(
      undefined,
      undefined,
      objectBindingPattern,
      undefined,
      typeNode,
      initializer,
    ),
  ];
}

function createOperationParameterDeclarations(
  { operation }: AccessorValue,
  context: CreateApisContext,
): OperationParameterDeclaration[] {
  if (!operation.parameters) {
    return [];
  }

  const result: OperationParameterDeclaration[] = [];

  const pathParameters: OpenApiV3_1.IOperation.IParameter[] = [];
  const queryParameters: OpenApiV3_1.IOperation.IParameter[] = [];
  const headerParameters: OpenApiV3_1.IOperation.IParameter[] = [];
  const cookieParameters: OpenApiV3_1.IOperation.IParameter[] = [];

  operation.parameters.forEach((p) => {
    if (p.in === "path") pathParameters.push(p);
    if (p.in === "query") queryParameters.push(p);
    if (p.in === "header") headerParameters.push(p);
    if (p.in === "cookie") cookieParameters.push(p);
  });

  if (pathParameters.length) {
    result.push(createOperationParameterDeclaration(pathParameters, context));
  }

  if (queryParameters.length) {
    result.push(createOperationParameterDeclaration(queryParameters, context));
  }

  if (headerParameters.length) {
    result.push(createOperationParameterDeclaration(headerParameters, context));
  }

  if (cookieParameters.length) {
    result.push(createOperationParameterDeclaration(cookieParameters, context));
  }

  return result;
}

function createOperationParameterDeclaration(
  parameters: OpenApiV3_1.IOperation.IParameter[],
  context: CreateApisContext,
) {
  const name = parameters[0].in;

  const required =
    parameters[0].in !== "query" ? true : parameters.some((v) => !!v.required);

  const questionToken = required
    ? undefined
    : ts.factory.createToken(ts.SyntaxKind.QuestionToken);

  const elements = parameters.map((p) =>
    createOperationParameterPropertySignature(p, context),
  );

  return {
    name,
    required,
    signature: ts.factory.createPropertySignature(
      undefined,
      name,
      questionToken,
      ts.factory.createTypeLiteralNode(elements),
    ),
  };
}

function createOperationParameterPropertySignature(
  { name, required, schema }: OpenApiV3_1.IOperation.IParameter,
  context: CreateApisContext,
) {
  const identifier = ts.factory.createIdentifier(name!);
  const questionToken = required
    ? undefined
    : ts.factory.createToken(ts.SyntaxKind.QuestionToken);

  return ts.factory.createPropertySignature(
    undefined,
    identifier,
    questionToken,
    createParameterTypeNodeFromSchema(schema, context),
  );
}

function createParameterTypeNodeFromSchema(
  schema: OpenApiV3_1.IJsonSchema,
  context: CreateApisContext,
): ts.TypeNode {
  const modelTypeNode = createModelTypeNodeFromSchema(schema, context.models);
  if (modelTypeNode) {
    return modelTypeNode;
  }

  const enumTypeNode = createEnumTypeNodeFromSchema(schema, context.enums);
  if (enumTypeNode) {
    return enumTypeNode;
  }

  if ("enum" in schema && Array.isArray(schema.enum)) {
    return createUnionTypeNode(schema.enum.map(createLiteralTypeNode));
  }

  if ("const" in schema) {
    return createLiteralTypeNode(schema.const);
  }

  if ("oneOf" in schema) {
    return createUnionTypeNode(
      schema.oneOf.map((s) => createParameterTypeNodeFromSchema(s, context)),
    );
  }

  if ("anyOf" in schema) {
    return createUnionTypeNode(
      schema.anyOf.map((s) => createParameterTypeNodeFromSchema(s, context)),
    );
  }

  if (!("type" in schema)) {
    return ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword);
  }

  const schemaType = schema.type;

  if (Array.isArray(schemaType)) {
    return createUnionTypeNode(
      schemaType.map((type: string) =>
        createParameterTypeNodeFromSchema(
          {
            type,
          } as OpenApiV3_1.IJsonSchema,
          context,
        ),
      ),
    );
  }

  if (schemaType === "string") {
    return withNullable(
      ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
      schema,
    );
  }

  if (schemaType === "number" || schemaType === "integer") {
    return withNullable(
      ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
      schema,
    );
  }

  if (schemaType === "boolean") {
    return withNullable(
      ts.factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword),
      schema,
    );
  }

  if (schemaType === "array") {
    const itemType =
      "items" in schema && schema.items && !Array.isArray(schema.items)
        ? createParameterTypeNodeFromSchema(schema.items, context)
        : ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword);

    return withNullable(ts.factory.createArrayTypeNode(itemType), schema);
  }

  if (schemaType === "null") {
    return ts.factory.createLiteralTypeNode(ts.factory.createNull());
  }

  return ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword);
}

function createUnionTypeNode(types: ts.TypeNode[]): ts.TypeNode {
  if (types.length === 1) return types[0];

  return ts.factory.createUnionTypeNode(ts.factory.createNodeArray(types));
}

function createModelTypeNodeFromSchema(
  schema: OpenApiV3_1.IJsonSchema,
  models: Map<string, ts.ClassDeclaration>,
): ts.TypeNode | undefined {
  const refName = getSchemaRefName(schema);

  if (refName && models.has(refName)) {
    return createModelsTypeNode(refName);
  }

  if (
    "type" in schema &&
    schema.type === "array" &&
    "items" in schema &&
    schema.items &&
    !Array.isArray(schema.items)
  ) {
    const itemTypeNode = createModelTypeNodeFromSchema(schema.items, models);

    if (itemTypeNode) {
      return withNullable(ts.factory.createArrayTypeNode(itemTypeNode), schema);
    }
  }

  return undefined;
}

function createEnumTypeNodeFromSchema(
  schema: OpenApiV3_1.IJsonSchema,
  enums: Map<string, EnumState>,
): ts.TypeNode | undefined {
  const refName = getSchemaRefName(schema);

  if (refName) {
    const enumState = enums.get(refName);

    if (enumState) {
      enumState.isUsed = true;

      return createEnumsTypeNode(refName);
    }
  }

  if (
    "type" in schema &&
    schema.type === "array" &&
    "items" in schema &&
    schema.items &&
    !Array.isArray(schema.items)
  ) {
    const itemTypeNode = createEnumTypeNodeFromSchema(schema.items, enums);

    if (itemTypeNode) {
      return withNullable(ts.factory.createArrayTypeNode(itemTypeNode), schema);
    }
  }

  const schemaValues = getSchemaEnumValues(schema);
  if (!schemaValues) {
    return undefined;
  }

  for (const [enumName, enumState] of enums) {
    const enumValues = getEnumDeclarationValues(enumState.declaration);

    if (isSameLiteralValueSet(schemaValues.values, enumValues)) {
      enumState.isUsed = true;

      const enumTypeNode = createEnumsTypeNode(enumName);

      return schemaValues.hasNull
        ? createUnionTypeNode([
            enumTypeNode,
            ts.factory.createLiteralTypeNode(ts.factory.createNull()),
          ])
        : enumTypeNode;
    }
  }

  return undefined;
}

function getSchemaRefName(schema: OpenApiV3_1.IJsonSchema): string | undefined {
  if (!("$ref" in schema)) {
    return undefined;
  }

  const refParts = schema.$ref.split("/");

  return refParts[refParts.length - 1];
}

function createModelsTypeNode(modelName: string): ts.TypeReferenceNode {
  return createNamespacedTypeNode("Models", modelName);
}

function createEnumsTypeNode(enumName: string): ts.TypeReferenceNode {
  return createNamespacedTypeNode("Enums", enumName);
}

function createNamespacedTypeNode(
  namespace: string,
  name: string,
): ts.TypeReferenceNode {
  return ts.factory.createTypeReferenceNode(
    ts.factory.createQualifiedName(
      ts.factory.createIdentifier(namespace),
      ts.factory.createIdentifier(name),
    ),
  );
}

function getSchemaEnumValues(
  schema: OpenApiV3_1.IJsonSchema,
): { values: Array<string | number>; hasNull: boolean } | undefined {
  if ("enum" in schema && Array.isArray(schema.enum)) {
    return normalizeSchemaLiteralValues(schema.enum);
  }

  if ("const" in schema) {
    return normalizeSchemaLiteralValues([schema.const]);
  }

  if ("oneOf" in schema) {
    const values: unknown[] = [];
    let hasNull = false;

    for (const item of schema.oneOf) {
      if ("const" in item) {
        values.push(item.const);
        continue;
      }

      if ("type" in item && item.type === "null") {
        hasNull = true;
        continue;
      }

      return undefined;
    }

    const result = normalizeSchemaLiteralValues(values);
    if (!result) {
      return undefined;
    }

    return {
      values: result.values,
      hasNull: result.hasNull || hasNull,
    };
  }

  return undefined;
}

function normalizeSchemaLiteralValues(
  values: unknown[],
): { values: Array<string | number>; hasNull: boolean } | undefined {
  const result: Array<string | number> = [];
  let hasNull = false;

  for (const value of values) {
    if (value === null) {
      hasNull = true;
      continue;
    }

    if (typeof value !== "string" && typeof value !== "number") {
      return undefined;
    }

    result.push(value);
  }

  if (!result.length) {
    return undefined;
  }

  return { values: result, hasNull };
}

function getEnumDeclarationValues(
  declaration: ts.EnumDeclaration,
): Array<string | number> {
  const result: Array<string | number> = [];
  let nextAutoValue = 0;

  for (const member of declaration.members) {
    const initializer = member.initializer;

    if (!initializer) {
      result.push(nextAutoValue);
      nextAutoValue += 1;
      continue;
    }

    if (ts.isStringLiteral(initializer)) {
      result.push(initializer.text);
      continue;
    }

    if (ts.isNumericLiteral(initializer)) {
      const value = Number(initializer.text);
      result.push(value);
      nextAutoValue = value + 1;
      continue;
    }

    if (
      ts.isPrefixUnaryExpression(initializer) &&
      ts.isNumericLiteral(initializer.operand)
    ) {
      const value =
        initializer.operator === ts.SyntaxKind.MinusToken
          ? -Number(initializer.operand.text)
          : Number(initializer.operand.text);

      result.push(value);
      nextAutoValue = value + 1;
      continue;
    }

    throw new Error(`unsupported enum initializer`);
  }

  return result;
}

function isSameLiteralValueSet(
  left: Array<string | number>,
  right: Array<string | number>,
) {
  if (left.length !== right.length) {
    return false;
  }

  const rightSet = new Set(right.map(createLiteralValueKey));

  return left.every((value) => rightSet.has(createLiteralValueKey(value)));
}

function createLiteralValueKey(value: string | number) {
  return `${typeof value}:${String(value)}`;
}

function createLiteralTypeNode(value: unknown): ts.TypeNode {
  if (value === null) {
    return ts.factory.createLiteralTypeNode(ts.factory.createNull());
  }

  if (typeof value === "string") {
    return ts.factory.createLiteralTypeNode(
      ts.factory.createStringLiteral(value),
    );
  }

  if (typeof value === "number") {
    return ts.factory.createLiteralTypeNode(
      ts.factory.createNumericLiteral(value),
    );
  }

  if (typeof value === "boolean") {
    return ts.factory.createLiteralTypeNode(
      value ? ts.factory.createTrue() : ts.factory.createFalse(),
    );
  }

  throw new Error(`unsupported parameter literal: ${String(value)}`);
}

function withNullable(
  typeNode: ts.TypeNode,
  schema: OpenApiV3_1.IJsonSchema,
): ts.TypeNode {
  if (!("nullable" in schema) || schema.nullable !== true) {
    return typeNode;
  }

  return createUnionTypeNode([
    typeNode,
    ts.factory.createLiteralTypeNode(ts.factory.createNull()),
  ]);
}

function createOperationRequestBodyParameterDeclaration(
  { operation }: AccessorValue,
  context: CreateApisContext,
): OperationParameterDeclaration | undefined {
  if (!operation.requestBody) {
    return undefined;
  }

  const required =
    "required" in operation.requestBody
      ? !!operation.requestBody.required
      : true;

  return {
    name: "body",
    required,
    signature: ts.factory.createPropertySignature(
      undefined,
      "body",
      required
        ? undefined
        : ts.factory.createToken(ts.SyntaxKind.QuestionToken),
      createRequestBodyTypeNode(operation, context.models),
    ),
  };
}

function createRequestBodyTypeNode(
  operation: ExtendedOperation,
  models: Map<string, ts.ClassDeclaration>,
): ts.TypeNode {
  const schema = getRequestBodySchema(operation);
  const modelTypeNode = schema
    ? createModelTypeNodeFromSchema(schema, models)
    : undefined;

  return (
    modelTypeNode ??
    ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword)
  );
}

function getRequestBodySchema(
  operation: ExtendedOperation,
): OpenApiV3_1.IJsonSchema | undefined {
  const requestBody = operation.requestBody;

  if (!requestBody || "$ref" in requestBody || !requestBody.content) {
    return undefined;
  }

  return getContentSchema(requestBody.content);
}

function createArrowFunctionBody(
  value: AccessorValue,
  context: CreateApisContext,
) {
  return ts.factory.createCallExpression(
    createAxiosRequestFunction(value),
    createAxiosResponseTypeArguments(value.operation, context.models),
    createAxiosFuncitonArguments(value),
  );
}

function createAxiosResponseTypeArguments(
  operation: ExtendedOperation,
  models: Map<string, ts.ClassDeclaration>,
): ts.TypeNode[] | undefined {
  const schema = getResponseSchema(operation);
  const modelTypeNode = schema
    ? createModelTypeNodeFromSchema(schema, models)
    : undefined;

  return modelTypeNode ? [modelTypeNode] : undefined;
}

function getResponseSchema(
  operation: ExtendedOperation,
): OpenApiV3_1.IJsonSchema | undefined {
  const responses = operation.responses;

  if (!responses) {
    return undefined;
  }

  const successResponses = Object.entries(responses)
    .filter(([status]) => /^2\d\d$/.test(status))
    .sort(([a], [b]) => Number(a) - Number(b));

  for (const [, response] of successResponses) {
    if ("$ref" in response || !response.content) {
      continue;
    }

    const schema = getContentSchema(response.content);

    if (schema) {
      return schema;
    }
  }

  return undefined;
}

function getContentSchema(
  content: Record<string, OpenApiV3_1.IOperation.IMediaType>,
): OpenApiV3_1.IJsonSchema | undefined {
  const preferredContent =
    content["application/json"] ?? content["multipart/form-data"];

  if (preferredContent?.schema) {
    return preferredContent.schema;
  }

  return Object.values(content).find((media) => media.schema)?.schema;
}

function createAxiosRequestFunction({ method }: AccessorValue) {
  if (method === "trace") {
    return ts.factory.createPropertyAccessExpression(
      ts.factory.createIdentifier("instance"),
      "request",
    );
  }

  return ts.factory.createPropertyAccessExpression(
    ts.factory.createIdentifier("instance"),
    method,
  );
}

function createAxiosFuncitonArguments(value: AccessorValue) {
  const { method } = value;
  const url = createAxiosUrlExpression(value);
  const hasBody = hasOperationRequestBody(value);

  if (isAxiosConfigMethod(method)) {
    const config = createAxiosConfigExpression(value, {
      data: method === "delete" && hasBody,
    });

    return config ? [url, config] : [url];
  }

  if (isAxiosBodyMethod(method)) {
    const config = createAxiosConfigExpression(value);
    const result: ts.Expression[] = [
      url,
      hasBody
        ? ts.factory.createIdentifier("body")
        : ts.factory.createIdentifier("undefined"),
    ];

    if (config) {
      result.push(config);
    }

    return [...result];
  }

  if (method === "trace") {
    const config = createAxiosConfigExpression(value, {
      method,
      url,
      data: hasBody,
    });

    if (!config) {
      throw new Error("trace request config is undefined");
    }

    return [config];
  }

  throw new Error(`unsupported axios method: ${method}`);
}

function isAxiosConfigMethod(method: OpenApiV3_1.Method) {
  return (
    method === "get" ||
    method === "delete" ||
    method === "head" ||
    method === "options"
  );
}

function isAxiosBodyMethod(method: OpenApiV3_1.Method) {
  return method === "post" || method === "put" || method === "patch";
}

function hasOperationRequestBody({ operation }: AccessorValue) {
  return !!operation.requestBody;
}

function hasOperationParameter(
  { operation }: AccessorValue,
  parameterType: OpenApiV3_1.IOperation.IParameter["in"],
) {
  return operation.parameters?.some(
    (parameter) => parameter.in === parameterType,
  );
}

function createAxiosUrlExpression({ url }: AccessorValue) {
  const matches = [...url.matchAll(/\{([^}]+)\}/g)];

  if (!matches.length) {
    return ts.factory.createStringLiteral(url);
  }

  return ts.factory.createTemplateExpression(
    ts.factory.createTemplateHead(url.slice(0, matches[0].index)),
    matches.map((match, index) => {
      const nextMatch = matches[index + 1];
      const literalStart = match.index! + match[0].length;
      const literalEnd = nextMatch?.index ?? url.length;
      const literalText = url.slice(literalStart, literalEnd);

      return ts.factory.createTemplateSpan(
        createPathParameterExpression(match[1]),
        index === matches.length - 1
          ? ts.factory.createTemplateTail(literalText)
          : ts.factory.createTemplateMiddle(literalText),
      );
    }),
  );
}

function createPathParameterExpression(name: string) {
  return ts.factory.createCallExpression(
    ts.factory.createIdentifier("encodeURIComponent"),
    undefined,
    [
      ts.factory.createCallExpression(
        ts.factory.createIdentifier("String"),
        undefined,
        [
          ts.factory.createElementAccessExpression(
            ts.factory.createIdentifier("path"),
            ts.factory.createStringLiteral(name),
          ),
        ],
      ),
    ],
  );
}

function createAxiosConfigExpression(
  value: AccessorValue,
  options: {
    method?: OpenApiV3_1.Method;
    url?: ts.Expression;
    data?: boolean;
  } = {},
) {
  const hasQuery = hasOperationParameter(value, "query");

  if (!hasQuery && !options.method && !options.url && !options.data) {
    return undefined;
  }

  const properties: ts.ObjectLiteralElementLike[] = [];

  if (options.method) {
    properties.push(
      ts.factory.createPropertyAssignment(
        "method",
        ts.factory.createStringLiteral(options.method),
      ),
    );
  }

  if (options.url) {
    properties.push(ts.factory.createPropertyAssignment("url", options.url));
  }

  if (hasQuery) {
    properties.push(
      ts.factory.createPropertyAssignment(
        "params",
        ts.factory.createObjectLiteralExpression(
          [
            ts.factory.createSpreadAssignment(
              ts.factory.createIdentifier("query"),
            ),
          ],
          true,
        ),
      ),
    );
  }

  if (options.data) {
    properties.push(
      ts.factory.createPropertyAssignment(
        "data",
        ts.factory.createIdentifier("body"),
      ),
    );
  }

  return ts.factory.createObjectLiteralExpression(properties, true);
}
