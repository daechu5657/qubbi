---
type: schema
entity: component_behavior
collection: component_behaviors
updated: 2026-03-25
source: apps/server/src/schemas/component/component-behavior.schema.ts
tags:
  - qubbi
  - qubbi/schema
  - qubbi/schema/component
---

# Qubbi Schema: Component Behavior

> [!summary]
> Behavior metadata linked to `component-props` entries of `kind=Behavior`.

## Field Spec

| Field | Type | Required | Default | Indexed | Notes |
| --- | --- | --- | --- | --- | --- |
| `_id` | `ObjectId` | yes | auto | implicit | document identifier |
| `projectId` | `ObjectId` | yes | none | yes | tenant/project scope |
| `propId` | `ObjectId` | yes | none | yes | points to `component-props._id` |
| `key` | `string` | yes | none | no | behavior identifier |
| `createdTime` | `Date` | no | `new Date()` | no | creation timestamp |
| `updatedTime` | `Date` | no | `new Date()` | no | update timestamp |
| `deletedTime` | `Date \| null` | no | `null` | no | soft-delete timestamp |

## Relations

- Parent: [[Schemas/Qubbi - Schema - Component Prop]] via `propId`.

## Linked Notes

- [[Schemas/Qubbi - Schema - Overview]]
- [[Schemas/Qubbi - Schema - Component Prop]]
