import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, Schema as MongooseSchema } from "mongoose";

@Schema({ collection: "project_component_presets" })
export class ProjectComponentPreset {
  _id!: Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  revisionId!: Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  projectId!: Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  componentId!: Types.ObjectId;
}

export type ProjectComponentPresetDocument =
  HydratedDocument<ProjectComponentPreset>;
export const ProjectComponentPresetSchema = SchemaFactory.createForClass(
  ProjectComponentPreset,
);
