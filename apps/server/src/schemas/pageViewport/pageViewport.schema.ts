import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, Schema as MongooseSchema } from "mongoose";

@Schema({ collection: "page_viewports" })
export class PageViewport {
  _id!: Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  projectId!: Types.ObjectId;

  @Prop({ default: null, type: MongooseSchema.Types.ObjectId })
  pageViewportPresetId!: Types.ObjectId | null;

  @Prop({ default: null, type: Number })
  width!: number | null;

  @Prop({ default: null, type: Number })
  height!: number | null;
}

export type PageViewportDocument = HydratedDocument<PageViewport>;
export const PageViewportSchema = SchemaFactory.createForClass(PageViewport);
