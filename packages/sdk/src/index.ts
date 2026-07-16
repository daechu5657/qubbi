import axios, { type AxiosInstance, type CreateAxiosDefaults } from "axios";
import { createApis } from "./sdk.js";

export { Enums } from "./sdk.js";
export type { Models } from "./sdk.js";

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
