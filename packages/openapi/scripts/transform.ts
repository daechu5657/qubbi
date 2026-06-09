import {
  ModuleDeclaration,
  Project,
  PropertySignature,
  SourceFile,
  SyntaxKind,
} from "ts-morph";
import * as Contract from "@qubbi/contract";

const MODELS_NAMESPACE_NAME = "Models";
const ENUMS_NAMESPACE_NAME = "Enums";
const contractEnumNames = new Set(Object.keys(Contract.Enums));
const SCHEMA_REF_PATTERN = /^components\["schemas"\]\["([^"]+)"\]$/;

function removeDuplication(source: SourceFile) {
  for (const existingModule of source.getModules()) {
    if (
      existingModule.getName() === MODELS_NAMESPACE_NAME ||
      existingModule.getName() === ENUMS_NAMESPACE_NAME
    ) {
      existingModule.remove();
    }
  }
}

function addModel(p: PropertySignature, module: ModuleDeclaration) {
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

function hasEnumJsdocTag(p: PropertySignature) {
  for (const doc of p.getJsDocs()) {
    for (const tag of doc.getTags()) {
      if (tag.isKind(SyntaxKind.JSDocEnumTag)) {
        return true;
      }
    }
  }

  return false;
}

function addEnum(p: PropertySignature, module: ModuleDeclaration) {
  const name = p.getName();
  if (contractEnumNames.has(name)) {
    return;
  }

  const target = module.addEnum({
    name,
    isExported: true,
  });

  const typeNodes = p
    .getTypeNodeOrThrow()
    .asKindOrThrow(SyntaxKind.UnionType)
    .getTypeNodes();

  for (const tn of typeNodes) {
    if (!tn.isKind(SyntaxKind.LiteralType)) {
      continue;
    }

    const literal = tn.getLiteral();
    if (!literal.isKind(SyntaxKind.StringLiteral)) {
      continue;
    }

    target.addMember({
      name: tn.getText(),
      value: literal.getLiteralValue(),
    });
  }
}

function parseSchemaRefName(typeText: string) {
  return typeText.match(SCHEMA_REF_PATTERN)?.[1];
}

function getSchemaRefReplacement(
  schemaName: string,
  modelNames: Set<string>,
  enumNames: Set<string>,
) {
  if (modelNames.has(schemaName)) {
    return `${MODELS_NAMESPACE_NAME}.${schemaName}`;
  }

  if (contractEnumNames.has(schemaName)) {
    return `Contract.Enums.${schemaName}`;
  }

  if (enumNames.has(schemaName)) {
    return `${ENUMS_NAMESPACE_NAME}.${schemaName}`;
  }

  return null;
}

function replaceSchemaRefs(
  source: SourceFile,
  modelNames: Set<string>,
  enumNames: Set<string>,
) {
  const refs = source
    .getDescendantsOfKind(SyntaxKind.IndexedAccessType)
    .filter((tn) => parseSchemaRefName(tn.getText()));

  for (const ref of refs) {
    const schemaName = parseSchemaRefName(ref.getText());
    if (!schemaName) {
      continue;
    }

    const replacement = getSchemaRefReplacement(
      schemaName,
      modelNames,
      enumNames,
    );
    if (replacement) {
      ref.replaceWithText(replacement);
    }
  }
}

function ensureContractImport(source: SourceFile) {
  const contractImport = source.getImportDeclaration(
    (declaration) =>
      declaration.getModuleSpecifierValue() === "@qubbi/contract",
  );

  if (!contractImport) {
    source.insertImportDeclaration(0, {
      namespaceImport: "Contract",
      moduleSpecifier: "@qubbi/contract",
    });
  }
}

async function main() {
  const project = new Project();
  const source = project.addSourceFileAtPath("./src/generated.ts");

  const components = source.getInterface("components");
  if (!components) {
    return;
  }

  removeDuplication(source);

  const modelNamespace = source.addModule({
    name: MODELS_NAMESPACE_NAME,
    isExported: true,
  });

  const enumNamespace = source.addModule({
    name: ENUMS_NAMESPACE_NAME,
    isExported: true,
  });

  const schemasTypeNode = components
    .getPropertyOrThrow("schemas")
    .getTypeNodeOrThrow()
    .asKindOrThrow(SyntaxKind.TypeLiteral);

  const modelNames = new Set<string>();
  const enumNames = new Set<string>();
  let usesContractEnum = false;

  for (const p of schemasTypeNode.getProperties()) {
    const tn = p.getTypeNodeOrThrow();
    const name = p.getName();

    if (tn.isKind(SyntaxKind.TypeLiteral)) {
      addModel(p, modelNamespace);
      modelNames.add(name);
    } else if (hasEnumJsdocTag(p)) {
      addEnum(p, enumNamespace);
      enumNames.add(name);
      usesContractEnum ||= contractEnumNames.has(name);
    }
  }

  if (usesContractEnum) {
    ensureContractImport(source);
  }

  replaceSchemaRefs(source, modelNames, enumNames);
  components.remove();

  await project.save();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
