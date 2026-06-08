import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({ collection: "project_component_presets" })
export class ProjectComponentPreset {
  _id!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  revisionId!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  projectId!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  componentId!: Types.ObjectId;
}

export type ProjectComponentPresetDocument =
  HydratedDocument<ProjectComponentPreset>;
export const ProjectComponentPresetSchema = SchemaFactory.createForClass(
  ProjectComponentPreset,
);
