---
type: package
workspace: packages/contract
updated: 2026-03-25
tags:
  - qubbi
  - qubbi/package
  - qubbi/package/contract
---

# Qubbi Package: Contract

> [!summary]
> Shared type and enum contract used by server schemas and reference-component definitions.

## Role

- Central source of truth for:
- Component definition interfaces (`Definitions`)
- Enum constraints (`Enums`)
- Prevents drift between authoring layer and persistence layer.

## Public Exports

- `index.ts` exports:
- `Definitions` namespace
- `Enums` namespace

## Definitions

| Definition | Source | Purpose |
| --- | --- | --- |
| `ComponentDefinition<Variant>` | `definitions/component/component.definition.ts` | root component manifest shape |
| `ComponentPropDefinition` | `definitions/component/component-prop.definition.ts` | union of style/behavior prop definition |
| `ComponentStyleDefinition` | `definitions/component/component-style.definition.ts` | style metadata (`cssProperty`, `valueType`, `unit`) |
| `ComponentBehaviorDefinition` | `definitions/component/component-behavior.definition.ts` | behavior metadata (`key`) |

## Enums

| Enum | Values |
| --- | --- |
| `ComponentPropKind` | `Style`, `Behavior` |
| `ComponentPropStyleValueKind` | `Unset`, `Literal`, `DesignToken` |
| `StyleValueType` | `String`, `Number` |
| `StyleValueUnit` | `Px`, `Rem`, `Percent` |

## Consumers

- [[Apps/Qubbi - App - Server]]
- [[Apps/Qubbi - App - Reference Component]]

## Schema Links

- [[Schemas/Qubbi - Schema - Component Prop]]
- [[Schemas/Qubbi - Schema - Component Style]]
- [[Schemas/Qubbi - Schema - Component Style Value]]

## Build

- `pnpm --filter @qubbi/contract build`
