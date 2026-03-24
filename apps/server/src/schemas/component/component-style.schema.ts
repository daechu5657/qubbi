import * as Contract from "@qubbi/contract";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

const STYLE_VALUE_TYPES = [
  Contract.Enums.StyleValueType.String,
  Contract.Enums.StyleValueType.Number,
] as const;

const STYLE_VALUE_UNITS = [
  Contract.Enums.StyleValueUnit.Px,
  Contract.Enums.StyleValueUnit.Rem,
  Contract.Enums.StyleValueUnit.Percent,
] as const;

@Schema({ collection: "component_styles" })
export class ComponentStyle {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  projectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  propId: Types.ObjectId;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  cssProperty: keyof ElementCSSInlineStyle["style"];

  @Prop({ type: Number, required: true, enum: STYLE_VALUE_TYPES })
  valueType: Contract.Enums.StyleValueType;

  @Prop({ type: Number, enum: STYLE_VALUE_UNITS, default: null })
  unit: Contract.Enums.StyleValueUnit | null;

  @Prop({ type: [Types.ObjectId], default: [] })
  designTokenIds: Types.ObjectId[];

  @Prop({ type: Date, default: () => new Date() })
  createdTime: Date;

  @Prop({ type: Date, default: () => new Date() })
  updatedTime: Date;

  @Prop({ type: Date, default: null })
  deletedTime: Date | null;
}

export type ComponentStyleDocument = HydratedDocument<ComponentStyle>;
export const ComponentStyleSchema =
  SchemaFactory.createForClass(ComponentStyle);
