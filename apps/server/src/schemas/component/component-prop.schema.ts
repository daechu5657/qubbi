import * as Contract from "@qubbi/contract";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

const COMPONENT_PROP_KINDS = [
  Contract.Enums.ComponentPropKind.Style,
  Contract.Enums.ComponentPropKind.Behavior,
] as const;

@Schema({ collection: "component-props" })
export class ComponentProp {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  projectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  componentId: Types.ObjectId;

  // null 이면 baseProps, 값이 있으면 variant override props
  @Prop({ type: Types.ObjectId, default: null })
  variantId: Types.ObjectId | null;

  @Prop({
    type: Number,
    required: true,
    enum: COMPONENT_PROP_KINDS,
  })
  kind: Contract.Enums.ComponentPropKind;

  @Prop({ type: Number, default: 0 })
  order: number;

  @Prop({ type: Date, default: () => new Date() })
  createdTime: Date;

  @Prop({ type: Date, default: () => new Date() })
  updatedTime: Date;

  @Prop({ type: Date, default: null })
  deletedTime: Date | null;
}

export type ComponentPropDocument = HydratedDocument<ComponentProp>;
export const ComponentPropSchema = SchemaFactory.createForClass(ComponentProp);
