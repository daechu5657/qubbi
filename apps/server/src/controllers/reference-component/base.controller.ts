import { Controller } from "@nestjs/common";

export const ReferenceComponentController = (path = "") =>
  Controller(path ? `reference-component/${path}` : "reference-component");
