# Domain Docs

This directory is the single Obsidian-friendly home for the component domain notes.

Core idea:

- `ComponentDefinition` is an authoring contract used in `reference-component`.
- The server receives definition literals and decomposes them into normalized component schemas.
- The server later reassembles those schemas into a `ComponentManifest` read model.
- Component-domain schemas do not carry `projectId`.
- A project only references which `ComponentVersion` records it uses.

Start here:

- [[Schema-Index]]
- [[Graph-Guide]]
- [[Schema-Map]]
