import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, Schema as MongooseSchema } from "mongoose";
import { RevisionStatus } from "../../enums";

@Schema({ collection: "revisions" })
export class Revision {
  _id!: Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  projectId!: Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  componentVersionId!: Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  createdBy!: Types.ObjectId;

  @Prop({ default: null, type: MongooseSchema.Types.ObjectId })
  parentRevisionId!: Types.ObjectId | null;

  @Prop({ required: true, trim: true, type: String })
  name!: string;

  @Prop({ required: true, type: String })
  description!: string;

  @Prop({ required: true, type: Number, enum: RevisionStatus })
  status!: RevisionStatus;
}

export type RevisionDocument = HydratedDocument<Revision>;
export const RevisionSchema = SchemaFactory.createForClass(Revision);
