import React from "react";
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
  label?: string;
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

//1. 조건부 JSX
const conditionalComponent = ComponentAuthoring.createComponent({
  name: "ConditionalInput",
  placementType: Contract.Enums.ComponentPlacementType.Standalone,
  variants: ["default"],
});

function ConditionalInput({ asButton }: { asButton: boolean }) {
  if (asButton) {
    return <button>Submit</button>;
  }

  return <input type="text" />;
}

export const ConditionalInputComponent =
  conditionalComponent.define(ConditionalInput);

// 2. map/repeater

const listComponent = ComponentAuthoring.createComponent({
  name: "ListComponent",
  placementType: Contract.Enums.ComponentPlacementType.Standalone,
  variants: ["default"],
});

function List({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export const ListComponent = listComponent.define(List);

// 3. 동적 tag
const textComponent = ComponentAuthoring.createComponent({
  name: "TextComponent",
  placementType: Contract.Enums.ComponentPlacementType.Standalone,
  variants: ["default"],
});

function Text({
  as: Tag = "p",
  children,
}: {
  as?: "p" | "span" | "strong";
  children?: React.ReactNode;
}) {
  return <Tag>{children}</Tag>;
}

export const TextComponent = textComponent.define(Text);

// 4. style spread
const spreadStyleComponent = ComponentAuthoring.createComponent({
  name: "SpreadStyleBox",
  placementType: Contract.Enums.ComponentPlacementType.Standalone,
  variants: ["default", "active"],
});

function SpreadStyleBox({
  boxStyle,
}: {
  boxStyle?: ComponentAuthoring.Properties;
}) {
  const box = spreadStyleComponent.useVariantStyle(
    { padding: "10px" },
    {
      default: { borderColor: "gray" },
      active: { borderColor: "blue" },
    },
  );

  const baseStyle = box(boxStyle);

  return <div style={{ ...baseStyle, borderStyle: "solid" }} />;
}

export const SpreadStyleBoxComponent =
  spreadStyleComponent.define(SpreadStyleBox);

// 5. 조건부 style
const conditionalStyleComponent = ComponentAuthoring.createComponent({
  name: "ConditionalStyleBox",
  placementType: Contract.Enums.ComponentPlacementType.Standalone,
  variants: ["default"],
});

function ConditionalStyleBox({ active }: { active: boolean }) {
  return (
    <div
      style={{
        padding: active ? "20px" : "10px",
        color: active ? "blue" : "gray",
      }}
    />
  );
}

export const ConditionalStyleBoxComponent =
  conditionalStyleComponent.define(ConditionalStyleBox);

// 6. className
const classNameComponent = ComponentAuthoring.createComponent({
  name: "ClassNameButton",
  placementType: Contract.Enums.ComponentPlacementType.Standalone,
  variants: ["default"],
});

function ClassNameButton({ active }: { active: boolean }) {
  return <button className={active ? "button active" : "button"} />;
}

export const ClassNameButtonComponent =
  classNameComponent.define(ClassNameButton);

// 7. Fragment / multiple root
const fragmentComponent = ComponentAuthoring.createComponent({
  name: "ToolbarItems",
  placementType: Contract.Enums.ComponentPlacementType.Fragment,
  variants: ["default"],
});

function ToolbarItems() {
  return (
    <>
      <button>Save</button>
      <button>Cancel</button>
    </>
  );
}

export const ToolbarItemsComponent = fragmentComponent.define(ToolbarItems);

// 8. children / slot
const panelComponent = ComponentAuthoring.createComponent({
  name: "PanelComponent",
  placementType: Contract.Enums.ComponentPlacementType.Standalone,
  variants: ["default"],
});

function Panel({ children }: { children?: React.ReactNode }) {
  return <section>{children}</section>;
}

export const PanelComponent = panelComponent.define(Panel);

// 9. 다른 컴포넌트가 return 안에 들어가는 경우
const searchInputComponent = ComponentAuthoring.createComponent({
  name: "SearchInputComponent",
  placementType: Contract.Enums.ComponentPlacementType.Standalone,
  variants: ["default", "disabled"],
});

function SearchInput({ placeholder }: { placeholder?: string }) {
  return (
    <div>
      <input placeholder={placeholder} />
      <ButtonComponent variant="primary" label="Search" />
    </div>
  );
}

export const SearchInputComponent = searchInputComponent.define(SearchInput);
