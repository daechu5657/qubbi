import * as Contract from "@qubbi/contract";

export const defineComponent = <Variant extends string = string>(
  definition: Contract.Definitions.ComponentDefinition<Variant>,
) => {
  return definition;
};
