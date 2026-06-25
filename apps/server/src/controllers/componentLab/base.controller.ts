import { Controller } from "@nestjs/common";

export const ComponentLabController = (path = "") =>
  Controller(path ? `componentLab/${path}` : "componentLab");
