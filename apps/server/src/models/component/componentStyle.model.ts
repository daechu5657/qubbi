import * as Contract from "@qubbi/contract";
import { ApiProperty } from "@nestjs/swagger";
import { ComponentStyleDocument } from "../../schemas/component/component-style.schema";

export class ComponentStyleModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  componentVariantId: string | null;

  @ApiProperty()
  label: string;

  @ApiProperty()
  cssProperty: keyof ElementCSSInlineStyle["style"];

  @ApiProperty()
  valueKind: Contract.Enums.StyleValueKind;

  @ApiProperty()
  stringValue: string | null;

  @ApiProperty()
  numberValue: number | null;

  @ApiProperty()
  booleanValue: boolean | null;

  @ApiProperty()
  unit: Contract.Enums.StyleValueUnit | null;

  @ApiProperty()
  format: Contract.Enums.StyleValueFormat | null;

  constructor({ style }: { style: ComponentStyleDocument }) {
    this.id = style._id.toString();
    this.componentVariantId = style.componentVariantId?.toString() ?? null;
    this.label = style.label;
    this.cssProperty = style.cssProperty;
    this.valueKind = style.valueKind;
    this.stringValue = style.defaultStringValue ?? null;
    this.numberValue = style.defaultNumberValue ?? null;
    this.booleanValue = style.defaultBooleanValue ?? null;
    this.unit = style.defaultUnit ?? null;
    this.format = style.defaultFormat ?? null;
  }
}
