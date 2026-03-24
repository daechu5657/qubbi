---
type: app
workspace: apps/editor
updated: 2026-03-25
tags:
  - qubbi
  - qubbi/app
  - qubbi/app/editor
---

# Qubbi App: Editor

> [!summary]
> React + Vite editor client workspace. Current state is close to starter template.

## Role

- Frontend entry app in the monorepo.
- Intended to consume backend APIs from [[Apps/Qubbi - App - Server]].
- Currently still showing template UI (`src/App.tsx` starter content).

## Runtime and Build

- Package name: `editor`
- Scripts:
- `pnpm --filter editor dev`
- `pnpm --filter editor build`
- `pnpm --filter editor lint`
- `pnpm --filter editor preview`

## Key Files

- `apps/editor/src/main.tsx` - React root bootstrap.
- `apps/editor/src/App.tsx` - current template page.
- `apps/editor/vite.config.ts` - Vite config entry.

## Dependencies

- Runtime: `react`, `react-dom`
- Tooling: `vite`, `typescript`, `eslint`

## Linked Notes

- [[Qubbi - Project Overview]]
- [[Qubbi - Workspace Map]]
- [[Apps/Qubbi - App - Server]]
