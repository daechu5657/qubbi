import createClient, { ClientOptions } from "openapi-fetch";
import { paths } from "./generated";

export function createApiClient(options?: ClientOptions) {
  return createClient<paths>(options);
}
