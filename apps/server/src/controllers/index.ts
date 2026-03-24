import { TestController } from "./editor/test.controller";

const EDITOR_CONTROLLERS = [TestController];
const REFERENCE_COMPONENT_CONTROLLERS = [];
const SDK_CONTROLLERS = [];

export const APP_CONTROLLERS = [
  ...EDITOR_CONTROLLERS,
  ...REFERENCE_COMPONENT_CONTROLLERS,
  ...SDK_CONTROLLERS,
];
