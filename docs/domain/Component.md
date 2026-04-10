---
tags:
  - schema
  - component-catalog
---

# Component

## Role

- Global logical identity of a component
- Stable catalog record shared across all projects

## Fields

- `id`
- `name`
- `createdTime`
- `deletedTime`

## Rules

- `id` is immutable
- `name` should be treated as a stable catalog identity
- No `projectId`
- Structural details do not live here

## Connected Notes

- [[ComponentDefinition]]
- [[ComponentVersion]]
- [[ComponentManifest]]
- [[Project]]

