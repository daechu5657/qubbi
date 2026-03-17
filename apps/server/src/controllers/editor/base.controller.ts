import { Controller } from "@nestjs/common";

export const EditorController = (path = "") =>
  Controller(path ? `editor/${path}` : "editor");
