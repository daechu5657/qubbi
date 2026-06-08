import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { RevisionStatus } from "../../enums";

@Schema({ collection: "revisions" })
export class Revision {
  _id!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  projectId!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  componentVersionId!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  createdBy!: Types.ObjectId;

  @Prop({ type: Types.ObjectId })
  parentRevisionId?: Types.ObjectId;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true, types: Number, enum: RevisionStatus })
  status!: RevisionStatus;
}

export type RevisionDocument = HydratedDocument<Revision>;
export const RevisionSchema = SchemaFactory.createForClass(Revision);
