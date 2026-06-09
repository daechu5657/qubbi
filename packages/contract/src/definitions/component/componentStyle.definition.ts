import { STYLE_VALUE_KIND_RULES } from "../../constant";
import {
  Primitive,
  StyleValueFormat,
  StyleValueKind,
  StyleValueUnit,
} from "../../enums";

type PrimitiveValue<P extends Primitive> = P extends Primitive.String
  ? string
  : P extends Primitive.Number
    ? number
    : P extends Primitive.Boolean
      ? boolean
      : never;

type ComponentStyleDefaultValue<K extends StyleValueKind = StyleValueKind> =
  ComponentStyleDefaultValueMap[K];

type ComponentStyleDefaultValueMap = {
  [K in keyof typeof STYLE_VALUE_KIND_RULES]: StyleRuleToDefaultValue<
    (typeof STYLE_VALUE_KIND_RULES)[K]
  >;
};

type StyleRuleToDefaultValue<R extends { primitive: Primitive }> = R extends {
  units: readonly StyleValueUnit[];
}
  ? {
      value: PrimitiveValue<R["primitive"]>;
      unit: R["units"][number];
    }
  : R extends { formats: readonly StyleValueFormat[] }
    ? {
        value: PrimitiveValue<R["primitive"]>;
        format?: R["formats"][number];
      }
    : {
        value: PrimitiveValue<R["primitive"]>;
      };

export type ComponentStyleDefinition<
  K extends StyleValueKind = StyleValueKind,
> = {
  [P in K]: {
    label: string;
    cssProperty: keyof ElementCSSInlineStyle["style"];
    valueKind: P;
    defaultValue?: ComponentStyleDefaultValue<P>;
  };
}[K];
