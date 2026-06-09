import * as Contract from "@qubbi/contract";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, Schema as MongooseSchema } from "mongoose";

@Schema({ collection: "component_styles" })
export class ComponentStyle {
  _id!: Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  componentId!: Types.ObjectId;

  @Prop({ default: null, type: MongooseSchema.Types.ObjectId })
  componentVariantId!: Types.ObjectId | null;

  @Prop({ required: true, trim: true, type: String })
  label!: string;

  @Prop({ required: true, type: String })
  cssProperty!: keyof ElementCSSInlineStyle["style"];

  @Prop({ required: true, type: String, enum: Contract.Enums.StyleValueKind })
  valueKind!: Contract.Enums.StyleValueKind;

  @Prop({ default: null, type: String })
  defaultStringValue!: string | null;

  @Prop({ default: null, type: Number })
  defaultNumberValue!: number | null;

  @Prop({ default: null, type: Boolean })
  defaultBooleanValue!: boolean | null;

  @Prop({ default: null, type: String, enum: Contract.Enums.StyleValueUnit })
  defaultUnit!: Contract.Enums.StyleValueUnit | null;

  @Prop({ default: null, type: String, enum: Contract.Enums.StyleValueFormat })
  defaultFormat!: Contract.Enums.StyleValueFormat | null;
}

export type ComponentStyleDocument = HydratedDocument<ComponentStyle>;
export const ComponentStyleSchema =
  SchemaFactory.createForClass(ComponentStyle);
