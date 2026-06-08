import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({ collection: "pageTrees" })
export class PageTree {
  _id!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  stableId!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  revisionId!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  pageId!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  componentId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId || null })
  componentVariantId?: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId || null })
  parentId?: Types.ObjectId | null;

  @Prop({ type: Array<Types.ObjectId> })
  childrenIds!: Array<Types.ObjectId>;

  @Prop({ required: true })
  order!: number;
}

export type PageTreeDocument = HydratedDocument<PageTree>;
export const PageTreeSchema = SchemaFactory.createForClass(PageTree);
