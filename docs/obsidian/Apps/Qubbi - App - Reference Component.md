---
type: app
workspace: apps/reference-component
updated: 2026-03-25
tags:
  - qubbi
  - qubbi/app
  - qubbi/app/reference-component
---

# Qubbi App: Reference Component

> [!summary]
> Typed component definition source and extraction pipeline for generating JSON artifacts.

## Role

- Defines canonical component metadata with contract-safe types.
- Produces `dist/component-definitions.json` for downstream usage.
- Bridges authoring and server-side schema constraints.

## Build Pipeline

- `pnpm --filter reference-component build`
- runs `tsc -p tsconfig.json`
- then runs `pnpm run extract-definition`
- `scripts/extract-definition.ts` scans `dist/**/*.js`
- ignores helper/script outputs
- imports module exports dynamically
- keeps only objects that match component-definition shape
- writes `dist/component-definitions.json`

## Key Source Files

- `src/define-component.ts` - generic wrapper around `Contract.Definitions.ComponentDefinition`.
- `src/components/button.ts` - example component with style + behavior props and variant overrides.
- `scripts/extract-definition.ts` - extraction and JSON generation script.

## Contract Coupling

- Imports `@qubbi/contract` enums and definition types.
- Contract package: [[Packages/Qubbi - Package - Contract]]

## Schema Relevance

- Mirrors domain concepts used in:
- [[Schemas/Qubbi - Schema - Component]]
- [[Schemas/Qubbi - Schema - Component Prop]]
- [[Schemas/Qubbi - Schema - Component Style]]
- [[Schemas/Qubbi - Schema - Component Behavior]]

## Linked Notes

- [[Qubbi - Project Overview]]
- [[Qubbi - Workspace Map]]
- [[Apps/Qubbi - App - Server]]
