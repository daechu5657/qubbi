import { Ajv2020 } from "ajv/dist/2020.js";
import { IConfig } from "../types.js";
import addFormatsModule from "ajv-formats";

export function validateConfig({
  schema,
  config,
}: {
  config: unknown;
  schema: IConfig;
}) {
  const ajv = new Ajv2020({ allErrors: true });
  const addFormats = addFormatsModule.default ?? addFormatsModule;
  addFormats(ajv);

  const validate = ajv.compile(schema);
  if (!validate(config)) {
    throw new Error(ajv.errorsText(validate.errors, { separator: "\n" }));
  }
}
