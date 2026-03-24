import * as Contract from "@qubbi/contract";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

const STYLE_VALUE_KINDS = [
  Contract.Enums.ComponentPropStyleValueKind.Unset,
  Contract.Enums.ComponentPropStyleValueKind.Literal,
  Contract.Enums.ComponentPropStyleValueKind.DesignToken,
] as const;

@Schema({ collection: "component_style_values" })
export class ComponentStyleValue {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  projectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  styleId: Types.ObjectId;

  @Prop({ type: Number, required: true, enum: STYLE_VALUE_KINDS })
  kind: Contract.Enums.ComponentPropStyleValueKind;

  @Prop({ type: Types.ObjectId, default: null })
  designTokenId: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, default: null })
  designTokenValueId: Types.ObjectId | null;

  @Prop({ type: String, default: null })
  stringValue: string | null;

  @Prop({ type: Number, default: null })
  numberValue: number | null;

  @Prop({ type: Date, default: () => new Date() })
  createdTime: Date;

  @Prop({ type: Date, default: () => new Date() })
  updatedTime: Date;

  @Prop({ type: Date, default: null })
  deletedTime: Date | null;
}

export type ComponentStyleValueDocument = HydratedDocument<ComponentStyleValue>;
export const ComponentStyleValueSchema =
  SchemaFactory.createForClass(ComponentStyleValue);
