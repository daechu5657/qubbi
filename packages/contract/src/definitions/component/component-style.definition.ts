import { StyleValueType, StyleValueUnit } from "../../enums";

export interface ComponentStyleDefinition {
  key: string;
  name: string;
  cssProperty: keyof ElementCSSInlineStyle["style"];
  valueType: StyleValueType;
  unit: StyleValueUnit;
}
