import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({ collection: "projects" })
export class Project {
  _id!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  currentRevisionId!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  createdBy!: Types.ObjectId;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  description!: string;
}

export type ProjectDocument = HydratedDocument<Project>;
export const ProjectSchema = SchemaFactory.createForClass(Project);
