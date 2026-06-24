import * as Contract from "@qubbi/contract";
import {
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from "@nestjs/swagger";

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
      [Contract.Enums.ComponentPropType.String]: getSchemaPath(
        ComponentManifestStringPropValueModel,
      ),
      [Contract.Enums.ComponentPropType.Number]: getSchemaPath(
        ComponentManifestNumberPropValueModel,
      ),
      [Contract.Enums.ComponentPropType.Boolean]: getSchemaPath(
        ComponentManifestBooleanPropValueModel,
      ),
      [Contract.Enums.ComponentPropType.StringEnum]: getSchemaPath(
        ComponentManifestStringEnumPropValueModel,
      ),
      [Contract.Enums.ComponentPropType.NumberEnum]: getSchemaPath(
        ComponentManifestNumberEnumPropValueModel,
      ),
      [Contract.Enums.ComponentPropType.Object]: getSchemaPath(
        ComponentManifestObjectPropValueModel,
      ),
      [Contract.Enums.ComponentPropType.Array]: getSchemaPath(
        ComponentManifestArrayPropValueModel,
      ),
      [Contract.Enums.ComponentPropType.StyleProperties]: getSchemaPath(
        ComponentManifestStylePropertiesPropValueModel,
      ),
      [Contract.Enums.ComponentPropType.Unknown]: getSchemaPath(
        ComponentManifestUnknownPropValueModel,
      ),
    },
  },
});

export class ComponentManifestStringPropValueModel {
  @ApiProperty({
    enum: Contract.Enums.ComponentPropType,
    enumName: "ComponentPropType",
    example: Contract.Enums.ComponentPropType.String,
  })
  type!: Contract.Enums.ComponentPropType.String;

  @ApiPropertyOptional({ type: String })
  defaultValue?: string;
}

export class ComponentManifestNumberPropValueModel {
  @ApiProperty({
    enum: Contract.Enums.ComponentPropType,
    enumName: "ComponentPropType",
    example: Contract.Enums.ComponentPropType.Number,
  })
  type!: Contract.Enums.ComponentPropType.Number;

  @ApiPropertyOptional({ type: Number })
  defaultValue?: number;
}

export class ComponentManifestBooleanPropValueModel {
  @ApiProperty({
    enum: Contract.Enums.ComponentPropType,
    enumName: "ComponentPropType",
    example: Contract.Enums.ComponentPropType.Boolean,
  })
  type!: Contract.Enums.ComponentPropType.Boolean;

  @ApiPropertyOptional({ type: Boolean })
  defaultValue?: boolean;
}

export class ComponentManifestStringEnumPropValueModel {
  @ApiProperty({
    enum: Contract.Enums.ComponentPropType,
    enumName: "ComponentPropType",
    example: Contract.Enums.ComponentPropType.StringEnum,
  })
  type!: Contract.Enums.ComponentPropType.StringEnum;

  @ApiProperty({ type: [String] })
  values!: string[];

  @ApiPropertyOptional({ type: String })
  defaultValue?: string;
}

export class ComponentManifestNumberEnumPropValueModel {
  @ApiProperty({
    enum: Contract.Enums.ComponentPropType,
    enumName: "ComponentPropType",
    example: Contract.Enums.ComponentPropType.NumberEnum,
  })
  type!: Contract.Enums.ComponentPropType.NumberEnum;

  @ApiProperty({ type: [Number] })
  values!: number[];

  @ApiPropertyOptional({ type: Number })
  defaultValue?: number;
}

export class ComponentManifestObjectPropValueModel {
  @ApiProperty({
    enum: Contract.Enums.ComponentPropType,
    enumName: "ComponentPropType",
    example: Contract.Enums.ComponentPropType.Object,
  })
  type!: Contract.Enums.ComponentPropType.Object;

  @ApiProperty({ type: () => [ComponentManifestPropModel] })
  properties!: ComponentManifestPropModel[];
}

export class ComponentManifestStylePropertiesPropValueModel {
  @ApiProperty({
    enum: Contract.Enums.ComponentPropType,
    enumName: "ComponentPropType",
    example: Contract.Enums.ComponentPropType.StyleProperties,
  })
  type!: Contract.Enums.ComponentPropType.StyleProperties;

  @ApiPropertyOptional({ type: Object })
  defaultValue?: Record<string, string>;
}

export class ComponentManifestUnknownPropValueModel {
  @ApiProperty({
    enum: Contract.Enums.ComponentPropType,
    enumName: "ComponentPropType",
    example: Contract.Enums.ComponentPropType.Unknown,
  })
  type!: Contract.Enums.ComponentPropType.Unknown;

  @ApiPropertyOptional({ type: String })
  rawType?: string;
}

export class ComponentManifestArrayPropValueModel {
  @ApiProperty({
    enum: Contract.Enums.ComponentPropType,
    enumName: "ComponentPropType",
    example: Contract.Enums.ComponentPropType.Array,
  })
  type!: Contract.Enums.ComponentPropType.Array;

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
