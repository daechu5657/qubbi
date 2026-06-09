import * as Contract from "@qubbi/contract";
import { ApiProperty } from "@nestjs/swagger";
import { DesignTokenValueDocument } from "../../schemas/design/designTokenValue.schema";

export class DesignTokenValueModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

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
