import * as Contract from "@qubbi/contract";
import { ApiProperty } from "@nestjs/swagger";
import { PageTreeStyleOverrideDocument } from "../../schemas/pageTree/pageTreeStyleOverride.schema";

export class PageTreeStyleOverrideModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  componentStyleId: string;

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

  @ApiProperty()
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
