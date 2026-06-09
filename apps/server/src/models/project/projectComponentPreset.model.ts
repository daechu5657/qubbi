import { ApiProperty } from "@nestjs/swagger";
import { ProjectComponentStylePresetModel } from "./projectComponentStylePreset.model";
import { ProjectComponentPresetDocument } from "../../schemas/project/projectComponentPreset.schema";

export class ProjectComponentPresetModel {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  componentId: string;

  @ApiProperty({ type: () => [ProjectComponentStylePresetModel] })
  stylePresets: ProjectComponentStylePresetModel[];

  constructor({
    projectComponentPreset,
    projectComponentStylePresetModels,
  }: {
    projectComponentPreset: ProjectComponentPresetDocument;
    projectComponentStylePresetModels: ProjectComponentStylePresetModel[];
  }) {
    this.id = projectComponentPreset._id.toString();
    this.componentId = projectComponentPreset.componentId.toString();
    this.stylePresets = projectComponentStylePresetModels;
  }
}
