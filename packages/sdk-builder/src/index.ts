import { loadConfig } from "./loadConfig.js";

export function loadSwaggerConfig() {
  return loadConfig().swagger;
}
