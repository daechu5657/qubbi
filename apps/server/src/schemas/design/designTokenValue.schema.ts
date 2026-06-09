import * as Contract from "@qubbi/contract";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({ collection: "design_token_values" })
export class DesignTokenValue {
  _id!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  designTokenId!: Types.ObjectId;

  @Prop({ required: true })
  name!: string;

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

export type DesignTokenValueDocument = HydratedDocument<DesignTokenValue>;
export const DesignTokenValueSchema =
  SchemaFactory.createForClass(DesignTokenValue);
