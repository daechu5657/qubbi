import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({ collection: "design_token_groups" })
export class DesignTokenGroup {
  _id!: Types.ObjectId;

  @Prop({ required: true, type: Array<Types.ObjectId> })
  designTokenIds!: Types.ObjectId[];

  @Prop({ required: true })
  name!: string;
}

export type DesignTokenGroupDocument = HydratedDocument<DesignTokenGroup>;
export const DesignTokenGroupSchema =
  SchemaFactory.createForClass(DesignTokenGroup);
