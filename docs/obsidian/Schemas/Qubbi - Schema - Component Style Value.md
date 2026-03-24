---
type: schema
entity: component_style_value
collection: component_style_values
updated: 2026-03-25
source: apps/server/src/schemas/component/component-style-value.schema.ts
tags:
  - qubbi
  - qubbi/schema
  - qubbi/schema/component
---

# Qubbi Schema: Component Style Value

> [!summary]
> Concrete value storage for each style row. Supports unset/literal/design-token modes.

## Field Spec

| Field | Type | Required | Default | Indexed | Notes |
| --- | --- | --- | --- | --- | --- |
| `_id` | `ObjectId` | yes | auto | implicit | document identifier |
| `projectId` | `ObjectId` | yes | none | yes | tenant/project scope |
| `styleId` | `ObjectId` | yes | none | yes | points to `component_styles._id` |
| `kind` | `number` enum | yes | none | no | `ComponentPropStyleValueKind` (`Unset`, `Literal`, `DesignToken`) |
| `designTokenId` | `ObjectId \| null` | no | `null` | no | used when `kind=DesignToken` |
| `designTokenValueId` | `ObjectId \| null` | no | `null` | no | used when `kind=DesignToken` |
| `stringValue` | `string \| null` | no | `null` | no | used for string literal values |
| `numberValue` | `number \| null` | no | `null` | no | used for numeric literal values |
| `createdTime` | `Date` | no | `new Date()` | no | creation timestamp |
| `updatedTime` | `Date` | no | `new Date()` | no | update timestamp |
| `deletedTime` | `Date \| null` | no | `null` | no | soft-delete timestamp |

## Relations

- Parent: [[Schemas/Qubbi - Schema - Component Style]] via `styleId`.

## Contract Coupling

- Enum source: [[Packages/Qubbi - Package - Contract]] (`ComponentPropStyleValueKind`).

## Linked Notes

- [[Schemas/Qubbi - Schema - Overview]]
- [[Schemas/Qubbi - Schema - Component Style]]
