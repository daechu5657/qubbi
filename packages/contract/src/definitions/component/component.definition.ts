import { ComponentPropsDefinition } from "./component-props.definition";
import { ComponentVariantDefinition } from "./component-variant.definition";

export interface ComponentDefinition {
  name: string;
  tagName: string;
  props: ComponentPropsDefinition;
  variants?: ComponentVariantDefinition[];
}
