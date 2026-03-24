import { ComponentPropDefinition } from "./component-prop.definition";

export interface ComponentDefinition<Variant extends string = string> {
  name: string;
  tagName: string;
  baseProps: ComponentPropDefinition[];
  variants: Variant[];
  variantOverrides: Partial<Record<Variant, ComponentPropDefinition[]>>;
}
