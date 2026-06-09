import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, Schema as MongooseSchema } from "mongoose";

@Schema({ collection: "component_variants" })
export class ComponentVariant {
  _id!: Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  componentId!: Types.ObjectId;

  @Prop({ required: true, trim: true, type: String })
  key!: string;

  @Prop({ required: true, trim: true, type: String })
  name!: string;

  @Prop({ required: true, trim: true, type: Number })
  order!: number;
}

export type ComponentVariantDocument = HydratedDocument<ComponentVariant>;
export const ComponentVariantSchema =
  SchemaFactory.createForClass(ComponentVariant);
