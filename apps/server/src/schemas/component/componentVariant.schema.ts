import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({ collection: "component_variants" })
export class ComponentVariant {
  _id!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  componentId!: Types.ObjectId;

  @Prop({ required: true })
  key!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  order!: number;
}

export type ComponentVariantDocument = HydratedDocument<ComponentVariant>;
export const ComponentVariantSchema =
  SchemaFactory.createForClass(ComponentVariant);
