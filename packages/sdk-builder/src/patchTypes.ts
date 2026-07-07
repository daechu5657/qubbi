import path from "node:path";
import ts from "typescript";

type EnumMember = {
  name: string;
  value: string | number;
};

type EnumInfo = {
  name: string;
  members: EnumMember[];
};

type EnumUsage = {
  enumName: string;
  memberName?: string;
};

type ServerCollect = {
  enums: Map<string, EnumInfo>;
  propertyEnums: Map<string, Map<string, EnumUsage>>;
};

const CSSTYPE_IMPORT = `import type { Properties } from "csstype";`;

export function patchTypes({
  sourceText,
  serverRoot,
  tsconfig = "./tsconfig.json",
}: {
  sourceText: string;
  serverRoot: string;
  tsconfig?: string;
}) {
  const server = collectServer({
    serverRoot,
    tsconfig,
  });

  const source = ts.createSourceFile(
    "openapi.ts",
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  const components = getComponentsAlias(source);
  if (!components) return sourceText;

  const schemas = getSchemasTypeLiteral(components);
  if (!schemas) return sourceText;

  const modelNames = new Set<string>();
  const usedEnumNames = new Set<string>();

  for (const member of schemas.members) {
    if (!ts.isPropertySignature(member) || !member.type) continue;

    const schemaName = getName(member.name);
    if (!schemaName) continue;

    if (
      ts.isTypeLiteralNode(member.type) &&
      !isCssPropertiesSchemaName(schemaName)
    ) {
      modelNames.add(schemaName);
    }
  }

  const modelsCode = buildModelsNamespace({
    source,
    schemas,
    server,
    modelNames,
    usedEnumNames,
  });

  const enumsCode = buildEnumsNamespace({
    server,
    usedEnumNames,
  });

  const withoutComponents =
    sourceText.slice(0, components.getFullStart()) +
    sourceText.slice(components.end);

  const rewrittenRefs = replaceSchemaRefs({
    text: withoutComponents,
    modelNames,
    enumNames: usedEnumNames,
  });

  return [CSSTYPE_IMPORT, rewrittenRefs.trimEnd(), modelsCode, enumsCode]
    .filter(Boolean)
    .join("\n\n");
}

function collectServer({
  serverRoot,
  tsconfig,
}: {
  serverRoot: string;
  tsconfig: string;
}): ServerCollect {
  const program = createProgram(path.resolve(serverRoot, tsconfig));

  const enums = collectEnums(program);
  const propertyEnums = collectPropertyEnums(program, enums);

  return { enums, propertyEnums };
}

function createProgram(tsconfigPath: string) {
  const config = ts.readConfigFile(tsconfigPath, ts.sys.readFile);

  if (config.error) {
    throw new Error(
      ts.flattenDiagnosticMessageText(config.error.messageText, "\n"),
    );
  }

  const parsed = ts.parseJsonConfigFileContent(
    config.config,
    ts.sys,
    path.dirname(tsconfigPath),
  );

  return ts.createProgram(parsed.fileNames, parsed.options);
}

function collectEnums(program: ts.Program) {
  const result = new Map<string, EnumInfo>();

  for (const sourceFile of program.getSourceFiles()) {
    if (sourceFile.isDeclarationFile) continue;

    ts.forEachChild(sourceFile, function visit(node) {
      if (ts.isEnumDeclaration(node)) {
        const members: EnumMember[] = [];

        for (const member of node.members) {
          const name = member.name.getText(sourceFile);
          const initializer = member.initializer;

          if (initializer && ts.isStringLiteral(initializer)) {
            members.push({ name, value: initializer.text });
          } else if (initializer && ts.isNumericLiteral(initializer)) {
            members.push({ name, value: Number(initializer.text) });
          }
        }

        result.set(node.name.text, {
          name: node.name.text,
          members,
        });
      }

      ts.forEachChild(node, visit);
    });
  }

  return result;
}

function collectPropertyEnums(
  program: ts.Program,
  enums: Map<string, EnumInfo>,
) {
  const result = new Map<string, Map<string, EnumUsage>>();

  for (const sourceFile of program.getSourceFiles()) {
    if (sourceFile.isDeclarationFile) continue;

    ts.forEachChild(sourceFile, function visit(node) {
      if (!ts.isClassDeclaration(node) || !node.name) {
        ts.forEachChild(node, visit);
        return;
      }

      const modelName = node.name.text;

      for (const member of node.members) {
        if (!ts.isPropertyDeclaration(member) || !member.type) continue;

        const propertyName = getName(member.name);
        if (!propertyName) continue;

        const enumUsage = getEnumUsage(member.type, enums);
        if (!enumUsage) continue;

        const properties =
          result.get(modelName) ?? new Map<string, EnumUsage>();
        properties.set(propertyName, enumUsage);
        result.set(modelName, properties);
      }

      ts.forEachChild(node, visit);
    });
  }

  return result;
}

function getEnumUsage(
  typeNode: ts.TypeNode,
  enums: Map<string, EnumInfo>,
): EnumUsage | undefined {
  if (ts.isTypeReferenceNode(typeNode)) {
    const typeName = typeNode.typeName;

    if (ts.isIdentifier(typeName) && enums.has(typeName.text)) {
      return { enumName: typeName.text };
    }

    if (ts.isQualifiedName(typeName)) {
      const enumName = getEntityNameText(typeName.left);
      const memberName = typeName.right.text;

      if (enums.has(enumName)) {
        return { enumName, memberName };
      }
    }
  }

  if (ts.isIndexedAccessTypeNode(typeNode)) {
    const objectType = typeNode.objectType;
    const indexType = typeNode.indexType;

    if (
      ts.isTypeReferenceNode(objectType) &&
      ts.isIdentifier(objectType.typeName) &&
      enums.has(objectType.typeName.text) &&
      ts.isLiteralTypeNode(indexType) &&
      ts.isStringLiteral(indexType.literal)
    ) {
      return {
        enumName: objectType.typeName.text,
        memberName: indexType.literal.text,
      };
    }
  }

  return undefined;
}

function getEntityNameText(name: ts.EntityName): string {
  if (ts.isIdentifier(name)) return name.text;
  return `${getEntityNameText(name.left)}.${name.right.text}`;
}

function buildModelsNamespace({
  source,
  schemas,
  server,
  modelNames,
  usedEnumNames,
}: {
  source: ts.SourceFile;
  schemas: ts.TypeLiteralNode;
  server: ServerCollect;
  modelNames: Set<string>;
  usedEnumNames: Set<string>;
}) {
  const chunks: string[] = [`export namespace Models {`];

  for (const schemaMember of schemas.members) {
    if (!ts.isPropertySignature(schemaMember)) continue;
    if (!schemaMember.type || !ts.isTypeLiteralNode(schemaMember.type))
      continue;

    const modelName = getName(schemaMember.name);
    if (!modelName) continue;
    if (isCssPropertiesSchemaName(modelName)) continue;

    chunks.push(`  export interface ${modelName} {`);

    for (const member of schemaMember.type.members) {
      if (!ts.isPropertySignature(member) || !member.type) continue;

      const propertyName = getName(member.name);
      if (!propertyName) continue;

      const specialTypeText = getSpecialTypeText({
        modelName,
        propertyName,
      });

      if (specialTypeText) {
        chunks.push(
          `    ${printPropertyName(member.name)}${member.questionToken ? "?" : ""}: ${specialTypeText};`,
        );

        continue;
      }

      const matchedEnum = getMatchedEnumType({
        source,
        modelName,
        propertyName,
        member,
        server,
      });

      if (matchedEnum) {
        usedEnumNames.add(matchedEnum.enumName);

        chunks.push(
          `    ${printPropertyName(member.name)}${member.questionToken ? "?" : ""}: ${matchedEnum.typeText};`,
        );

        continue;
      }

      const typeText = replaceSchemaRefs({
        text: member.type.getText(source),
        modelNames,
        enumNames: usedEnumNames,
      });

      chunks.push(
        `${formatMemberJsDocs(member, source)}    ${printPropertyName(member.name)}${member.questionToken ? "?" : ""}: ${typeText};`,
      );
      continue;
    }

    for (const member of schemaMember.type.members) {
      if (ts.isPropertySignature(member)) continue;

      const text = replaceSchemaRefs({
        text: member.getText(source),
        modelNames,
        enumNames: usedEnumNames,
      });
      chunks.push(indentBlock(text, 4));
    }

    chunks.push(`  }`, ``);
  }

  chunks.push(`}`);

  return chunks.join("\n");
}

function getMatchedEnumType({
  source,
  modelName,
  propertyName,
  member,
  server,
}: {
  source: ts.SourceFile;
  modelName: string;
  propertyName: string;
  member: ts.PropertySignature;
  server: ServerCollect;
}) {
  if (!hasEnumFlag(member)) return undefined;

  const usage = server.propertyEnums.get(modelName)?.get(propertyName);
  if (!usage) return undefined;

  const enumInfo = server.enums.get(usage.enumName);
  if (!enumInfo || !member.type) return undefined;

  const generatedValues = getLiteralValues(member.type, source);

  if (usage.memberName) {
    const enumMember = enumInfo.members.find(
      (member) => member.name === usage.memberName,
    );

    if (!enumMember) return undefined;
    if (generatedValues.length !== 1) return undefined;
    if (generatedValues[0] !== enumMember.value) return undefined;

    return {
      enumName: usage.enumName,
      typeText: `Enums.${usage.enumName}.${usage.memberName}`,
    };
  }

  const serverValues = enumInfo.members.map((x) => x.value);

  if (!sameValues(generatedValues, serverValues)) return undefined;

  return {
    enumName: usage.enumName,
    typeText: `Enums.${usage.enumName}`,
  };
}

function buildEnumsNamespace({
  server,
  usedEnumNames,
}: {
  server: ServerCollect;
  usedEnumNames: Set<string>;
}) {
  if (usedEnumNames.size === 0) return "";

  const chunks: string[] = [`export namespace Enums {`];

  for (const enumName of usedEnumNames) {
    const enumInfo = server.enums.get(enumName);
    if (!enumInfo) continue;

    chunks.push(`  export enum ${enumName} {`);

    for (const member of enumInfo.members) {
      chunks.push(`    ${member.name} = ${JSON.stringify(member.value)},`);
    }

    chunks.push(`  }`, ``);
  }

  chunks.push(`}`);

  return chunks.join("\n");
}

function hasEnumFlag(node: ts.Node) {
  return ts.getJSDocTags(node).some((tag) => tag.tagName.getText() === "enum");
}

function getLiteralValues(
  typeNode: ts.TypeNode,
  source: ts.SourceFile,
): Array<string | number> {
  if (ts.isUnionTypeNode(typeNode)) {
    return typeNode.types.flatMap((node) => getLiteralValues(node, source));
  }

  if (!ts.isLiteralTypeNode(typeNode)) return [];

  const literal = typeNode.literal;

  if (ts.isStringLiteral(literal)) {
    return [literal.text];
  }

  if (ts.isNumericLiteral(literal)) {
    return [Number(literal.text)];
  }

  const text = literal.getText(source);
  if (text.startsWith("-")) return [Number(text)];

  return [];
}

function sameValues(
  left: Array<string | number>,
  right: Array<string | number>,
) {
  if (left.length !== right.length) return false;

  const a = [...left].sort();
  const b = [...right].sort();

  return a.every((value, index) => value === b[index]);
}

function replaceSchemaRefs({
  text,
  modelNames,
  enumNames,
}: {
  text: string;
  modelNames: Set<string>;
  enumNames: Set<string>;
}) {
  return text.replace(
    /components\["schemas"\]\["([^"]+)"\]/g,
    (_, schemaName: string) => {
      if (isCssPropertiesSchemaName(schemaName)) return "Properties";
      if (modelNames.has(schemaName)) return `Models.${schemaName}`;
      if (enumNames.has(schemaName)) return `Enums.${schemaName}`;
      return `components["schemas"]["${schemaName}"]`;
    },
  );
}

