import * as ComponentAuthoring from "@qubbi/component-authoring";

const inputComponent = ComponentAuthoring.createComponent({
  name: "InputComponent",
  variants: ["test", "test2"],
});

function Input({
  containerStyle,
}: {
  containerStyle?: ComponentAuthoring.Properties;
}) {
  const variant = inputComponent.useVariant();

  const container = inputComponent.useVariantsStyle(
    {
      padding: "5px",
    },
    {
      test: { padding: "20px" },
      test2: { padding: "10px" },
    },
  );

  return <div style={container(containerStyle)}></div>;
}

export const TestComponent = inputComponent.define(Input);

export default function () {
  return (
    <div>
      <TestComponent />
    </div>
  );
}
