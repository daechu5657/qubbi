import * as Contract from "@qubbi/contract";
import { ApiProperty } from "@nestjs/swagger";
import { DesignTokenValueModel } from "./designTokenValue.model";
import { DesignTokenDocument } from "../../schemas/design/designToken.schema";

export class DesignTokenModel {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({
    enumName: "StyleValueKind",
    enum: Contract.Enums.StyleValueKind,
  })
  valueKind: Contract.Enums.StyleValueKind;

  @ApiProperty({ type: () => [DesignTokenValueModel] })
  values: DesignTokenValueModel[];

  constructor({
    designToken,
    designTokenValueModels,
  }: {
    designToken: DesignTokenDocument;
    designTokenValueModels: DesignTokenValueModel[];
  }) {
    this.id = designToken._id.toString();
    this.name = designToken.name;
    this.valueKind = designToken.valueKind;
    this.values = designTokenValueModels;
  }
}
