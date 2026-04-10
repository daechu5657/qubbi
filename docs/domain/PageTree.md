---
tags:
  - schema
  - component-catalog
---

# PageTree

## Role

- Runtime instance node rendered inside a page

## Recommended Fields

- `id`
- `projectId`
- `pageId`
- `componentVersionId`
- `parent`
- `children`
- `order`
- `createdTime`
- `deletedTime`
- `variantId`
- `propsOverride: ComponentPropOverride[]`

## Naming Note

- If the current model still uses `componentManifestId`, the recommended correction is to rename it to `componentVersionId`.
- If rename is not possible yet, `componentManifestId` should be treated semantically as a `componentVersionId` reference because [[ComponentManifest]] is only a derived read model.

## Rules

- `pageTreeId` is immutable
- The node references [[ComponentVersion]] and [[ComponentVariant]] ids, not a project-owned component record
- Final render data comes from [[ComponentManifest]] plus `propsOverride`

## Connected Notes

- [[Project]]
- [[ComponentVersion]]
- [[ComponentVariant]]
- [[ComponentManifest]]
- [[ComponentPropOverride]]
- [[PageTreeSnapshot]]

