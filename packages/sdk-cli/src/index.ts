import { loadConfig } from "./load/loadConfig.js";

export function loadSwaggerConfig() {
  return loadConfig().swagger;
}
