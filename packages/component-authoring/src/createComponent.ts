import React from "react";
import type { Properties } from "csstype";
import * as Contract from "@qubbi/contract";

type VariantsGeneric = readonly string[] | undefined;

type Arguments<T extends VariantsGeneric> = {
  name: string;
  placementType: Contract.Enums.ComponentPlacementType;
  variants?: T;
};

type VariantOf<Variants extends readonly string[] | undefined> =
  Variants extends readonly string[] ? Variants[number] : never;

type ComponentPropsWithVariant<Props extends object, Variant extends string> = [
  Variant,
] extends [never]
  ? Props
  : Props & { variant?: Variant };

function createComponent<const V extends VariantsGeneric = undefined>({
  variants,
  name,
  placementType,
}: Arguments<V>) {
  type Variant = VariantOf<V>;

  const variantContext = React.createContext<Variant | undefined>(undefined);

  const useVariant = () => {
    return React.useContext(variantContext);
  };

  const useVariantsStyle = (
    defaults: Partial<Properties>,
    variants: Partial<Record<Variant, Properties>>,
  ) => {
    const variant = useVariant();
    const styles = [defaults, variants[variant] ?? {}] as Properties[];

    return (overrides?: Properties) => mergeStyles(...styles, overrides ?? {});
  };

  const mergeStyles = (...styles: Properties[]) => {
    return styles.reduce((acc, cur) => ({ ...acc, ...cur }), {});
  };

  const define = <Props extends object>(
    component: React.ComponentType<Props>,
  ) => {
    const wrappedComponent = (
      props: ComponentPropsWithVariant<Props, Variant>,
    ) => {
      if (!variants?.length) {
        return React.createElement(component, props as Props);
      }

      const { variant, ...restProps } = props as Props & {
        variant?: Variant;
      };

      return React.createElement(
        variantContext.Provider,
        { value: variant },
        React.createElement(component, restProps as Props),
      );
    };

    wrappedComponent.displayName = name;

    return wrappedComponent;
  };

  return {
    define,
    useVariantsStyle,
    useVariant,
  };
}

export { createComponent };
