---
tags:
  - schema
  - component-catalog
---

# Project

## Role

- Top-level logical unit that owns spaces, pages, and the selected component-version set

## Fields

- `id`
- `headRevisionId`
- `name`
- `componentVersionIds`
- `createdTime`
- `deletedTime`

## Rules

- `id` is immutable
- `componentVersionIds` references [[ComponentVersion]] ids
- The project selects component versions, but component schemas remain global and project-free
- Current truth is still based on `headRevisionId`

## Connected Notes

- [[Component]]
- [[ComponentVersion]]
- [[ComponentManifest]]
- [[Revision]]
- [[PageTree]]

