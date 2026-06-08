import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({ collection: "page_viewports" })
export class PageViewport {
  _id!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  projectId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId || null })
  pageViewportPresetId?: Types.ObjectId | null;

  @Prop({ type: Number || null })
  width?: number | null;

  @Prop({ type: Number || null })
  height?: number | null;
}

export type PageViewportDocument = HydratedDocument<PageViewport>;
export const PageViewportSchema = SchemaFactory.createForClass(PageViewport);
