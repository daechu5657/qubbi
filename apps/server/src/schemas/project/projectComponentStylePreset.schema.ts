import * as Contract from "@qubbi/contract";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({ collection: "project_component_style_presets" })
export class ProjectComponentStylePreset {
  _id!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  projectComponentPresetId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId || null })
  componentVariantId?: Types.ObjectId | null;

  @Prop({ required: true, type: Types.ObjectId })
  componentStyleId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId || null })
  designTokenId?: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId || null })
  designTokenValueId?: Types.ObjectId | null;

  @Prop({ type: String || null })
  stringValue?: string | null;

  @Prop({ type: Number || null })
  numberValue?: number | null;

  @Prop({ type: Boolean || null })
  booleanValue?: boolean | null;

  @Prop({ type: String || null, enum: Contract.Enums.StyleValueUnit })
  unit?: Contract.Enums.StyleValueUnit | null;

  @Prop({ type: String || null, enum: Contract.Enums.StyleValueFormat })
  format?: Contract.Enums.StyleValueFormat | null;
}

export type ProjectComponentStylePresetDocument =
  HydratedDocument<ProjectComponentStylePreset>;
export const ProjectComponentStylePresetSchema = SchemaFactory.createForClass(
  ProjectComponentStylePreset,
);
