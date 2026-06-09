import {
  Primitive,
  StyleValueFormat,
  StyleValueKind,
  StyleValueUnit,
} from "../../enums";

export const STYLE_VALUE_KIND_RULES = {
  [StyleValueKind.Text]: {
    primitive: Primitive.String,
  },
  [StyleValueKind.Color]: {
    primitive: Primitive.String,
    formats: [
      StyleValueFormat.Hex,
      StyleValueFormat.Rgb,
      StyleValueFormat.Rgba,
      StyleValueFormat.Hsl,
      StyleValueFormat.Hsla,
    ],
  },
  [StyleValueKind.Number]: {
    primitive: Primitive.Number,
  },
  [StyleValueKind.Length]: {
    primitive: Primitive.Number,
    units: [StyleValueUnit.Px, StyleValueUnit.Rem, StyleValueUnit.Percent],
  },
  [StyleValueKind.Boolean]: {
    primitive: Primitive.Boolean,
  },
};
