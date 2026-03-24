---
type: schema
entity: component_prop
collection: component-props
updated: 2026-03-25
source: apps/server/src/schemas/component/component-prop.schema.ts
tags:
  - qubbi
  - qubbi/schema
  - qubbi/schema/component
---

# Qubbi Schema: Component Prop

> [!summary]
> Base/variant property container. Each row represents either style props or behavior props.

## Field Spec

| Field | Type | Required | Default | Indexed | Notes |
| --- | --- | --- | --- | --- | --- |
| `_id` | `ObjectId` | yes | auto | implicit | document identifier |
| `projectId` | `ObjectId` | yes | none | no | tenant/project scope |
| `componentId` | `ObjectId` | yes | none | no | parent component id |
| `variantId` | `ObjectId \| null` | no | `null` | no | `null` means base props; value means variant override |
| `kind` | `number` enum | yes | none | no | `ComponentPropKind` (`Style`, `Behavior`) |
| `order` | `number` | no | `0` | no | display/order position |
| `createdTime` | `Date` | no | `new Date()` | no | creation timestamp |
| `updatedTime` | `Date` | no | `new Date()` | no | update timestamp |
| `deletedTime` | `Date \| null` | no | `null` | no | soft-delete timestamp |

## Relations

- Belongs to [[Schemas/Qubbi - Schema - Component]] by `componentId`.
- Optional link to [[Schemas/Qubbi - Schema - Component Variant]] by `variantId`.
- If `kind=Style`, expands into [[Schemas/Qubbi - Schema - Component Style]] (`propId`).
- If `kind=Behavior`, expands into [[Schemas/Qubbi - Schema - Component Behavior]] (`propId`).

## Contract Coupling

- Enum source: [[Packages/Qubbi - Package - Contract]] (`ComponentPropKind`).

## Linked Notes

- [[Schemas/Qubbi - Schema - Overview]]
- [[Schemas/Qubbi - Schema - Component]]
