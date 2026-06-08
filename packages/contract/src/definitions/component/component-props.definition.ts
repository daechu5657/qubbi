import { ComponentStyleDefinition } from "./component-style.definition";

export interface ComponentPropsDefinition {
  style: ComponentStyleDefinition[];
  attributes: [];
  state: [];
  slots: [];
  accessibility: [];
  data: [];
  events: [];
}
