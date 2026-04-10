---
tags:
  - schema
  - component-catalog
  - authoring
---

# ComponentDefinition

## Role

- Authoring contract used in `reference-component`
- Input payload shape sent to the server
- Not a persisted server schema

## Shape

```ts
export interface ComponentDefinition<Variant extends string = string> {
  name: string;
  tagName: string;
  baseProps: ComponentPropDefinition[];
  variants: Variant[];
  variantOverrides: Partial<Record<Variant, ComponentPropDefinition[]>>;
}
```

## Notes

- This type exists so component literals can be authored in TypeScript.
- The server decomposes each uploaded literal into [[Component]], [[ComponentVersion]], [[ComponentVariant]], [[ComponentProp]], [[ComponentStyle]], and [[ComponentBehavior]].
- Version metadata does not need to live inside this literal. It can be attached by upload context or package metadata and persisted in [[ComponentVersion]].

## Connected Notes

- [[Component]]
- [[ComponentVersion]]
- [[ComponentVariant]]
- [[ComponentProp]]
- [[ComponentManifest]]

