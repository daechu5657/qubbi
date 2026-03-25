import createClient, { Client } from "openapi-fetch";
import { paths } from "./generated";

const instanceMap = new Map<string, Client<paths>>();

export function createApiClient(owner: string, baseUrl: string) {
  const target = instanceMap.get(owner);

  if (!target) {
    const client = createClient<paths>({
      baseUrl: baseUrl ?? "http://localhost:3000",
    });

    instanceMap.set(owner, client);

    return client;
  }

  return target;
}
