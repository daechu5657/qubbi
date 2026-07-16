import ts from "typescript";
import type { EnumState } from "../../structures/EnumState.js";
import { ModelTypeNodeProgrammer } from "./ModelTypeNodeProgrammer.js";

export namespace ModelNamespaceProgrammer {
  export const write = ({
    checker,
    enums,
    models,
  }: {
    checker: ts.TypeChecker;
    enums: Map<string, EnumState>;
    models: Map<string, ts.ClassDeclaration>;
  }): ts.ModuleDeclaration => {
    const modelStatements: ts.Statement[] = [];

    for (const [, modelDecl] of models) {
      modelStatements.push(
        createInterfaceDeclarationFromClass(modelDecl, {
          checker,
          enums,
          models,
        }),
      );
    }

    return ts.factory.createModuleDeclaration(
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      ts.factory.createIdentifier("Models"),
      ts.factory.createModuleBlock(modelStatements),
      ts.NodeFlags.Namespace,
    );
  };

  const createInterfaceDeclarationFromClass = (
    node: ts.ClassDeclaration,
    context: ModelTypeNodeProgrammer.IContext,
  ): ts.InterfaceDeclaration => {
    if (!node.name) {
      throw new Error("class name is undefined");
    }

    return ts.factory.createInterfaceDeclaration(
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      node.name,
      node.typeParameters,
      undefined,
      node.members.map((member) =>
        createTypeElementFromClassElement(member, context),
      ),
    );
  };

  const createTypeElementFromClassElement = (
    node: ts.ClassElement,
    context: ModelTypeNodeProgrammer.IContext,
  ): ts.TypeElement => {
    if (ts.isPropertyDeclaration(node)) {
      return createPropertySignatureFromPropertyDeclaration(node, context);
    }

    throw new Error(`unsupported class member: ${ts.SyntaxKind[node.kind]}`);
  };

  const createPropertySignatureFromPropertyDeclaration = (
    node: ts.PropertyDeclaration,
    context: ModelTypeNodeProgrammer.IContext,
  ): ts.PropertySignature => {
    if (!node.type) {
      throw new Error("property type is undefined");
    }

    return ts.factory.createPropertySignature(
      undefined,
      clonePropertyName(node.name),
      node.questionToken,
      ModelTypeNodeProgrammer.write(node.type, context),
    );
  };

  const clonePropertyName = (name: ts.PropertyName): ts.PropertyName => {
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
  };
}
