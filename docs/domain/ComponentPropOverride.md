---
tags:
  - schema
  - component-catalog
  - runtime
---

# ComponentPropOverride

## Role

- Instance-level delta payload used by [[PageTree]] and [[PageTreeSnapshot]]
- Stores actual runtime values against manifest item ids

## Shape

```ts
export type ComponentPropOverride =
  | {
      propId: string;
      kind: "style";
      values: Array<
        | {
            styleId: string;
            kind: "unset";
          }
        | {
            styleId: string;
            kind: "literal";
            value: string | number;
          }
        | {
            styleId: string;
            kind: "designToken";
            designTokenId: string;
            designTokenValueId: string | null;
          }
      >;
    }
  | {
      propId: string;
      kind: "behavior";
      values: Array<{
        behaviorId: string;
        enabled: boolean;
      }>;
    };
```

## Rules

- This is not part of the stored component catalog
- Token references are allowed here because [[PageTree]] is project-scoped
- `propId`, `styleId`, and `behaviorId` come from [[ComponentManifest]]

## Connected Notes

- [[PageTree]]
- [[PageTreeSnapshot]]
- [[ComponentProp]]
- [[ComponentStyle]]
- [[ComponentBehavior]]
- [[DesignToken]]
- [[DesignTokenValue]]

