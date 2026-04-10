---
tags:
  - schema
  - component-catalog
  - obsidian
---

# Graph Guide

This graph uses Obsidian `[[wikilinks]]`, not Mermaid.

## Cluster 1. Authoring Input

- [[ComponentDefinition]]

This is the type used by `reference-component` to declare components before upload.

## Cluster 2. Global Component Catalog

- [[Component]]
- [[ComponentVersion]]
- [[ComponentVariant]]
- [[ComponentProp]]
- [[ComponentStyle]]
- [[ComponentBehavior]]

These are normalized server-side schemas created from uploaded definition literals.

Important rule:

- None of these notes should depend on `projectId`.

## Cluster 3. Read Models

- [[ComponentManifest]]
- [[ComponentManifestModel]]

These are assembled views over the normalized component catalog.

## Cluster 4. Project Usage

- [[Project]]
- [[Revision]]
- [[PageTree]]
- [[PageTreeSnapshot]]
- [[ComponentPropOverride]]

The project does not own component schemas.
The project only selects which [[ComponentVersion]] ids it uses.

## Cluster 5. Design Tokens

- [[DesignToken]]
- [[DesignTokenValue]]

Design tokens are project-scoped and can be referenced by [[ComponentPropOverride]], not by the stored component catalog.

