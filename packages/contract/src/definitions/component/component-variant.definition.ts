import { ComponentPropsDefinition } from "./component-props.definition";

export interface ComponentVariantDefinition {
  key: string;
  name: string;
  order: number;
  props?: Partial<ComponentPropsDefinition>;
}
