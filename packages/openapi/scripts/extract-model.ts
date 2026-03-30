import {
  ModuleDeclaration,
  Project,
  PropertySignature,
  SourceFile,
  SyntaxKind,
  TypeNode,
} from "ts-morph";

const NAMESPACE_NAME = "Models";

function removeDuplication(source: SourceFile) {
  for (const existingModule of source.getModules()) {
    if (existingModule.getName() === NAMESPACE_NAME) {
      existingModule.remove();
    }
  }
}

function addSchemaModel(p: PropertySignature, module: ModuleDeclaration) {
  const target = module.addInterface({
    name: p.getName(),
    isExported: true,
  });

  const properties = p
    .getTypeNodeOrThrow()
    .asKindOrThrow(SyntaxKind.TypeLiteral)
    .getProperties();

  for (const prop of properties) {
    target.addProperty(prop.getStructure());
  }
}

function parseFirstSchemaRefName(typeText: string) {
  const matches = [
    ...typeText.matchAll(/components\["schemas"\]\["([^"]+)"\]/g),
  ];

  return matches.map((m) => m[1])[0];
}

function isKeywordKind(kind: SyntaxKind) {
  return (
    kind === SyntaxKind.StringKeyword ||
    kind === SyntaxKind.NumberKeyword ||
    kind === SyntaxKind.BooleanKeyword ||
    kind === SyntaxKind.NullKeyword ||
    kind === SyntaxKind.UndefinedKeyword ||
    kind === SyntaxKind.UnknownKeyword ||
    kind === SyntaxKind.AnyKeyword ||
    kind === SyntaxKind.NeverKeyword ||
    kind === SyntaxKind.ObjectKeyword ||
    kind === SyntaxKind.BigIntKeyword ||
    kind === SyntaxKind.VoidKeyword
  );
}

function isKeywordTypeNode(tn: TypeNode) {
  return isKeywordKind(tn.getKind());
}

function toModelTypeText(tn: TypeNode, modelNames: Set<string>): string | null {
  if (isKeywordKind(tn.getKind())) {
    return tn.getText();
  }

  if (tn.isKind(SyntaxKind.IndexedAccessType)) {
    const modelName = parseFirstSchemaRefName(tn.getText());
    if (modelName && modelNames.has(modelName)) {
      return `${NAMESPACE_NAME}.${modelName}`;
    }
    return null;
  }

  if (tn.isKind(SyntaxKind.ArrayType)) {
    const elementTypeNode = tn.getElementTypeNode();

    if (elementTypeNode.isKind(SyntaxKind.ParenthesizedType)) {
      const inner = elementTypeNode.getTypeNode();
      const next = toModelTypeText(inner, modelNames);
      if (next) {
        return `(${next})[]`;
      }

      return null;
    }

    if (isKeywordTypeNode(elementTypeNode)) {
      return tn.getText();
    }

    const modelName = parseFirstSchemaRefName(elementTypeNode.getText());
    if (modelName && modelNames.has(modelName)) {
      return `${NAMESPACE_NAME}.${modelName}[]`;
    }

    return null;
  }

  if (tn.isKind(SyntaxKind.ParenthesizedType)) {
    const inner = tn.asKindOrThrow(SyntaxKind.ParenthesizedType).getTypeNode();
    return toModelTypeText(inner, modelNames);
  }

  if (tn.isKind(SyntaxKind.UnionType)) {
    const members = tn.asKindOrThrow(SyntaxKind.UnionType).getTypeNodes();
    const nextMembers: string[] = [];
    let hasModel = false;

    for (const member of members) {
      if (isKeywordTypeNode(member)) {
        nextMembers.push(member.getText());
        continue;
      }

      const modelName = parseFirstSchemaRefName(member.getText());
      if (modelName && modelNames.has(modelName)) {
        nextMembers.push(`${NAMESPACE_NAME}.${modelName}`);
        hasModel = true;
        continue;
      }

      return null;
    }

    return hasModel ? nextMembers.join(" | ") : tn.getText();
  }

  return null;
}

function editRequest(modelNames: Set<string>, p?: PropertySignature) {
  if (!p) {
    return;
  }

  const tn = p.getTypeNodeOrThrow();
  if (tn.isKind(SyntaxKind.NeverKeyword)) {
    return;
  }

  const targetTypeNode = tn
    .asKindOrThrow(SyntaxKind.TypeLiteral)
    .getPropertyOrThrow("content")
    .getTypeNodeOrThrow()
    .asKindOrThrow(SyntaxKind.TypeLiteral)
    .getPropertyOrThrow(`"application/json"`)
    .getTypeNodeOrThrow();

  const nextTypeText = toModelTypeText(targetTypeNode, modelNames);
  if (nextTypeText) {
    targetTypeNode.replaceWithText(nextTypeText);
  }
}

function editResponse(modelNames: Set<string>, p?: PropertySignature) {
  if (!p) {
    return;
  }

  const tn = p
    .getTypeNodeOrThrow()
    .asKindOrThrow(SyntaxKind.TypeLiteral)
    .getPropertyOrThrow("200")
    .getTypeNodeOrThrow()
    .asKindOrThrow(SyntaxKind.TypeLiteral)
    .getPropertyOrThrow("content")
    .getTypeNodeOrThrow();

  if (tn.isKind(SyntaxKind.NeverKeyword)) {
    return;
  }

  const targetTypeNode = tn
    .asKindOrThrow(SyntaxKind.TypeLiteral)
    .getPropertyOrThrow(`"application/json"`)
    .getTypeNodeOrThrow();

  const nextTypeText = toModelTypeText(targetTypeNode, modelNames);
  if (nextTypeText) {
    targetTypeNode.replaceWithText(nextTypeText);
  }
}

async function main() {
  const project = new Project();
  const source = project.addSourceFileAtPath("./src/generated.ts");
  removeDuplication(source);

  const modelNamespace = source.addModule({
    name: NAMESPACE_NAME,
    isExported: true,
  });

  const components = source.getInterfaceOrThrow("components");
  const schemasTypeNode = components
    .getPropertyOrThrow("schemas")
    .getTypeNodeOrThrow()
    .asKindOrThrow(SyntaxKind.TypeLiteral);

  const modelNames = new Set<string>();
  for (const p of schemasTypeNode.getProperties()) {
    addSchemaModel(p, modelNamespace);
    modelNames.add(p.getName());
  }

  const operations = source.getInterfaceOrThrow("operations");
  for (const op of operations.getProperties()) {
    const operationTypeNode = op
      .getTypeNodeOrThrow()
      .asKindOrThrow(SyntaxKind.TypeLiteral);

    editRequest(modelNames, operationTypeNode.getProperty("requestBody"));
    editResponse(modelNames, operationTypeNode.getProperty("responses"));
  }

  await project.save();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
