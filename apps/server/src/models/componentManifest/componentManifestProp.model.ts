import {
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from "@nestjs/swagger";
import { ComponentPropType } from "../../enums";

const componentPropValueOneOf = () => ({
  oneOf: [
    { $ref: getSchemaPath(ComponentManifestStringPropValueModel) },
    { $ref: getSchemaPath(ComponentManifestNumberPropValueModel) },
    { $ref: getSchemaPath(ComponentManifestBooleanPropValueModel) },
    { $ref: getSchemaPath(ComponentManifestStringEnumPropValueModel) },
    { $ref: getSchemaPath(ComponentManifestNumberEnumPropValueModel) },
    { $ref: getSchemaPath(ComponentManifestObjectPropValueModel) },
    { $ref: getSchemaPath(ComponentManifestArrayPropValueModel) },
    { $ref: getSchemaPath(ComponentManifestStylePropertiesPropValueModel) },
    { $ref: getSchemaPath(ComponentManifestUnknownPropValueModel) },
  ],
  discriminator: {
    propertyName: "type",
    mapping: {
      [ComponentPropType.String]: getSchemaPath(
        ComponentManifestStringPropValueModel,
      ),
      [ComponentPropType.Number]: getSchemaPath(
        ComponentManifestNumberPropValueModel,
      ),
      [ComponentPropType.Boolean]: getSchemaPath(
        ComponentManifestBooleanPropValueModel,
      ),
      [ComponentPropType.StringEnum]: getSchemaPath(
        ComponentManifestStringEnumPropValueModel,
      ),
      [ComponentPropType.NumberEnum]: getSchemaPath(
        ComponentManifestNumberEnumPropValueModel,
      ),
      [ComponentPropType.Object]: getSchemaPath(
        ComponentManifestObjectPropValueModel,
      ),
      [ComponentPropType.Array]: getSchemaPath(
        ComponentManifestArrayPropValueModel,
      ),
      [ComponentPropType.StyleProperties]: getSchemaPath(
        ComponentManifestStylePropertiesPropValueModel,
      ),
      [ComponentPropType.Unknown]: getSchemaPath(
        ComponentManifestUnknownPropValueModel,
      ),
    },
  },
});

export class ComponentManifestStringPropValueModel {
  @ApiProperty({
    enum: ComponentPropType,
    enumName: "ComponentPropType",
    example: ComponentPropType.String,
  })
  type!: ComponentPropType.String;

  @ApiPropertyOptional({ type: String })
  defaultValue?: string;
}

export class ComponentManifestNumberPropValueModel {
  @ApiProperty({
    enum: ComponentPropType,
    enumName: "ComponentPropType",
    example: ComponentPropType.Number,
  })
  type!: ComponentPropType.Number;

  @ApiPropertyOptional({ type: Number })
  defaultValue?: number;
}

export class ComponentManifestBooleanPropValueModel {
  @ApiProperty({
    enum: ComponentPropType,
    enumName: "ComponentPropType",
    example: ComponentPropType.Boolean,
  })
  type!: ComponentPropType.Boolean;

  @ApiPropertyOptional({ type: Boolean })
  defaultValue?: boolean;
}

export class ComponentManifestStringEnumPropValueModel {
  @ApiProperty({
    enum: ComponentPropType,
    enumName: "ComponentPropType",
    example: ComponentPropType.StringEnum,
  })
  type!: ComponentPropType.StringEnum;

  @ApiProperty({ type: [String] })
  values!: string[];

  @ApiPropertyOptional({ type: String })
  defaultValue?: string;
}

export class ComponentManifestNumberEnumPropValueModel {
  @ApiProperty({
    enum: ComponentPropType,
    enumName: "ComponentPropType",
    example: ComponentPropType.NumberEnum,
  })
  type!: ComponentPropType.NumberEnum;

  @ApiProperty({ type: [Number] })
  values!: number[];

  @ApiPropertyOptional({ type: Number })
  defaultValue?: number;
}

export class ComponentManifestObjectPropValueModel {
  @ApiProperty({
    enum: ComponentPropType,
    enumName: "ComponentPropType",
    example: ComponentPropType.Object,
  })
  type!: ComponentPropType.Object;

  @ApiProperty({ type: () => [ComponentManifestPropModel] })
  properties!: ComponentManifestPropModel[];
}

export class ComponentManifestStylePropertiesPropValueModel {
  @ApiProperty({
    enum: ComponentPropType,
    enumName: "ComponentPropType",
    example: ComponentPropType.StyleProperties,
  })
  type!: ComponentPropType.StyleProperties;

  @ApiPropertyOptional({ type: Object })
  defaultValue?: Record<string, string>;
}

export class ComponentManifestUnknownPropValueModel {
  @ApiProperty({
    enum: ComponentPropType,
    enumName: "ComponentPropType",
    example: ComponentPropType.Unknown,
  })
  type!: ComponentPropType.Unknown;

  @ApiPropertyOptional({ type: String })
  rawType?: string;
}

export class ComponentManifestArrayPropValueModel {
  @ApiProperty({
    enum: ComponentPropType,
    enumName: "ComponentPropType",
    example: ComponentPropType.Array,
  })
  type!: ComponentPropType.Array;

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(ComponentManifestStringPropValueModel) },
      { $ref: getSchemaPath(ComponentManifestNumberPropValueModel) },
      { $ref: getSchemaPath(ComponentManifestBooleanPropValueModel) },
      { $ref: getSchemaPath(ComponentManifestStringEnumPropValueModel) },
      { $ref: getSchemaPath(ComponentManifestNumberEnumPropValueModel) },
      { $ref: getSchemaPath(ComponentManifestObjectPropValueModel) },
      { $ref: getSchemaPath(ComponentManifestArrayPropValueModel) },
      { $ref: getSchemaPath(ComponentManifestStylePropertiesPropValueModel) },
      { $ref: getSchemaPath(ComponentManifestUnknownPropValueModel) },
    ],
  })
  item!: ComponentManifestPropValueModel;

  @ApiPropertyOptional({ type: [Object] })
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
  @ApiProperty({ type: String })
  key!: string;

  @ApiProperty({ type: Boolean })
  required!: boolean;

  @ApiProperty(componentPropValueOneOf())
  value!: ComponentManifestPropValueModel;
}
