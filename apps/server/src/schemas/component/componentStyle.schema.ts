import * as Contract from "@qubbi/contract";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({ collection: "component_styles" })
export class ComponentStyle {
  _id!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  componentId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId || null })
  componentVariantId?: Types.ObjectId | null;

  @Prop({ required: true })
  label!: string;

  @Prop({ required: true, type: String })
  cssProperty!: keyof ElementCSSInlineStyle["style"];

  @Prop({ required: true, type: String, enum: Contract.Enums.StyleValueKind })
  valueKind!: Contract.Enums.StyleValueKind;

  @Prop({ type: String || null })
  defaultStringValue?: string | null;

  @Prop({ type: Number || null })
  defaultNumberValue?: number | null;

  @Prop({ type: Boolean || null })
  defaultBooleanValue?: boolean | null;

  @Prop({ type: String || null, enum: Contract.Enums.StyleValueUnit })
  defaultUnit?: Contract.Enums.StyleValueUnit | null;

  @Prop({ type: String || null, enum: Contract.Enums.StyleValueFormat })
  defaultFormat?: Contract.Enums.StyleValueFormat | null;
}

export type ComponentStyleDocument = HydratedDocument<ComponentStyle>;
export const ComponentStyleSchema =
  SchemaFactory.createForClass(ComponentStyle);
