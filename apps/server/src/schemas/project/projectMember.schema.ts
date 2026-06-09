import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, Schema as MongooseSchema } from "mongoose";
import { ProjectRole } from "../../enums";

@Schema({ collection: "project_members" })
export class ProjectMember {
  _id!: Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  projectId!: Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  userId!: Types.ObjectId;

  @Prop({ required: true, type: Number, enum: ProjectRole })
  role!: ProjectRole;
}

export type ProjectMemberDocument = HydratedDocument<ProjectMember>;
export const ProjectMemberSchema = SchemaFactory.createForClass(ProjectMember);
