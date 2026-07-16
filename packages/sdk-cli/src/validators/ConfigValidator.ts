import addFormatsModule from "ajv-formats";
import { Ajv2020 } from "ajv/dist/2020.js";

export namespace ConfigValidator {
  export const validate = ({
    schema,
    config,
  }: {
    config: unknown;
    schema: any;
  }): void => {
    const ajv = new Ajv2020({ allErrors: true });
    const addFormats = addFormatsModule.default ?? addFormatsModule;
    addFormats(ajv);

    const validate = ajv.compile(schema);
    if (!validate(config)) {
      throw new Error(ajv.errorsText(validate.errors, { separator: "\n" }));
    }
  };
}
