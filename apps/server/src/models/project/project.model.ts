import { ApiProperty } from "@nestjs/swagger";
import { ProjectDocument } from "../../schemas/project/project.schema";
import { ProjectComponentPresetModel } from "./projectComponentPreset.model";

export class ProjectModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  currentRevisionId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
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
