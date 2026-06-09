import { ComponentPropsDefinition } from "./componentProps.definition";

export interface ComponentVariantDefinition {
  key: string;
  name: string;
  order: number;
  props?: Partial<ComponentPropsDefinition>;
}
