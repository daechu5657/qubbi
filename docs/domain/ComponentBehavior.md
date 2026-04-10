---
tags:
  - schema
  - component-catalog
---

# ComponentBehavior

## Role

- Atomic behavior-definition row under one [[ComponentProp]]

## Fields

- `id`
- `propId`
- `key`
- `createdTime`
- `deletedTime`

## Rules

- No `projectId`
- Holds only schema metadata, not runtime enabled state
- Runtime enabled state belongs in [[ComponentPropOverride]]

## Connected Notes

- [[ComponentProp]]
- [[ComponentManifest]]
- [[ComponentPropOverride]]

