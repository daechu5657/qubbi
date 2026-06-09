import { ComponentStyleDefinition } from "./componentStyle.definition";

export interface ComponentPropsDefinition {
  style: ComponentStyleDefinition[];
  attributes: [];
  state: [];
  slots: [];
  accessibility: [];
  data: [];
  events: [];
}
