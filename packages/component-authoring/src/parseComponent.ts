import * as Openapi from "@qubbi/openapi";
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

//TODO: 에러 던질때 path 나타나겠끔?
//컴포넌트가 define 안 한 factory, factoryMap에는 있는데 componentMap에 없으면 나중에 에러 내는 게 좋아요.

parseComponent({
  cwd: path.resolve(process.cwd(), "../../apps/component-lab"),
  pattern: "src/**/*.component.tsx",
  out: path.resolve(process.cwd(), "generated/componentManifest.json"),
});

export { COMPONENT_MANIFEST_VERSION, parseComponent };
