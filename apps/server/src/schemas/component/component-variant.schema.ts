import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({ collection: "component-variants" })
export class ComponentVariant {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  projectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  componentId: Types.ObjectId;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  order: number;

  @Prop({ required: true, default: () => new Date() })
  createdTime: Date;

  @Prop({ required: true, default: () => new Date() })
  updatedTime: Date;

  @Prop({ default: null })
  deletedTime!: Date;
}

export type ComponentVariantDocument = HydratedDocument<ComponentVariant>;
export const ComponentVariantSchema =
  SchemaFactory.createForClass(ComponentVariant);
