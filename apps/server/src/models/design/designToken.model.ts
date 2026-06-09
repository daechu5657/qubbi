import * as Contract from "@qubbi/contract";
import { ApiProperty } from "@nestjs/swagger";
import { DesignTokenValueModel } from "./designTokenValue.model";
import { DesignTokenDocument } from "../../schemas/design/designToken.schema";

export class DesignTokenModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  valueKind: Contract.Enums.StyleValueKind;

  @ApiProperty()
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
