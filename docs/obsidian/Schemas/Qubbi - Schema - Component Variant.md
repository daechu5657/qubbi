---
type: schema
entity: component_variant
collection: component-variants
updated: 2026-03-25
source: apps/server/src/schemas/component/component-variant.schema.ts
tags:
  - qubbi
  - qubbi/schema
  - qubbi/schema/component
---

# Qubbi Schema: Component Variant

> [!summary]
> Variant rows associated with a component (`default`, `disabled`, `submit`, etc).

## Field Spec

| Field | Type | Required | Default | Indexed | Notes |
| --- | --- | --- | --- | --- | --- |
| `_id` | `ObjectId` | yes | auto | implicit | document identifier |
| `projectId` | `ObjectId` | yes | none | no | tenant/project scope |
| `componentId` | `ObjectId` | yes | none | no | parent component id |
| `key` | `string` | yes | none | no | programmatic variant key |
| `name` | `string` | yes | none | no | display name |
| `order` | `number` | yes | none | no | sort order |
| `createdTime` | `Date` | yes | `new Date()` | no | creation timestamp |
| `updatedTime` | `Date` | yes | `new Date()` | no | update timestamp |
| `deletedTime` | `Date` | no | `null` | no | soft-delete timestamp |

## Relations

- Belongs to [[Schemas/Qubbi - Schema - Component]] by `componentId`.
- Can be referenced by [[Schemas/Qubbi - Schema - Component Prop]] via `variantId`.

## Linked Notes

- [[Schemas/Qubbi - Schema - Overview]]
- [[Schemas/Qubbi - Schema - Component]]
- [[Schemas/Qubbi - Schema - Component Prop]]
