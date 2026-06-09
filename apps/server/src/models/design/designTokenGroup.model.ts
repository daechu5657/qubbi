import { ApiProperty } from "@nestjs/swagger";
import { DesignTokenGroupDocument } from "../../schemas/design/designTokenGroup.schema";
import { DesignTokenModel } from "./designToken.model";

export class DesingTokenGroupModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  designTokens: DesignTokenModel[];

  constructor({
    designTokenGroup,
    DesignTokenModels,
  }: {
    designTokenGroup: DesignTokenGroupDocument;
    DesignTokenModels: DesignTokenModel[];
  }) {
    this.id = designTokenGroup._id.toString();
    this.name = designTokenGroup.name;
    this.designTokens = DesignTokenModels;
  }
}
