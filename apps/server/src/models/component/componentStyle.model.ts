import * as Contract from "@qubbi/contract";
import { ApiProperty } from "@nestjs/swagger";
import { ComponentStyleDocument } from "../../schemas/component/componentStyle.schema";

export class ComponentStyleModel {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ nullable: true, type: String })
  componentVariantId: string | null;

  // @ApiProperty({ type: String })
  // label: string;

  @ApiProperty({ type: String })
  cssProperty: keyof ElementCSSInlineStyle["style"];

  @ApiProperty({
    enumName: "StyleValueKind",
    enum: Contract.Enums.StyleValueKind,
  })
  valueKind: Contract.Enums.StyleValueKind;

  @ApiProperty({ nullable: true, type: String })
  stringValue: string | null;

  @ApiProperty({ nullable: true, type: Number })
  numberValue: number | null;

  @ApiProperty({ nullable: true, type: Boolean })
  booleanValue: boolean | null;

  @ApiProperty({
    nullable: true,
    enumName: "StyleValueUnit",
    enum: Contract.Enums.StyleValueUnit,
  })
  unit: Contract.Enums.StyleValueUnit | null;

  @ApiProperty({
    nullable: true,
    enumName: "StyleValueFormat",
    enum: Contract.Enums.StyleValueFormat,
  })
  format: Contract.Enums.StyleValueFormat | null;

  constructor({ style }: { style: ComponentStyleDocument }) {
    this.id = style._id.toString();
    this.componentVariantId = style.componentVariantId?.toString() ?? null;
    // this.label = style.label;
    this.cssProperty = style.cssProperty;
    this.valueKind = style.valueKind;
    this.stringValue = style.defaultStringValue ?? null;
    this.numberValue = style.defaultNumberValue ?? null;
    this.booleanValue = style.defaultBooleanValue ?? null;
    this.unit = style.defaultUnit ?? null;
    this.format = style.defaultFormat ?? null;
  }
}
