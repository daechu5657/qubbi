import type { OpenApiV3_1 } from "@typia/interface";
import ts from "typescript";
import { SchemaAnalyzer } from "../../analyses/SchemaAnalyzer.js";
import type { ApisGenerationContext } from "../../structures/ApisGenerationContext.js";
import type { ExtendedOperation } from "../../structures/Accessor.js";
import type { EnumState } from "../../structures/EnumState.js";

export namespace OpenApiSchemaTypeProgrammer {
  export const writeParameter = (
    schema: OpenApiV3_1.IJsonSchema,
    context: ApisGenerationContext,
  ): ts.TypeNode => {
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
        schema.oneOf.map((s) => writeParameter(s, context)),
      );
    }

    if ("anyOf" in schema) {
      return createUnionTypeNode(
        schema.anyOf.map((s) => writeParameter(s, context)),
      );
    }

    if (!("type" in schema)) {
      return ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword);
    }

    const schemaType = schema.type;

    if (Array.isArray(schemaType)) {
      return createUnionTypeNode(
        schemaType.map((type: string) =>
          writeParameter(
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
          ? writeParameter(schema.items, context)
          : ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword);

      return withNullable(ts.factory.createArrayTypeNode(itemType), schema);
    }

    if (schemaType === "null") {
      return ts.factory.createLiteralTypeNode(ts.factory.createNull());
    }

    return ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword);
  };

  export const writeRequestBody = (
    operation: ExtendedOperation,
    models: Map<string, ts.ClassDeclaration>,
  ): ts.TypeNode => {
    const schema = SchemaAnalyzer.getRequestBodySchema(operation);
    const modelTypeNode = schema
      ? createModelTypeNodeFromSchema(schema, models)
      : undefined;

    return (
      modelTypeNode ??
      ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword)
    );
  };

  export const writeAxiosResponseTypeArguments = (
    operation: ExtendedOperation,
    models: Map<string, ts.ClassDeclaration>,
  ): ts.TypeNode[] | undefined => {
    const schema = SchemaAnalyzer.getResponseSchema(operation);
    const modelTypeNode = schema
      ? createModelTypeNodeFromSchema(schema, models)
      : undefined;

    return modelTypeNode ? [modelTypeNode] : undefined;
  };

  const createModelTypeNodeFromSchema = (
    schema: OpenApiV3_1.IJsonSchema,
    models: Map<string, ts.ClassDeclaration>,
  ): ts.TypeNode | undefined => {
    const refName = SchemaAnalyzer.getRefName(schema);

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
        return withNullable(
          ts.factory.createArrayTypeNode(itemTypeNode),
          schema,
        );
      }
    }

    return undefined;
  };

  const createEnumTypeNodeFromSchema = (
    schema: OpenApiV3_1.IJsonSchema,
    enums: Map<string, EnumState>,
  ): ts.TypeNode | undefined => {
    const refName = SchemaAnalyzer.getRefName(schema);

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
        return withNullable(
          ts.factory.createArrayTypeNode(itemTypeNode),
          schema,
        );
      }
    }

    const schemaValues = SchemaAnalyzer.getEnumValues(schema);
    if (!schemaValues) {
      return undefined;
    }

    for (const [enumName, enumState] of enums) {
      const enumValues = SchemaAnalyzer.getEnumDeclarationValues(
        enumState.declaration,
      );

      if (
        SchemaAnalyzer.isSameLiteralValueSet(schemaValues.values, enumValues)
      ) {
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
  };

  const createUnionTypeNode = (types: ts.TypeNode[]): ts.TypeNode => {
    if (types.length === 1) return types[0];

    return ts.factory.createUnionTypeNode(ts.factory.createNodeArray(types));
  };

  const createModelsTypeNode = (modelName: string): ts.TypeReferenceNode =>
    createNamespacedTypeNode("Models", modelName);

  const createEnumsTypeNode = (enumName: string): ts.TypeReferenceNode =>
    createNamespacedTypeNode("Enums", enumName);

  const createNamespacedTypeNode = (
    namespace: string,
    name: string,
  ): ts.TypeReferenceNode =>
    ts.factory.createTypeReferenceNode(
      ts.factory.createQualifiedName(
        ts.factory.createIdentifier(namespace),
        ts.factory.createIdentifier(name),
      ),
    );

  const createLiteralTypeNode = (value: unknown): ts.TypeNode => {
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
  };

  const withNullable = (
    typeNode: ts.TypeNode,
    schema: OpenApiV3_1.IJsonSchema,
  ): ts.TypeNode => {
    if (!("nullable" in schema) || schema.nullable !== true) {
      return typeNode;
    }

    return createUnionTypeNode([
      typeNode,
      ts.factory.createLiteralTypeNode(ts.factory.createNull()),
    ]);
  };
}
