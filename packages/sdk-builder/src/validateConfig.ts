import { Ajv2020 } from "ajv/dist/2020.js";
import { ConfigSchema } from "./cli.js";
import addFormatsModule from "ajv-formats";

export function validateConfig({
  schema,
  config,
}: {
  config: unknown;
  schema: ConfigSchema;
}) {
  const ajv = new Ajv2020({ allErrors: true });
  const addFormats = addFormatsModule.default ?? addFormatsModule;
  addFormats(ajv);

  const validate = ajv.compile(schema);
  if (!validate(config)) {
    throw new Error(ajv.errorsText(validate.errors, { separator: "\n" }));
  }
}
