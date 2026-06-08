import * as Contract from "@qubbi/contract";
import { ApiProperty } from "@nestjs/swagger";
import { ProjectComponentStylePresetDocument } from "../../schemas/project/projectComponentStylePreset.schema";

export class ProjectComponentStylePresetModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  componentVariantId: string | null;

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
  designTokenId: string | null;

  @ApiProperty()
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
