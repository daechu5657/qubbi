import { ComponentPropKind } from "../../enums";
import { ComponentBehaviorDefinition } from "./component-behavior.definition";
import { ComponentStyleDefinition } from "./component-style.definition";

interface ComponentStylePropDefinition {
  kind: ComponentPropKind.Style;
  value: ComponentStyleDefinition[];
}

interface ComponentBehaviorPropDefinition {
  kind: ComponentPropKind.Behavior;
  value: ComponentBehaviorDefinition[];
}

export type ComponentPropDefinition =
  | ComponentStylePropDefinition
  | ComponentBehaviorPropDefinition;