function getName(name: ts.PropertyName) {
  if (ts.isIdentifier(name)) return name.text;
  if (ts.isStringLiteral(name)) return name.text;
  if (ts.isNumericLiteral(name)) return name.text;
  return undefined;
}

function printPropertyName(name: ts.PropertyName) {
  if (ts.isIdentifier(name)) return name.text;
  if (ts.isStringLiteral(name)) return JSON.stringify(name.text);
  if (ts.isNumericLiteral(name)) return JSON.stringify(name.text);
  return name.getText();
}

function formatMemberJsDocs(member: ts.Node, source: ts.SourceFile) {
  const docs = ts.getJSDocCommentsAndTags(member).filter(ts.isJSDoc);
  if (docs.length === 0) return "";

  return docs
    .map((doc) => indentBlock(doc.getText(source), 4))
    .join("\n")
    .concat("\n");
}

function indentBlock(text: string, spaces: number) {
  const indent = " ".repeat(spaces);
  return text
    .split("\n")
    .map((line) => `${indent}${line}`)
    .join("\n");
}

function getSpecialTypeText({
  modelName,
  propertyName,
}: {
  modelName: string;
  propertyName: string;
}) {
  if (
    modelName === "ComponentManifestStylePropertiesPropValueModel" &&
    propertyName === "defaultValue"
  ) {
    return "Properties";
  }

  if (
    modelName === "ComponentManifestStyleModel" &&
    propertyName === "cssProperty"
  ) {
    return "keyof Properties";
  }

  return undefined;
}

function isCssPropertiesSchemaName(schemaName: string) {
  return /^Properties\d*\(string\)string$/.test(schemaName);
}

function getComponentsAlias(source: ts.SourceFile) {
  return source.statements.find(
    (node): node is ts.TypeAliasDeclaration =>
      ts.isTypeAliasDeclaration(node) && node.name.text === "components",
  );
}

function getSchemasTypeLiteral(components: ts.TypeAliasDeclaration) {
  if (!ts.isTypeLiteralNode(components.type)) return undefined;

  const schemas = components.type.members.find(
    (member): member is ts.PropertySignature =>
      ts.isPropertySignature(member) && getName(member.name) === "schemas",
  );

  if (!schemas?.type || !ts.isTypeLiteralNode(schemas.type)) {
    return undefined;
  }

  return schemas.type;
}
