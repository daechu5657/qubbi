---
tags:
  - schema
  - component-catalog
  - snapshot
---

# Revision

## Role

- Checkpoint metadata for reconstructing a project state

## Fields

- `id`
- `projectId`
- `parentRevisionId`
- `restoredFromRevisionId`
- `reason`
- `designSnapshotToken`
- `componentManifestToken`
- `createdBy`
- `createdTime`
- `deletedTime`

## Rules

- Immutable
- Linear history
- Component ownership does not move into revision records
- `componentManifestToken` should be treated as a revision-time manifest bundle pointer or cache key, not as a project-scoped component schema source
- The actual component source of truth remains the global [[ComponentVersion]] catalog

## Connected Notes

- [[Project]]
- [[ComponentVersion]]
- [[ComponentManifest]]
- [[PageTreeSnapshot]]
- [[ComponentPropOverride]]

