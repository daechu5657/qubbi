import type { OpenApiV3_1 } from "@typia/interface";
import ts from "typescript";
import type { ExtendedOperation } from "../structures/Accessor.js";

export namespace SchemaAnalyzer {
  export const getRefName = (
    schema: OpenApiV3_1.IJsonSchema,
  ): string | undefined => {
    if (!("$ref" in schema)) {
      return undefined;
    }

    const refParts = schema.$ref.split("/");

    return refParts[refParts.length - 1];
  };

  export const getRequestBodySchema = (
    operation: ExtendedOperation,
  ): OpenApiV3_1.IJsonSchema | undefined => {
    const requestBody = operation.requestBody;

    if (!requestBody || "$ref" in requestBody || !requestBody.content) {
      return undefined;
    }

    return getContentSchema(requestBody.content);
  };

  export const getResponseSchema = (
    operation: ExtendedOperation,
  ): OpenApiV3_1.IJsonSchema | undefined => {
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
  };

  export const getContentSchema = (
    content: Record<string, OpenApiV3_1.IOperation.IMediaType>,
  ): OpenApiV3_1.IJsonSchema | undefined => {
    const preferredContent =
      content["application/json"] ?? content["multipart/form-data"];

    if (preferredContent?.schema) {
      return preferredContent.schema;
    }

    return Object.values(content).find((media) => media.schema)?.schema;
  };

  export const getEnumValues = (
    schema: OpenApiV3_1.IJsonSchema,
  ): { values: Array<string | number>; hasNull: boolean } | undefined => {
    if ("enum" in schema && Array.isArray(schema.enum)) {
      return normalizeLiteralValues(schema.enum);
    }

    if ("const" in schema) {
      return normalizeLiteralValues([schema.const]);
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

      const result = normalizeLiteralValues(values);
      if (!result) {
        return undefined;
      }

      return {
        values: result.values,
        hasNull: result.hasNull || hasNull,
      };
    }

    return undefined;
  };

  export const getEnumDeclarationValues = (
    declaration: ts.EnumDeclaration,
  ): Array<string | number> => {
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
  };

  export const isSameLiteralValueSet = (
    left: Array<string | number>,
    right: Array<string | number>,
  ): boolean => {
    if (left.length !== right.length) {
      return false;
    }

    const rightSet = new Set(right.map(createLiteralValueKey));

    return left.every((value) => rightSet.has(createLiteralValueKey(value)));
  };

  const normalizeLiteralValues = (
    values: unknown[],
  ): { values: Array<string | number>; hasNull: boolean } | undefined => {
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
  };

  const createLiteralValueKey = (value: string | number): string =>
    `${typeof value}:${String(value)}`;
}
