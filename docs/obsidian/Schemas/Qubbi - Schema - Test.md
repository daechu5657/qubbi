---
type: schema
entity: test
collection: tests
updated: 2026-03-25
source: apps/server/src/schemas/test/test.schema.ts
tags:
  - qubbi
  - qubbi/schema
  - qubbi/schema/test
---

# Qubbi Schema: Test

> [!summary]
> Basic CRUD example collection used by `TestController` and `TestService`.

## Field Spec

| Field | Type | Required | Default | Indexed | Notes |
| --- | --- | --- | --- | --- | --- |
| `_id` | `ObjectId` | yes | auto | implicit | document identifier |
| `name` | `number` | yes | none | no | sample numeric field |
| `email` | `string` | yes | none | no | sample string field |
| `deletedTime` | `Date` | no | `null` | no | soft-delete timestamp |

## API Usage

- Read/write via [[Apps/Qubbi - App - Server]] `TestService`.
- Exposed at `/editor/test` endpoints in `TestController`.

## Linked Notes

- [[Schemas/Qubbi - Schema - Overview]]
- [[Apps/Qubbi - App - Server]]
