import { ComponentPropsDefinition } from "./componentProps.definition";
import { ComponentVariantDefinition } from "./componentVariant.definition";

export interface ComponentDefinition {
  name: string;
  tagName: string;
  props: ComponentPropsDefinition;
  variants?: ComponentVariantDefinition[];
}
