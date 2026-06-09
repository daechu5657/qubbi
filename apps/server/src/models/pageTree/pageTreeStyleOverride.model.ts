import * as Contract from "@qubbi/contract";
import { ApiProperty } from "@nestjs/swagger";
import { PageTreeStyleOverrideDocument } from "../../schemas/pageTree/pageTreeStyleOverride.schema";

export class PageTreeStyleOverrideModel {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  componentStyleId: string;

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

  @ApiProperty({ nullable: true, type: String })
  designTokenValueId: string | null;

  constructor({
    pageTreeStyleOverride,
  }: {
    pageTreeStyleOverride: PageTreeStyleOverrideDocument;
  }) {
    this.id = pageTreeStyleOverride._id.toString();
    this.componentStyleId = pageTreeStyleOverride.componentStyleId.toString();
    this.stringValue = pageTreeStyleOverride.stringValue ?? null;
    this.numberValue = pageTreeStyleOverride.numberValue ?? null;
    this.booleanValue = pageTreeStyleOverride.booleanValue ?? null;
    this.unit = pageTreeStyleOverride.unit ?? null;
    this.format = pageTreeStyleOverride.format ?? null;
    this.designTokenValueId =
      pageTreeStyleOverride.designTokenValueId?.toString() ?? null;
  }
}
