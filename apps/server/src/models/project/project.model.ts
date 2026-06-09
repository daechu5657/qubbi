import { ApiProperty } from "@nestjs/swagger";
import { ProjectDocument } from "../../schemas/project/project.schema";
import { ProjectComponentPresetModel } from "./projectComponentPreset.model";

export class ProjectModel {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  currentRevisionId: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: () => [ProjectComponentPresetModel] })
  componentPresets: ProjectComponentPresetModel[];

  constructor({
    project,
    projectComponentPresetModels,
  }: {
    project: ProjectDocument;
    projectComponentPresetModels: ProjectComponentPresetModel[];
  }) {
    this.id = project._id.toString();
    this.currentRevisionId = project.currentRevisionId.toString();
    this.name = project.name;
    this.description = project.description;

    this.componentPresets = projectComponentPresetModels;
  }
}
