import * as Contract from "@qubbi/contract";
import { defineComponent } from "../define-component";

export const button = defineComponent({
  name: "button",
  tagName: "button",
  baseProps: [
    {
      kind: Contract.Enums.ComponentPropKind.Style,
      value: [
        {
          cssProperty: "backgroundColor",
          key: "background_color",
          name: "name",
          unit: Contract.Enums.StyleValueUnit.Px,
          valueType: Contract.Enums.StyleValueType.Number,
        },
      ],
    },
    {
      kind: Contract.Enums.ComponentPropKind.Behavior,
      value: [
        {
          key: "BehaviorKey",
        },
      ],
    },
  ],
  variants: ["default", "disabled", "submit"],
  variantOverrides: {
    default: [
      {
        kind: Contract.Enums.ComponentPropKind.Style,
        value: [],
      },
    ],
    disabled: [
      {
        kind: Contract.Enums.ComponentPropKind.Style,
        value: [],
      },
    ],
    submit: [
      {
        kind: Contract.Enums.ComponentPropKind.Style,
        value: [],
      },
    ],
  },
});
