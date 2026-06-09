import * as Contract from "@qubbi/contract";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({ collection: "design_tokens" })
export class DesignToken {
  _id!: Types.ObjectId;

  @Prop({ required: true, trim: true, type: String })
  name!: string;

  @Prop({ required: true, type: String, enum: Contract.Enums.StyleValueKind })
  valueKind!: Contract.Enums.StyleValueKind;
}

export type DesignTokenDocument = HydratedDocument<DesignToken>;
export const DesignTokenSchema = SchemaFactory.createForClass(DesignToken);
