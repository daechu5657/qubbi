import { Controller } from "@nestjs/common";

export const EditorController = (path = "") =>
  Controller(path ? `editor/${path}` : "editor");

export const ComponentLabController = (path = "") =>
  Controller(path ? `component-lab/${path}` : "component-lab");
