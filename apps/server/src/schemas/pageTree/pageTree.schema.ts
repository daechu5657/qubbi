import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, Schema as MongooseSchema } from "mongoose";

@Schema({ collection: "pageTrees" })
export class PageTree {
  _id!: Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  stableId!: Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  revisionId!: Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  pageId!: Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  componentId!: Types.ObjectId;

  @Prop({ default: null, type: MongooseSchema.Types.ObjectId })
  componentVariantId!: Types.ObjectId | null;

  @Prop({ default: null, type: MongooseSchema.Types.ObjectId })
  parentId!: Types.ObjectId | null;

  @Prop({ type: [MongooseSchema.Types.ObjectId] })
  childrenIds!: Types.ObjectId[];

  @Prop({ required: true, type: Number })
  order!: number;
}

export type PageTreeDocument = HydratedDocument<PageTree>;
export const PageTreeSchema = SchemaFactory.createForClass(PageTree);
