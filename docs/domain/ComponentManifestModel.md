---
tags:
  - schema
  - component-catalog
  - read-model
---

# ComponentManifestModel

## Role

- API DTO form of [[ComponentManifest]]
- Used when the server returns a manifest payload to clients

## Rules

- Same semantic shape as [[ComponentManifest]]
- No `projectId`
- If a dedicated DTO class exists, it should still mirror the project-free manifest model

## Connected Notes

- [[ComponentManifest]]
- [[ComponentVersion]]
- [[PageTree]]

