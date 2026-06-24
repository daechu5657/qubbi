import * as Openapi from "@qubbi/openapi";
import * as Contract from "@qubbi/contract";
import * as path from "node:path";
import fg from "fast-glob";
import {
  Project,
  SyntaxKind,
  CallExpression,
  FunctionExpression,
  FunctionDeclaration,
  Block,
  JsxSelfClosingElement,
  JsxElement,
  EnumMember,
  EnumDeclaration,
  ts,
  Type,
  TypeNode,
  PropertySignature,
} from "ts-morph";

const COMPONENT_MANIFEST_VERSION = 1;
const PACKAGE_NAME = "@qubbi/component-authoring";
const CREATE_COMPONENT_FUNCTION_NAME = "createComponent";
const DEFINE_FUNCTION_NAME = "define";
const CONTRACT_PACKAGE_ROOT_PATH = path.dirname(
  require.resolve("@qubbi/contract/package.json"),
);
const CONTRACT_PACKAGE_ENUM_FILE_SUFFIX = ".enum.d.ts";

const contractPackageProject = new Project({
  compilerOptions: {
    moduleResolution: 2,
    allowJs: true,
  },
});

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

  //   const result = {
  //     manifestVersion: COMPONENT_MANIFEST_VERSION,
  //     generatedAt: new Date().toISOString(),
  //     files: files.map((file) => path.relative(cwd, file).replaceAll("\\", "/")),
  //   };

  //   const outPath = path.resolve(out); //   const outPath = path.resolve(cwd, out);
  //   await fs.mkdir(path.dirname(outPath), { recursive: true });
  //   await fs.writeFile(outPath, JSON.stringify(result, null, 2), "utf8");

  //   return result;

  const project = new Project();
  const sourceFiles = project.addSourceFilesAtPaths(files);

  for (const sourceFile of sourceFiles) {
    const factoryMap = new Map<string, CallExpression>();
    const componentMap = new Map<
      string,
      | FunctionExpression
      | FunctionDeclaration
      | Block
      | JsxSelfClosingElement
      | JsxElement
    >();

    const callExpressions = sourceFile.getDescendantsOfKind(
      SyntaxKind.CallExpression,
    );

    for (const callExpression of callExpressions) {
      const expression = callExpression.getExpression();

      if (expression.isKind(SyntaxKind.Identifier)) {
        const symbol = expression.getSymbol();
        if (!symbol) {
          continue;
        }

        const importDeclarations = symbol
          .getDeclarations()
          .filter((v) => v.isKind(SyntaxKind.ImportSpecifier))
          .filter((v) => v.getName() === CREATE_COMPONENT_FUNCTION_NAME)
          .map((v) => v.getFirstAncestorByKind(SyntaxKind.ImportDeclaration))
          .filter((v) => !!v);

        for (const importDeclaration of importDeclarations) {
          if (importDeclaration.getModuleSpecifierValue() === PACKAGE_NAME) {
            const variableDeclaration = callExpression.getFirstAncestorByKind(
              SyntaxKind.VariableDeclaration,
            );

            if (variableDeclaration) {
              factoryMap.set(variableDeclaration.getName(), callExpression);
            }
          }
        }
      }

      if (
        expression.isKind(SyntaxKind.PropertyAccessExpression) &&
        expression.getName() === CREATE_COMPONENT_FUNCTION_NAME
      ) {
        const left = expression.getExpression();

        if (left.isKind(SyntaxKind.Identifier)) {
          const symbol = left.getSymbol();
          if (!symbol) {
            continue;
          }

          const importDeclarations = symbol
            .getDeclarations()
            .filter((v) => v.isKind(SyntaxKind.NamespaceImport))
            .map((v) => v.getFirstAncestorByKind(SyntaxKind.ImportDeclaration))
            .filter((v) => !!v);

          for (const importDeclaration of importDeclarations) {
            if (importDeclaration.getModuleSpecifierValue() === PACKAGE_NAME) {
              const variableDeclaration = callExpression.getFirstAncestorByKind(
                SyntaxKind.VariableDeclaration,
              );

              if (variableDeclaration) {
                factoryMap.set(variableDeclaration.getName(), callExpression);
              }
            }
          }
        }
      }
    }

    for (const callExpression of callExpressions) {
      const expression = callExpression.getExpression();

      if (expression.isKind(SyntaxKind.PropertyAccessExpression)) {
        const factoryExpression = expression.getExpression();
        if (!factoryExpression.isKind(SyntaxKind.Identifier)) {
          continue;
        }

        const factoryKey = factoryExpression.getText();
        const identifierName = expression.getNameNode().getFullText().trim();

        if (
          !factoryMap.has(factoryKey) ||
          identifierName !== DEFINE_FUNCTION_NAME
        ) {
          continue;
        }

        if (componentMap.has(factoryKey)) {
          throw new Error(
            `Duplicate define() for component factory: ${factoryKey}`,
          );
        }

        const defineFunctionArguments = callExpression.getArguments();
        for (const defineFunctionArgument of defineFunctionArguments) {
          if (defineFunctionArgument.isKind(SyntaxKind.Identifier)) {
            const symbol = defineFunctionArgument.getSymbol();
            if (!symbol) {
              continue;
            }

            for (const declaration of symbol.getDeclarations()) {
              if (declaration.isKind(SyntaxKind.FunctionDeclaration)) {
                componentMap.set(factoryKey, declaration);
              }

              if (declaration.isKind(SyntaxKind.VariableDeclaration)) {
                const initializer = declaration.getInitializer();
                if (!initializer) {
                  continue;
                }

                if (initializer.isKind(SyntaxKind.ArrowFunction)) {
                  const body = initializer.getBody();

                  if (body.isKind(SyntaxKind.Block)) {
                    componentMap.set(factoryKey, body);
                  }

                  if (body.isKind(SyntaxKind.JsxSelfClosingElement)) {
                    componentMap.set(factoryKey, body);
                  }

                  if (body.isKind(SyntaxKind.JsxElement)) {
                    componentMap.set(factoryKey, body);
                  }
                }
              }
            }
          }

          if (defineFunctionArgument.isKind(SyntaxKind.FunctionExpression)) {
            componentMap.set(factoryKey, defineFunctionArgument);
          }

          if (defineFunctionArgument.isKind(SyntaxKind.ArrowFunction)) {
            const body = defineFunctionArgument.getBody();

            if (body.isKind(SyntaxKind.Block)) {
              componentMap.set(factoryKey, body);
            }

            if (body.isKind(SyntaxKind.JsxSelfClosingElement)) {
              componentMap.set(factoryKey, body);
            }

            if (body.isKind(SyntaxKind.JsxElement)) {
              componentMap.set(factoryKey, body);
            }
          }
        }
      }
    }

    type CreateComponentArgumentValue = Pick<
      Openapi.Models.ComponentManifestComponentModel,
      "name" | "placementType" | "variants"
    >;

    const createComponentArgumentMap = new Map<
      string,
      CreateComponentArgumentValue
    >();

    for (const [factoryKey, callExpression] of factoryMap) {
      const factoryArguments = callExpression.getArguments();

      for (const factoryArgument of factoryArguments) {
        if (!factoryArgument.isKind(SyntaxKind.ObjectLiteralExpression)) {
          throw new Error(
            "CreateComponent Config Only ObjectLiteralExpression",
          );
        }

        let createComponentArgumentValue = {
          variants: [] as CreateComponentArgumentValue["variants"],
        } as CreateComponentArgumentValue;

        for (const property of factoryArgument.getProperties()) {
          if (!property.isKind(SyntaxKind.PropertyAssignment)) {
            continue;
          }

          const propertyName = property
            .getNameNode()
            .getText() as keyof CreateComponentArgumentValue;
          const value = property.getInitializer();

          if (!value) {
            continue;
          }

          if (
            propertyName === "name" &&
            value.isKind(SyntaxKind.StringLiteral)
          ) {
            const name = value.getLiteralValue();

            if (name.length) {
              createComponentArgumentValue.name = name;
              continue;
            }

            throw new Error(`Empty name for component factory: ${factoryKey}`);
          }

          if (
            propertyName === "placementType" &&
            value.isKind(SyntaxKind.PropertyAccessExpression)
          ) {
            const symbol = value.getSymbol();
            if (!symbol) {
              continue;
            }

            let resolvedPlacementType:
              | CreateComponentArgumentValue["placementType"]
              | undefined;

            const declarations = symbol.getDeclarations();
            for (const declaration of declarations) {
              if (!declaration.isKind(SyntaxKind.EnumMember)) {
                continue;
              }

              resolvedPlacementType = (await getEnumValue(declaration)) as
                | CreateComponentArgumentValue["placementType"]
                | undefined;
            }

            if (resolvedPlacementType !== undefined) {
              createComponentArgumentValue.placementType =
                resolvedPlacementType;
              continue;
            }

            throw new Error(`Cannot find Enum Value`);
          }

          if (
            propertyName === "variants" &&
            value.isKind(SyntaxKind.ArrayLiteralExpression)
          ) {
            const variantsValues: string[] = [];

            for (const element of value.getElements()) {
              if (element.isKind(SyntaxKind.StringLiteral)) {
                variantsValues.push(element.getLiteralValue());
                continue;
              }

              throw new Error(
                `variants only string for component factory: ${factoryKey}`,
              );
            }

            createComponentArgumentValue.variants = variantsValues.map(
              (v, i) => ({ key: v, order: i }),
            );

            continue;
          }

          throw new Error(
            `Disallowed createComponent property: ${propertyName}`,
          );
        }

        if (!createComponentArgumentValue.name) {
          throw new Error("CreateComponent.name required");
        }

        if (!createComponentArgumentValue.placementType) {
          throw new Error("CreateComponent.placementType required");
        }

        createComponentArgumentMap.set(
          factoryKey,
          createComponentArgumentValue,
        );
      }
    }

    console.log(createComponentArgumentMap);

    type PropsAndPartsMapValue = Pick<
      Openapi.Models.ComponentManifestComponentModel,
      "props" | "parts"
    >;

    const propsAndPartsMap = new Map<string, PropsAndPartsMapValue>();

    for (const [factoryKey, component] of componentMap) {
      if (component.isKind(SyntaxKind.FunctionDeclaration)) {
        const parameters = component.getParameters();
        if (parameters.length > 1) {
          throw new Error("컴포넌트는 하나의 인자만 가능");
        }

        const parameter = parameters[0];
        const props: PropsAndPartsMapValue["props"] = [];
        const nameNode = parameter.getNameNode();

        if (nameNode.isKind(SyntaxKind.ObjectBindingPattern)) {
          const typeNode = parameter.getTypeNode();

          if (typeNode?.isKind(SyntaxKind.TypeLiteral)) {
            const properties = typeNode.getProperties();
            for (const property of properties) {
              props.push(parsePropSignature(property));
            }
          }

          if (typeNode?.isKind(SyntaxKind.InterfaceDeclaration)) {
            //
          }

          if (typeNode?.isKind(SyntaxKind.TypeAliasDeclaration)) {
            //
          }
        }

        if (nameNode.isKind(SyntaxKind.Identifier)) {
          // const isOptional = parameter.isOptional
        }

        // console.log(props);
        propsAndPartsMap.set(factoryKey, props);
      }
    }
  }
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
    .find((v) => v.getName() === enumMember.getName())!
    .getValue();
}

