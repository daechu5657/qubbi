import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({ collection: "spaces" })
export class Space {
  _id!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  stableId!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  revisionId!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  projectId!: Types.ObjectId;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  order!: number;
}

export type SpaceDocument = HydratedDocument<Space>;
export const SpaceSchema = SchemaFactory.createForClass(Space);
