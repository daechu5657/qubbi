---
tags:
  - schema
  - component-catalog
---

# ComponentVersion

## Role

- Immutable server-side version record for a component definition upload
- The actual project-facing selection unit

## Fields

- `id`
- `componentId`
- `version`
- `tagName`
- `createdTime`
- `deletedTime`

## Rules

- Immutable
- No `projectId`
- Projects reference this record to declare which component versions they use
- A single [[Component]] can have many [[ComponentVersion]] records

## Connected Notes

- [[Component]]
- [[ComponentVariant]]
- [[ComponentProp]]
- [[ComponentManifest]]
- [[Project]]
- [[PageTree]]
- [[Revision]]

