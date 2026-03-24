---
type: map
project: qubbi
updated: 2026-03-25
tags:
  - qubbi
  - qubbi/workspace
---

# Qubbi Workspace Map

> [!info]
> Workspace-level responsibility map.

## Workspace Matrix

| Workspace | Type | Role | Key Scripts | Depends On | Notes |
| --- | --- | --- | --- | --- | --- |
| [[Apps/Qubbi - App - Editor\|apps/editor]] | app | React editor client | `dev`, `build`, `lint`, `preview` | react, react-dom | Vite starter state |
| [[Apps/Qubbi - App - Server\|apps/server]] | app | Nest API + Mongo persistence | `dev`, `build`, `test`, `test:e2e` | `@qubbi/contract`, mongoose | Active API at `/editor/test` |
| [[Apps/Qubbi - App - Reference Component\|apps/reference-component]] | app | Component definition source + extractor | `dev`, `build`, `extract-definition` | `@qubbi/contract` | Writes `dist/component-definitions.json` |
| [[Packages/Qubbi - Package - Contract\|packages/contract]] | package | Shared enums and interfaces | `build` | typescript | Shared with server/reference app |
| [[Packages/Qubbi - Package - SDK\|packages/sdk]] | package | SDK placeholder | `build`, `dev` | typescript | `src/index.ts` is currently empty |

## Integration Highlights

- `apps/server` uses `@qubbi/contract` enums in component schema definitions.
- `apps/reference-component` uses `@qubbi/contract` definitions to author typed component manifests.
- `packages/sdk` exists but has no exported runtime logic yet.

## Linked Notes

- [[Qubbi - Index]]
- [[Qubbi - Project Overview]]
- [[Schemas/Qubbi - Schema - Overview]]
