import type { OpenApiV3_1 } from "@typia/interface";
import ts from "typescript";
import type { ApisGenerationContext } from "../../structures/ApisGenerationContext.js";
import type { AccessorValue } from "../../structures/Accessor.js";
import { OpenApiSchemaTypeProgrammer } from "./OpenApiSchemaTypeProgrammer.js";

export namespace AxiosRequestProgrammer {
  export const write = (
    value: AccessorValue,
    context: ApisGenerationContext,
  ): ts.CallExpression =>
    ts.factory.createCallExpression(
      createRequestFunction(value),
      OpenApiSchemaTypeProgrammer.writeAxiosResponseTypeArguments(
        value.operation,
        context.models,
      ),
      createArguments(value),
    );

  const createRequestFunction = ({ method }: AccessorValue): ts.Expression => {
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
  };

  const createArguments = (value: AccessorValue): ts.Expression[] => {
    const { method } = value;
    const url = createUrlExpression(value);
    const hasBody = hasOperationRequestBody(value);

    if (isConfigMethod(method)) {
      const config = createConfigExpression(value, {
        data: method === "delete" && hasBody,
      });

      return config ? [url, config] : [url];
    }

    if (isBodyMethod(method)) {
      const config = createConfigExpression(value);
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
      const config = createConfigExpression(value, {
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
  };

  const isConfigMethod = (method: OpenApiV3_1.Method): boolean =>
    method === "get" ||
    method === "delete" ||
    method === "head" ||
    method === "options";

  const isBodyMethod = (method: OpenApiV3_1.Method): boolean =>
    method === "post" || method === "put" || method === "patch";

  const hasOperationRequestBody = ({ operation }: AccessorValue): boolean =>
    !!operation.requestBody;

  const hasOperationParameter = (
    { operation }: AccessorValue,
    parameterType: OpenApiV3_1.IOperation.IParameter["in"],
  ): boolean =>
    operation.parameters?.some((parameter) => parameter.in === parameterType) ??
    false;

  const createUrlExpression = ({ url }: AccessorValue): ts.Expression => {
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
  };

  const createPathParameterExpression = (name: string): ts.Expression =>
    ts.factory.createCallExpression(
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

  const createConfigExpression = (
    value: AccessorValue,
    options: {
      method?: OpenApiV3_1.Method;
      url?: ts.Expression;
      data?: boolean;
    } = {},
  ): ts.ObjectLiteralExpression | undefined => {
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
  };
}
