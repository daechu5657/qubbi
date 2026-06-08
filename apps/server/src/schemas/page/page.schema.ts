import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({ collection: "pages" })
export class Page {
  _id!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  stableId!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  revisionId!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  spaceId!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  rootPageTreeId!: Types.ObjectId;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  order!: number;
}

export type PageDocument = HydratedDocument<Page>;
export const PageSchema = SchemaFactory.createForClass(Page);
