import axios, { type AxiosInstance, type CreateAxiosDefaults } from "axios";
import { createApis } from "./generated.js";

export { Enums } from "./generated.js";
export type { Models } from "./generated.js";

export function createApiClient(options?: {
  config?: CreateAxiosDefaults;
  setup?: (instance: AxiosInstance) => void;
}) {
  const instance = axios.create(options?.config);

  options?.setup?.(instance);

  return {
    instance,
    apis: createApis(instance),
  };
}
