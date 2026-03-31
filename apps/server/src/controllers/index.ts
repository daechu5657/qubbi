import { EDITOR_CONTROLLERS } from "./editor";
import { REFERENCE_COMPONENT_CONTROLLERS } from "./reference-component";
import { SDK_CONTROLLERS } from "./sdk";

export const APP_CONTROLLERS = [
  ...EDITOR_CONTROLLERS,
  ...REFERENCE_COMPONENT_CONTROLLERS,
  ...SDK_CONTROLLERS,
];
