import * as Contract from "@qubbi/contract";
import { ApiProperty } from "@nestjs/swagger";
import { ProjectComponentStylePresetDocument } from "../../schemas/project/projectComponentStylePreset.schema";

export class ProjectComponentStylePresetModel {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ nullable: true, type: String })
  componentVariantId: string | null;

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
  designTokenId: string | null;

  @ApiProperty({ nullable: true, type: String })
  designTokenValueId: string | null;

  constructor({
    projectComponentStylePreset,
  }: {
    projectComponentStylePreset: ProjectComponentStylePresetDocument;
  }) {
    this.id = projectComponentStylePreset._id.toString();
    this.componentVariantId =
      projectComponentStylePreset.componentVariantId?.toString() ?? null;
    this.componentStyleId =
      projectComponentStylePreset.componentStyleId.toString();

    this.stringValue = projectComponentStylePreset.stringValue ?? null;
    this.numberValue = projectComponentStylePreset.numberValue ?? null;
    this.booleanValue = projectComponentStylePreset.booleanValue ?? null;

    this.unit = projectComponentStylePreset.unit ?? null;
    this.format = projectComponentStylePreset.format ?? null;
    this.designTokenId =
      projectComponentStylePreset.designTokenId?.toString() ?? null;
    this.designTokenValueId =
      projectComponentStylePreset.designTokenValueId?.toString() ?? null;
  }
}
