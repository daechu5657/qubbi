import type { OpenApiV3_1 } from "@typia/interface";
import type { AccessorMap, ExtendedOperation } from "../structures/Accessor.js";

export namespace OpenApiAccessorAnalyzer {
  const HTTP_METHODS = new Set<OpenApiV3_1.Method>([
    "get",
    "post",
    "put",
    "delete",
    "options",
    "head",
    "patch",
    "trace",
  ]);

  export const analyze = (document: OpenApiV3_1.IDocument): AccessorMap => {
    if (!document.paths) {
      throw new Error("OpenApiV3_1.IPath undefined");
    }

    const result: AccessorMap = new Map();

    for (const url in document.paths) {
      const path = document.paths[url];
      const entries = Object.entries(path).filter(
        (entry): entry is [OpenApiV3_1.Method, ExtendedOperation] =>
          HTTP_METHODS.has(entry[0] as OpenApiV3_1.Method) && !!entry[1],
      );

      for (const entry of entries) {
        collectOperation({ map: result, entry, url });
      }
    }

    return result;
  };

  const collectOperation = ({
    map,
    entry,
    url,
    accessor,
  }: {
    map: AccessorMap;
    entry: [OpenApiV3_1.Method, ExtendedOperation];
    url: string;
    accessor?: string[];
  }): void => {
    const [method, operation] = entry;
    const currentAccessor = accessor ?? operation["x-samchon-accessor"];
    const [key, ...restAccessor] = currentAccessor;

    if (!key) {
      throw new Error("x-samchon-accessor is empty");
    }

    if (!restAccessor.length) {
      map.set(key, {
        method,
        operation,
        url,
      });

      return;
    }

    const target = map.get(key);
    if (!target) {
      const newMap: AccessorMap = new Map();
      map.set(key, newMap);

      collectOperation({
        map: newMap,
        entry,
        url,
        accessor: restAccessor,
      });
      return;
    }

    if (target instanceof Map) {
      collectOperation({
        map: target,
        entry,
        url,
        accessor: restAccessor,
      });
      return;
    }

    throw new Error(`duplicate function name ${key}`);
  };
}
