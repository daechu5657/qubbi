import { ComponentPropType } from "../enums/component-prop-type.enum";
import { Properties } from "csstype";

export class ComponentManifestStringPropValueModel {
  type!: ComponentPropType.String;
  defaultValue?: string;
}

export class ComponentManifestNumberPropValueModel {
  type!: ComponentPropType.Number;
  defaultValue?: number;
}

export class ComponentManifestBooleanPropValueModel {
  type!: ComponentPropType.Boolean;
  defaultValue?: boolean;
}

export class ComponentManifestStringEnumPropValueModel {
  type!: ComponentPropType.StringEnum;
  values!: string[];
  defaultValue?: string;
}

export class ComponentManifestNumberEnumPropValueModel {
  type!: ComponentPropType.NumberEnum;
  values!: number[];
  defaultValue?: number;
}

export class ComponentManifestObjectPropValueModel {
  type!: ComponentPropType.Object;
  properties!: ComponentManifestPropModel[];
}

export class ComponentManifestStylePropertiesPropValueModel {
  type!: ComponentPropType.StyleProperties;
  defaultValue?: Properties;
}

export class ComponentManifestUnknownPropValueModel {
  type!: ComponentPropType.Unknown;
  rawType?: string;
}

export class ComponentManifestArrayPropValueModel {
  type!: ComponentPropType.Array;
  item!: ComponentManifestPropValueModel;
  defaultValue?: unknown[];
}

export type ComponentManifestPropValueModel =
  | ComponentManifestStringPropValueModel
  | ComponentManifestNumberPropValueModel
  | ComponentManifestBooleanPropValueModel
  | ComponentManifestStringEnumPropValueModel
  | ComponentManifestNumberEnumPropValueModel
  | ComponentManifestObjectPropValueModel
  | ComponentManifestArrayPropValueModel
  | ComponentManifestStylePropertiesPropValueModel
  | ComponentManifestUnknownPropValueModel;

export class ComponentManifestPropModel {
  key!: string;
  required!: boolean;
  value!: ComponentManifestPropValueModel;
}
