---
tags:
  - schema
  - component-catalog
---

# ComponentStyle

## Role

- Atomic style-definition row under one [[ComponentProp]]

## Fields

- `id`
- `propId`
- `key`
- `name`
- `cssProperty`
- `valueType`
- `unit`
- `createdTime`
- `deletedTime`

## Rules

- No `projectId`
- Holds only schema metadata, not project values
- Project values belong in [[ComponentPropOverride]]

## Connected Notes

- [[ComponentProp]]
- [[ComponentManifest]]
- [[ComponentPropOverride]]

