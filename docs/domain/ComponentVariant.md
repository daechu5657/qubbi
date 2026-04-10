---
tags:
  - schema
  - component-catalog
---

# ComponentVariant

## Role

- Persisted variant row for one [[ComponentVersion]]

## Fields

- `id`
- `componentVersionId`
- `key`
- `name`
- `order`
- `createdTime`
- `deletedTime`

## Rules

- No `projectId`
- `key` is the authoring-time variant key from [[ComponentDefinition]]
- `id` is the stable runtime reference used by [[PageTree]]

## Connected Notes

- [[ComponentDefinition]]
- [[ComponentVersion]]
- [[ComponentProp]]
- [[ComponentManifest]]
- [[PageTree]]

