import createClient, { Client, ClientOptions } from "openapi-fetch";
import type { paths } from "./generated.js";

export type ApiClient = Client<paths>;

export function createApiClient(options?: ClientOptions): ApiClient {
  return createClient<paths>(options);
}
