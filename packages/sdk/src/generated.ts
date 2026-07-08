import type { Properties } from "csstype";

export namespace Models {
  export interface ComponentManifestStyleModel {
    variantKey: string;
    cssProperty: keyof Properties;
    rawValue: string;
  }
  export interface ComponentManifestPartModel {
    tagName: string;
    kind: Enums.ComponentPartKind;
    order: number;
    styles: Models.ComponentManifestStyleModel[];
    children: Models.ComponentManifestPartModel[];
  }
  export interface ComponentManifestStringPropValueModel {
    type: Enums.ComponentPropType.String;
    defaultValue?: string;
  }
  export interface ComponentManifestNumberPropValueModel {
    type: Enums.ComponentPropType.Number;
    defaultValue?: number;
  }
  export interface ComponentManifestBooleanPropValueModel {
    type: Enums.ComponentPropType.Boolean;
    defaultValue?: boolean;
  }
  export interface ComponentManifestStringEnumPropValueModel {
    type: Enums.ComponentPropType.StringEnum;
    values: string[];
    defaultValue?: string;
  }
  export interface ComponentManifestNumberEnumPropValueModel {
    type: Enums.ComponentPropType.NumberEnum;
    values: number[];
    defaultValue?: number;
  }
  export interface ComponentManifestObjectPropValueModel {
    type: Enums.ComponentPropType.Object;
    properties: Models.ComponentManifestPropModel[];
  }
  export interface ComponentManifestStylePropertiesPropValueModel {
    type: Enums.ComponentPropType.StyleProperties;
    defaultValue?: Properties;
  }
  export interface ComponentManifestUnknownPropValueModel {
    type: Enums.ComponentPropType.Unknown;
    rawType?: string;
  }
  export interface ComponentManifestArrayPropValueModel {
    type: Enums.ComponentPropType.Array;
    item:
      | Models.ComponentManifestStringPropValueModel
      | Models.ComponentManifestNumberPropValueModel
      | Models.ComponentManifestBooleanPropValueModel
      | Models.ComponentManifestStringEnumPropValueModel
      | Models.ComponentManifestNumberEnumPropValueModel
      | Models.ComponentManifestObjectPropValueModel
      | Models.ComponentManifestArrayPropValueModel
      | Models.ComponentManifestStylePropertiesPropValueModel
      | Models.ComponentManifestUnknownPropValueModel;
    defaultValue?: unknown[];
  }
  export interface ComponentManifestPropModel {
    key: string;
    required: boolean;
    value:
      | Models.ComponentManifestStringPropValueModel
      | Models.ComponentManifestNumberPropValueModel
      | Models.ComponentManifestBooleanPropValueModel
      | Models.ComponentManifestStringEnumPropValueModel
      | Models.ComponentManifestNumberEnumPropValueModel
      | Models.ComponentManifestObjectPropValueModel
      | Models.ComponentManifestArrayPropValueModel
      | Models.ComponentManifestStylePropertiesPropValueModel
      | Models.ComponentManifestUnknownPropValueModel;
  }
  export interface ComponentManifestVariantModel {
    key: string;
    order: number;
  }
  export interface ComponentManifestModel {
    name: string;
    placementType: Enums.ComponentPlacementType;
    variants: Models.ComponentManifestVariantModel[];
    props: Models.ComponentManifestPropModel[];
    parts: Models.ComponentManifestPartModel[];
  }
}

export namespace Enums {
  export enum ComponentPlacementType {
    Standalone = "Standalone",
    Fragment = "Fragment",
  }
  export enum ComponentPartKind {
    Element = "Element",
    Component = "Component",
  }
  export enum ComponentPropType {
    String = "String",
    Number = "Number",
    Boolean = "Boolean",
    StringEnum = "StringEnum",
    NumberEnum = "NumberEnum",
    Object = "Object",
    Array = "Array",
    StyleProperties = "StyleProperties",
    Unknown = "Unknown",
  }
}
