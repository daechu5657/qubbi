import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({ collection: "page_viewport_preset" })
export class PageViewportPreset {
  _id!: Types.ObjectId;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  width!: number;

  @Prop({ required: true })
  height!: number;
}

export type PageViewportPresetDocument = HydratedDocument<PageViewportPreset>;
export const PageViewportPresetSchema =
  SchemaFactory.createForClass(PageViewportPreset);
