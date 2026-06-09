import * as Contract from "@qubbi/contract";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, Schema as MongooseSchema } from "mongoose";

@Schema({ collection: "design_token_values" })
export class DesignTokenValue {
  _id!: Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  designTokenId!: Types.ObjectId;

  @Prop({ required: true, trim: true, type: String })
  name!: string;

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

export type DesignTokenValueDocument = HydratedDocument<DesignTokenValue>;
export const DesignTokenValueSchema =
  SchemaFactory.createForClass(DesignTokenValue);
