import { ApiProperty } from "@nestjs/swagger";
import { DesignTokenGroupDocument } from "../../schemas/design/designTokenGroup.schema";
import { DesignTokenModel } from "./designToken.model";

export class DesignTokenGroupModel {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: () => [DesignTokenModel] })
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
