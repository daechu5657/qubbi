import * as Contract from "@qubbi/contract";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, Schema as MongooseSchema } from "mongoose";

@Schema({ collection: "pageTree_style_overrides" })
export class PageTreeStyleOverride {
  _id!: Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  pageTreeId!: Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  componentStyleId!: Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  revisionId!: Types.ObjectId;

  @Prop({ default: null, type: MongooseSchema.Types.ObjectId })
  designTokenValueId!: Types.ObjectId | null;

  @Prop({ default: null, trim: true, type: String })
  stringValue!: string | null;

  @Prop({ default: null, type: Number })
  numberValue!: number | null;

  @Prop({ default: null, type: Boolean })
  booleanValue!: boolean | null;

  @Prop({ default: null, type: String, enum: Contract.Enums.StyleValueUnit })
  unit!: Contract.Enums.StyleValueUnit | null;

  @Prop({ default: null, type: String, enum: Contract.Enums.StyleValueFormat })
  format!: Contract.Enums.StyleValueFormat | null;
}

export type PageTreeStyleOverrideDocument =
  HydratedDocument<PageTreeStyleOverride>;
export const PageTreeStyleOverrideSchema = SchemaFactory.createForClass(
  PageTreeStyleOverride,
);
