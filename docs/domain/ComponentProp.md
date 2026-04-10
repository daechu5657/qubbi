---
tags:
  - schema
  - component-catalog
---

# ComponentProp

## Role

- Persisted prop-group row derived from one authoring prop entry
- Parent record for either style items or behavior items

## Fields

- `id`
- `componentVersionId`
- `variantId`
- `kind`
- `order`
- `createdTime`
- `deletedTime`

## Rules

- No `projectId`
- `variantId = null` means the prop came from `baseProps`
- `variantId != null` means the prop came from `variantOverrides`
- `kind` is `style` or `behavior`

## Connected Notes

- [[ComponentDefinition]]
- [[ComponentVersion]]
- [[ComponentVariant]]
- [[ComponentStyle]]
- [[ComponentBehavior]]
- [[ComponentManifest]]
- [[ComponentPropOverride]]

