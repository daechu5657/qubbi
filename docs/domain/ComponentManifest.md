---
tags:
  - schema
  - component-catalog
  - read-model
---

# ComponentManifest

## Role

- Reassembled read model built from normalized component schemas
- Returned by the server after decomposition and storage
- Not the ownership source of component data

## Fields

- `componentId`
- `componentVersionId`
- `name`
- `version`
- `tagName`
- `variants`
- `baseProps`
- `variantOverrides`
- `createdTime`
- `deletedTime`

## Shape Notes

- `variants` is a read-model array built from [[ComponentVariant]]
- `baseProps` is built from [[ComponentProp]] where `variantId = null`
- `variantOverrides` is grouped by variant key from [[ComponentVariant]]
- Nested style metadata comes from [[ComponentStyle]]
- Nested behavior metadata comes from [[ComponentBehavior]]

## Rules

- No `projectId`
- This is a projection over global component schemas
- If a project uses a component, it should reference [[ComponentVersion]], not own its own manifest rows

## Connected Notes

- [[Component]]
- [[ComponentVersion]]
- [[ComponentVariant]]
- [[ComponentProp]]
- [[ComponentStyle]]
- [[ComponentBehavior]]
- [[ComponentManifestModel]]
- [[Project]]
- [[PageTree]]

