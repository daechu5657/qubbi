---
type: schema
entity: component_style
collection: component_styles
updated: 2026-03-25
source: apps/server/src/schemas/component/component-style.schema.ts
tags:
  - qubbi
  - qubbi/schema
  - qubbi/schema/component
---

# Qubbi Schema: Component Style

> [!summary]
> Style metadata rows linked to `component-props` entries of `kind=Style`.

## Field Spec

| Field | Type | Required | Default | Indexed | Notes |
| --- | --- | --- | --- | --- | --- |
| `_id` | `ObjectId` | yes | auto | implicit | document identifier |
| `projectId` | `ObjectId` | yes | none | yes | tenant/project scope |
| `propId` | `ObjectId` | yes | none | yes | points to `component-props._id` |
| `key` | `string` | yes | none | no | internal style key |
| `name` | `string` | yes | none | no | display name |
| `cssProperty` | `string` | yes | none | no | CSS property name |
| `valueType` | `number` enum | yes | none | no | `StyleValueType` (`String`, `Number`) |
| `unit` | `number` enum \| `null` | no | `null` | no | `StyleValueUnit` (`Px`, `Rem`, `Percent`) |
| `designTokenIds` | `ObjectId[]` | no | `[]` | no | candidate design token ids |
| `createdTime` | `Date` | no | `new Date()` | no | creation timestamp |
| `updatedTime` | `Date` | no | `new Date()` | no | update timestamp |
| `deletedTime` | `Date \| null` | no | `null` | no | soft-delete timestamp |

## Relations

- Parent: [[Schemas/Qubbi - Schema - Component Prop]] via `propId`.
- Child values: [[Schemas/Qubbi - Schema - Component Style Value]] via `styleId`.

## Contract Coupling

- Enum source: [[Packages/Qubbi - Package - Contract]]
- `StyleValueType`
- `StyleValueUnit`

## Linked Notes

- [[Schemas/Qubbi - Schema - Overview]]
- [[Schemas/Qubbi - Schema - Component Style Value]]
