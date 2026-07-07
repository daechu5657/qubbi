import createClient from "openapi-fetch";
import type { Client, ClientOptions } from "openapi-fetch";
import type { paths } from "./generated.js";

export { Enums } from "./generated.js";
export type { Models } from "./generated.js";
export type ApiClient = Client<paths>;

export function createApiClient(options?: ClientOptions): ApiClient {
  return createClient<paths>(options);
}
