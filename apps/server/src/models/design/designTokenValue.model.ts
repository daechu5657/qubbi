import * as Contract from "@qubbi/contract";
import { ApiProperty } from "@nestjs/swagger";
import { DesignTokenValueDocument } from "../../schemas/design/designTokenValue.schema";

export class DesignTokenValueModel {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  name: string;

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

  constructor({
    _id,
    name,
    stringValue,
    numberValue,
    booleanValue,
    unit,
    format,
  }: DesignTokenValueDocument) {
    this.id = _id.toString();
    this.name = name;
    this.stringValue = stringValue ?? null;
    this.numberValue = numberValue ?? null;
    this.booleanValue = booleanValue ?? null;
    this.unit = unit ?? null;
    this.format = format ?? null;
  }
}
