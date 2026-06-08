import * as Contract from "@qubbi/contract";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({ collection: "pageTrees" })
export class PageTreeStyleOverride {
  _id!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  pageTreeId!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  componentStyleId!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  revisionId!: Types.ObjectId;

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

export type PageTreeStyleOverrideDocument =
  HydratedDocument<PageTreeStyleOverride>;
export const PageTreeStyleOverrideSchema = SchemaFactory.createForClass(
  PageTreeStyleOverride,
);
