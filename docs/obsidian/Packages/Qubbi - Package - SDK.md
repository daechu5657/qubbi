---
type: package
workspace: packages/sdk
updated: 2026-03-25
tags:
  - qubbi
  - qubbi/package
  - qubbi/package/sdk
---

# Qubbi Package: SDK

> [!summary]
> SDK workspace scaffold. Package exists, but `src/index.ts` is currently empty.

## Role

- Reserved workspace for reusable runtime utilities.
- Intended to provide shared client-facing helpers.

## Current State

- Package name: `@repo/sdk`
- Source entry: `packages/sdk/src/index.ts` (empty as of 2026-03-25)
- No runtime dependency on `@qubbi/contract` yet.

## Build and Dev

- `pnpm --filter @repo/sdk build`
- `pnpm --filter @repo/sdk dev`

## Integration Direction

- Natural integration targets:
- [[Apps/Qubbi - App - Editor]]
- [[Apps/Qubbi - App - Server]]
- [[Packages/Qubbi - Package - Contract]]

## Linked Notes

- [[Qubbi - Workspace Map]]
- [[Qubbi - Project Overview]]
