import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({ collection: "page_viewport_presets" })
export class PageViewportPreset {
  _id!: Types.ObjectId;

  @Prop({ required: true, trim: true, type: String })
  name!: string;

  @Prop({ required: true, type: Number })
  width!: number;

  @Prop({ required: true, type: Number })
  height!: number;
}

export type PageViewportPresetDocument = HydratedDocument<PageViewportPreset>;
export const PageViewportPresetSchema =
  SchemaFactory.createForClass(PageViewportPreset);
