import * as ComponentAuthoring from "@qubbi/component-authoring";
import * as Contract from "@qubbi/contract";

const buttonComponent = ComponentAuthoring.createComponent({
  name: "ButtonComponent",
  placementType: Contract.Enums.ComponentPlacementType.Standalone,
  variants: ["default", "primary", "disabled"],
});

function ButtonBase({
  label,
  buttonStyle,
}: {
  label: string;
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

  return <button style={button(buttonStyle)}>{label}</button>;
}

export const ButtonComponent = buttonComponent.define(ButtonBase);
