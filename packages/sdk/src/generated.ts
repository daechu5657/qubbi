import type { Properties } from "csstype";

export namespace Models {
  export class ComponentManifestStyleModel {
    variantKey!: string;
    cssProperty!: keyof Properties;
    rawValue!: string;
  }
  export class ComponentManifestPartModel {
    tagName!: string;
    kind!: Enums.ComponentPartKind;
    order!: number;
    styles!: Models.ComponentManifestStyleModel[];
    children!: Models.ComponentManifestPartModel[];
  }
  export class ComponentManifestStringPropValueModel {
    type!: Enums.ComponentPropType.String;
    defaultValue?: string;
  }
  export class ComponentManifestNumberPropValueModel {
    type!: Enums.ComponentPropType.Number;
    defaultValue?: number;
  }
  export class ComponentManifestBooleanPropValueModel {
    type!: Enums.ComponentPropType.Boolean;
    defaultValue?: boolean;
  }
  export class ComponentManifestStringEnumPropValueModel {
    type!: Enums.ComponentPropType.StringEnum;
    values!: string[];
    defaultValue?: string;
  }
  export class ComponentManifestNumberEnumPropValueModel {
    type!: Enums.ComponentPropType.NumberEnum;
    values!: number[];
    defaultValue?: number;
  }
  export class ComponentManifestObjectPropValueModel {
    type!: Enums.ComponentPropType.Object;
    properties!: Models.ComponentManifestPropModel[];
  }
  export class ComponentManifestStylePropertiesPropValueModel {
    type!: Enums.ComponentPropType.StyleProperties;
    defaultValue?: Properties;
  }
  export class ComponentManifestUnknownPropValueModel {
    type!: Enums.ComponentPropType.Unknown;
    rawType?: string;
  }
  export class ComponentManifestArrayPropValueModel {
    type!: Enums.ComponentPropType.Array;
    item!:
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
  export class ComponentManifestPropModel {
    key!: string;
    required!: boolean;
    value!:
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
  export class ComponentManifestVariantModel {
    key!: string;
    order!: number;
  }
  export class ComponentManifestModel {
    name!: string;
    placementType!: Enums.ComponentPlacementType;
    variants!: Models.ComponentManifestVariantModel[];
    props!: Models.ComponentManifestPropModel[];
    parts!: Models.ComponentManifestPartModel[];
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
