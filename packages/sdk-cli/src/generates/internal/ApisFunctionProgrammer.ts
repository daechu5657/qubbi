import ts from "typescript";
import type { ApisGenerationContext } from "../../structures/ApisGenerationContext.js";
import type {
  AccessorMap,
  AccessorMapValue,
  AccessorValue,
} from "../../structures/Accessor.js";
import { AxiosRequestProgrammer } from "./AxiosRequestProgrammer.js";
import { OperationParameterProgrammer } from "./OperationParameterProgrammer.js";

export namespace ApisFunctionProgrammer {
  export const write = (
    accessorMap: AccessorMap,
    context: ApisGenerationContext,
  ): ts.FunctionDeclaration => {
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

    return ts.factory.createFunctionDeclaration(
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      undefined,
      functionName,
      undefined,
      parameter,
      undefined,
      createBody(accessorMap, context),
    );
  };

  const createBody = (
    accessorMap: AccessorMap,
    context: ApisGenerationContext,
  ): ts.Block => {
    const properties = [...accessorMap.entries()].flatMap(([key, value]) =>
      createPropertyAssignment(key, value, context),
    );

    return ts.factory.createBlock([
      ts.factory.createReturnStatement(
        ts.factory.createObjectLiteralExpression(properties, true),
      ),
    ]);
  };

  const createPropertyAssignment = (
    key: string,
    value: AccessorMapValue,
    context: ApisGenerationContext,
  ): ts.PropertyAssignment[] => {
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
  };

  const createArrowFunction = (
    value: AccessorValue,
    context: ApisGenerationContext,
  ): ts.ArrowFunction =>
    ts.factory.createArrowFunction(
      undefined,
      undefined,
      OperationParameterProgrammer.write(value, context),
      undefined,
      ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
      AxiosRequestProgrammer.write(value, context),
    );
}
