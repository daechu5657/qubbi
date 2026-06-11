import React, { JSX, useState } from "react";

function defineComponent<Variant extends string>({
  label,
  component,
}: {
  label: string;
  component: ({
    defineVariant,
  }: {
    defineVariant: typeof defineComponentVariant<Variant>;
  }) => (...args: any[]) => JSX.Element;
}) {
  return component({ defineVariant: defineComponentVariant<Variant> });
}

function defineComponentVariant<T extends string>(
  style: Partial<Record<T, React.CSSProperties>>,
) {
  return (variant: T) => style[variant];
}

type SearchInputVariant = "default" | "disabled";

export const SearchInputComponent = defineComponent<SearchInputVariant>({
  label: "검색인풋",
  component: ({ defineVariant }) =>
    function ({
      variant,
      buttonText,
      placeholder,
      onChange,
      onSubmit,
    }: {
      variant: SearchInputVariant; // variant 인자가 타입으로 뜨게끔
      buttonText?: string;
      placeholder?: string;
      onChange?: (e: React.ChangeEvent<HTMLInputElement, Element>) => void;
      onSubmit?: (e: React.SubmitEvent<HTMLFormElement>) => void;
    }) {
      const [text, setText] = useState("");

      const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        onChange ? onChange(e) : "";
        setText(e.target.value);
      };

      const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        onSubmit ? onSubmit(e) : "";
        setText("");
      };

      const conatinerVariant = defineVariant({
        default: { padding: "20px" },
        disabled: {},
      });

      const buttonVariant = defineVariant({
        default: { padding: "20px" },
        disabled: { padding: "10px" },
      });

      return (
        <div style={conatinerVariant(variant)}>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={text}
              onChange={handleChange}
              placeholder={placeholder}
            />
            <button style={buttonVariant(variant)} type="submit">
              {buttonText}
            </button>
          </form>
        </div>
      );
    },
});
