import type { OpenApiV3_1 } from "@typia/interface";
import ts from "typescript";
import type { ApisGenerationContext } from "../../structures/ApisGenerationContext.js";
import type { AccessorValue } from "../../structures/Accessor.js";
import { OpenApiSchemaTypeProgrammer } from "./OpenApiSchemaTypeProgrammer.js";

export namespace OperationParameterProgrammer {
  interface IDeclaration {
    name: string;
    required: boolean;
    signature: ts.PropertySignature;
  }

  export const write = (
    value: AccessorValue,
    context: ApisGenerationContext,
  ): ts.ParameterDeclaration[] => {
    const parameters = createOperationParameterDeclarations(value, context);
    const body = createOperationRequestBodyParameterDeclaration(value, context);
    const declarations = [...parameters, body].filter(
      (declaration): declaration is IDeclaration => declaration !== undefined,
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
  };

  const createOperationParameterDeclarations = (
    { operation }: AccessorValue,
    context: ApisGenerationContext,
  ): IDeclaration[] => {
    if (!operation.parameters) {
      return [];
    }

    const result: IDeclaration[] = [];

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
      result.push(
        createOperationParameterDeclaration(queryParameters, context),
      );
    }

    if (headerParameters.length) {
      result.push(
        createOperationParameterDeclaration(headerParameters, context),
      );
    }

    if (cookieParameters.length) {
      result.push(
        createOperationParameterDeclaration(cookieParameters, context),
      );
    }

    return result;
  };

  const createOperationParameterDeclaration = (
    parameters: OpenApiV3_1.IOperation.IParameter[],
    context: ApisGenerationContext,
  ): IDeclaration => {
    const name = parameters[0].in;

    const required =
      parameters[0].in !== "query"
        ? true
        : parameters.some((v) => !!v.required);

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
  };

  const createOperationParameterPropertySignature = (
    { name, required, schema }: OpenApiV3_1.IOperation.IParameter,
    context: ApisGenerationContext,
  ): ts.PropertySignature => {
    const identifier = ts.factory.createIdentifier(name!);
    const questionToken = required
      ? undefined
      : ts.factory.createToken(ts.SyntaxKind.QuestionToken);

    return ts.factory.createPropertySignature(
      undefined,
      identifier,
      questionToken,
      OpenApiSchemaTypeProgrammer.writeParameter(schema, context),
    );
  };

  const createOperationRequestBodyParameterDeclaration = (
    { operation }: AccessorValue,
    context: ApisGenerationContext,
  ): IDeclaration | undefined => {
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
        OpenApiSchemaTypeProgrammer.writeRequestBody(operation, context.models),
      ),
    };
  };
}