function pascalToCamel(str: string): string {
  if (!str) return "";

  return str.charAt(0).toLowerCase() + str.slice(1);
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

  const mapA = new Map(membersA.map((m) => [m.getName(), m.getValue()]));

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

function parsePropSignature(
  property: PropertySignature,
): Openapi.Models.ComponentManifestPropModel {
  const key = property.getName();
  const required = !property.hasQuestionToken();
  const typeNode = property.getTypeNode();

  return {
    key,
    required,
    value: parsePropValue(typeNode),
  };
}

function parsePropValue(
  typeNode: TypeNode | undefined,
): Openapi.Models.ComponentManifestPropModel["value"] {
  if (!typeNode) {
    return unknownValue();
  }

  if (typeNode.isKind(SyntaxKind.ParenthesizedType)) {
    return parsePropValue(typeNode.getTypeNode());
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

  if (typeNode.isKind(SyntaxKind.UnionType)) {
    return parseUnionType(typeNode);
  }

  if (typeNode.isKind(SyntaxKind.ArrayType)) {
    return {
      type: Contract.Enums.ComponentPropType.Array,
      item: parsePropValue(typeNode.getElementTypeNode()),
    };
  }

  if (typeNode.isKind(SyntaxKind.TypeLiteral)) {
    return {
      type: Contract.Enums.ComponentPropType.Object,
      properties: typeNode
        .getMembers()
        .filter((member) => member.isKind(SyntaxKind.PropertySignature))
        .map((member) => parsePropSignature(member)),
    };
  }

  if (typeNode.isKind(SyntaxKind.TypeReference)) {
    const resolved = resolveTypeReferenceNode(typeNode);
    return resolved ?? parseTypeFallback(typeNode);
  }

  if (typeNode.isKind(SyntaxKind.IndexedAccessType)) {
    const resolved = resolveIndexedAccessTypeNode(typeNode);
    return resolved ?? parseTypeFallback(typeNode);
  }

  return parseTypeFallback(typeNode);
}

function resolveTypeReferenceNode(
  typeNode: TypeNode,
): Openapi.Models.ComponentManifestPropModel["value"] | undefined {
  if (!typeNode.isKind(SyntaxKind.TypeReference)) {
    return undefined;
  }

  if (isStylePropertiesType(typeNode.getType())) {
    return {
      type: Contract.Enums.ComponentPropType.StyleProperties,
    };
  }

  const symbol =
    typeNode.getType().getAliasSymbol() ??
    typeNode.getType().getSymbol() ??
    typeNode.getTypeName().getSymbol();

  const declaration = symbol?.getDeclarations()[0];
  if (!declaration) {
    return undefined;
  }

  if (declaration.isKind(SyntaxKind.InterfaceDeclaration)) {
    return {
      type: Contract.Enums.ComponentPropType.Object,
      properties: declaration
        .getProperties()
        .map((property) => parsePropSignature(property)),
    };
  }

  if (declaration.isKind(SyntaxKind.TypeAliasDeclaration)) {
    const aliasTypeNode = declaration.getTypeNode();
    if (!aliasTypeNode) {
      return undefined;
    }

    return parsePropValue(aliasTypeNode);
  }

  return undefined;
}

function resolveIndexedAccessTypeNode(
  typeNode: TypeNode,
): Openapi.Models.ComponentManifestPropModel["value"] | undefined {
  if (!typeNode.isKind(SyntaxKind.IndexedAccessType)) {
    return undefined;
  }

  const objectTypeNode = typeNode.getObjectTypeNode();
  const indexTypeNode = typeNode.getIndexTypeNode();

  const keys = resolveIndexedAccessKeys(indexTypeNode);
  if (!keys.length) {
    return parseTypeFallback(typeNode);
  }

  const objectValue = parsePropValue(objectTypeNode);
  if (objectValue.type !== Contract.Enums.ComponentPropType.Object) {
    return parseTypeFallback(typeNode);
  }

  const properties = objectValue.properties ?? [];
  const matchedProperties = keys
    .map((key) => properties.find((property) => property.key === key))
    .filter((property): property is Openapi.Models.ComponentManifestPropModel =>
      Boolean(property),
    );

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

function resolveIndexedAccessKeys(typeNode: TypeNode): string[] {
  if (typeNode.isKind(SyntaxKind.ParenthesizedType)) {
    return resolveIndexedAccessKeys(typeNode.getTypeNode());
  }

  if (typeNode.isKind(SyntaxKind.LiteralType)) {
    const literal = typeNode.getLiteral();

    if (literal.isKind(SyntaxKind.StringLiteral)) {
      return [literal.getLiteralValue()];
    }

    return [];
  }

  if (typeNode.isKind(SyntaxKind.UnionType)) {
    return typeNode
      .getTypeNodes()
      .flatMap((node) => resolveIndexedAccessKeys(node));
  }

  if (typeNode.isKind(SyntaxKind.TypeReference)) {
    const resolved = resolveTypeReferenceToTypeNode(typeNode);
    return resolved ? resolveIndexedAccessKeys(resolved) : [];
  }

  if (typeNode.isKind(SyntaxKind.IndexedAccessType)) {
    const resolved = resolveIndexedAccessTypeNode(typeNode);

    if (resolved?.type === Contract.Enums.ComponentPropType.StringEnum) {
      return resolved.values ?? [];
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

function parseUnionType(
  typeNode: TypeNode,
): Openapi.Models.ComponentManifestPropModel["value"] {
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

  const stringValues: string[] = [];
  const numberValues: number[] = [];

  for (const node of nodes) {
    if (!node.isKind(SyntaxKind.LiteralType)) {
      return parseTypeFallback(typeNode);
    }

    const literal = node.getLiteral();

    if (literal.isKind(SyntaxKind.StringLiteral)) {
      stringValues.push(literal.getLiteralValue());
      continue;
    }

    if (literal.isKind(SyntaxKind.NumericLiteral)) {
      numberValues.push(Number(literal.getText()));
      continue;
    }

    return parseTypeFallback(typeNode);
  }

  if (stringValues.length === nodes.length) {
    return {
      type: Contract.Enums.ComponentPropType.StringEnum,
      values: stringValues,
    };
  }

  if (numberValues.length === nodes.length) {
    return {
      type: Contract.Enums.ComponentPropType.NumberEnum,
      values: numberValues,
    };
  }

  return parseTypeFallback(typeNode);
}

function mergeIndexedAccessUnionValues(
  values: Openapi.Models.ComponentManifestPropModel["value"][],
  fallbackNode: TypeNode,
): Openapi.Models.ComponentManifestPropModel["value"] {
  const stringEnumValues = values.flatMap((value) => {
    if (value.type === Contract.Enums.ComponentPropType.String) {
      return [];
    }

    if (value.type === Contract.Enums.ComponentPropType.StringEnum) {
      return value.values ?? [];
    }

    return undefined;
  });

  if (!stringEnumValues.includes(undefined as never)) {
    return {
      type: Contract.Enums.ComponentPropType.StringEnum,
      values: stringEnumValues as string[],
    };
  }

  const numberEnumValues = values.flatMap((value) => {
    if (value.type === Contract.Enums.ComponentPropType.Number) {
      return [];
    }

    if (value.type === Contract.Enums.ComponentPropType.NumberEnum) {
      return value.values ?? [];
    }

    return undefined;
  });

  if (!numberEnumValues.includes(undefined as never)) {
    return {
      type: Contract.Enums.ComponentPropType.NumberEnum,
      values: numberEnumValues as number[],
    };
  }

  return parseTypeFallback(fallbackNode);
}

function parseTypeFallback(
  typeNode: TypeNode,
): Openapi.Models.ComponentManifestPropModel["value"] {
  const type = typeNode.getType();

  if (isStylePropertiesType(type)) {
    return {
      type: Contract.Enums.ComponentPropType.StyleProperties,
    };
  }

  if (type.isString()) {
    return {
      type: Contract.Enums.ComponentPropType.String,
    };
  }

  if (type.isNumber()) {
    return {
      type: Contract.Enums.ComponentPropType.Number,
    };
  }

  if (type.isBoolean()) {
    return {
      type: Contract.Enums.ComponentPropType.Boolean,
    };
  }

  return unknownValue(typeNode.getText());
}

function unknownValue(
  rawType?: string,
): Openapi.Models.ComponentManifestPropModel["value"] {
  return {
    type: Contract.Enums.ComponentPropType.Unknown,
    rawType,
  };
}

//TODO: 에러 던질때 path 나타나겠끔?
//컴포넌트가 define 안 한 factory, factoryMap에는 있는데 componentMap에 없으면 나중에 에러 내는 게 좋아요.
//key를 string 말고 , variableDeclaration 으로 해야 중첩이 안생길듯

//getTypeNode kind에 따라 나누다가 proptype enum에 맞게 propmodel를 만드는 함수를 만들어서 해야할듯
// 각 분기 하다가, ComponentPropType 별로 만들어서 분기해서 하나의 함수로 만들면 될듯?
// ComponentPropType에 해당하는 ButtonBase의 예시를 다 달라고 하면 될듯

parseComponent({
  cwd: path.resolve(process.cwd(), "../../apps/component-lab"),
  pattern: "src/**/*.component.tsx",
  out: path.resolve(process.cwd(), "generated/componentManifest.json"),
});

export { COMPONENT_MANIFEST_VERSION, parseComponent };
