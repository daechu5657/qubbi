import type { OpenApiV3_1 } from "@typia/interface";

export interface ExtendedOperation extends OpenApiV3_1.IOperation {
  parameters?: Array<OpenApiV3_1.IOperation.IParameter>;
  "x-samchon-accessor": string[];
}

export type AccessorMap = Map<string, AccessorMapValue>;

export type AccessorMapValue = AccessorValue | AccessorMap;

export interface AccessorValue {
  url: string;
  method: OpenApiV3_1.Method;
  operation: ExtendedOperation;
}
