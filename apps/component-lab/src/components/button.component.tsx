// import { createComponent, type Properties } from "@qubbi/component-authoring";
import * as ComponentAuthoring from "@qubbi/component-authoring";
import * as Contract from "@qubbi/contract";

const buttonComponent = ComponentAuthoring.createComponent({
  name: "ButtonComponent",
  placementType: Contract.Enums.ComponentPlacementType.Standalone,
  variants: ["default", "primary", "disabled"],
});

function ButtonBase({
  buttonStyle,
}: {
  buttonStyle?: ComponentAuthoring.Properties;
}) {
  const button = buttonComponent.useVariantStyle(
    { padding: "8px 12px" },
    {
      default: { backgroundColor: "white" },
      primary: { backgroundColor: "blue", color: "white" },
      disabled: { opacity: "0.4" },
    },
  );

  return <button style={button(buttonStyle)}></button>;
}

// const ButtonBase = () => <button />; <button></button>;
// const ButtonBase = () => {
//   return <button />;
//   return <button></button>;
// };

export const ButtonComponent = buttonComponent.define(ButtonBase);
// export const ButtonComponent = buttonComponent.define(() => <button/>);
// export const ButtonComponent = buttonComponent.define(() => <button></button>);
// export const ButtonComponent = buttonComponent.define(() => {return <button/>});
// export const ButtonComponent = buttonComponent.define(() => {return <button></button>});
