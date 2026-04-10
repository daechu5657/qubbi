---
tags:
  - schema
  - component-catalog
  - snapshot
---

# PageTreeSnapshot

## Role

- Revision-time full node snapshot

## Recommended Fields

- `revisionId`
- `id`
- `projectId`
- `pageId`
- `componentVersionId`
- `variantId`
- `parent`
- `children`
- `propsOverride: ComponentPropOverride[]`
- `order`
- `createdTime`
- `deletedTime`

## Rules

- `id` is the source `pageTreeId`
- `children` preserves deleted child ids from that revision
- Component data is still referenced through the global [[ComponentVersion]] catalog

## Connected Notes

- [[Revision]]
- [[PageTree]]
- [[ComponentVersion]]
- [[ComponentVariant]]
- [[ComponentPropOverride]]

