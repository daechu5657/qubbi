---
type: overview
project: qubbi
updated: 2026-03-25
tags:
  - qubbi
  - qubbi/architecture
---

# Qubbi Project Overview

> [!summary]
> `qubbi` is a TypeScript monorepo for editor/server/component-definition workflows.

## System Intent

- Build a component-driven UI platform with:
- editor runtime (`apps/editor`)
- API + persistence layer (`apps/server`)
- reference component definitions + extraction (`apps/reference-component`)
- shared domain contract (`packages/contract`)
- SDK placeholder (`packages/sdk`)

## Monorepo Layout

- Workspace spec: `pnpm-workspace.yaml` -> `apps/*`, `packages/*`
- Task orchestration: `turbo.json`
- Root scripts:
- `pnpm dev` -> `turbo watch dev`
- `pnpm build` -> `turbo run build`
- `pnpm lint` -> `turbo run lint`

## Architecture Map

```mermaid
graph LR
  Editor["apps/editor"] -->|"HTTP (/editor/* planned)"| Server["apps/server"]
  RefComp["apps/reference-component"] -->|"imports"| Contract["packages/contract"]
  Server -->|"imports"| Contract
  Server -->|"Mongoose"| Mongo["MongoDB"]
  RefComp -->|"build + extract-definition"| Artifact["dist/component-definitions.json"]
  SDK["packages/sdk"] -->|"future runtime utilities"| Editor
```

## Linked Notes

- [[Qubbi - Workspace Map]]
- [[Qubbi - Graph Seed]]
- [[Apps/Qubbi - App - Editor]]
- [[Apps/Qubbi - App - Server]]
- [[Apps/Qubbi - App - Reference Component]]
- [[Packages/Qubbi - Package - Contract]]
- [[Packages/Qubbi - Package - SDK]]
- [[Schemas/Qubbi - Schema - Overview]]
