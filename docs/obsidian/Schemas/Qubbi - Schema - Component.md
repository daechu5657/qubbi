---
type: schema
entity: component
collection: components
updated: 2026-03-25
source: apps/server/src/schemas/component/component.schema.ts
tags:
  - qubbi
  - qubbi/schema
  - qubbi/schema/component
---

# Qubbi Schema: Component

> [!summary]
> Root entity for component manifests.

## Field Spec

| Field | Type | Required | Default | Indexed | Notes |
| --- | --- | --- | --- | --- | --- |
| `_id` | `ObjectId` | yes | auto | implicit | document identifier |
| `projectId` | `ObjectId` | yes | none | no | tenant/project scope |
| `defaultVariantId` | `ObjectId` | yes | none | no | points to default row in `component-variants` |
| `name` | `string` | yes | none | no | component display key |
| `tagName` | `string` | yes | none | no | HTML tag intent |
| `createdTime` | `Date` | yes | `new Date()` | no | creation timestamp |
| `updatedTime` | `Date` | yes | `new Date()` | no | update timestamp |
| `deletedTime` | `Date` | no | `null` | no | soft-delete timestamp |

## Relations

- One component can have many [[Schemas/Qubbi - Schema - Component Variant]] rows.
- One component can have many [[Schemas/Qubbi - Schema - Component Prop]] rows.
- `defaultVariantId` should reference one of its own variants.

## Linked Notes

- [[Schemas/Qubbi - Schema - Overview]]
- [[Schemas/Qubbi - Schema - Component Variant]]
- [[Schemas/Qubbi - Schema - Component Prop]]
