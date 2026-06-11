import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, Schema as MongooseSchema } from "mongoose";
import { ComponentPartKind } from "../../enums/componentPartKind";

@Schema({ collection: "component_parts" })
export class ComponentPart {
  _id!: Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  componentId!: Types.ObjectId;

  @Prop({ default: null, type: MongooseSchema.Types.ObjectId })
  parentPartId!: Types.ObjectId | null;

  @Prop({ required: true, trim: true, type: String })
  tagName!: string;

  @Prop({ required: true, type: Number })
  order!: number;

  @Prop({ required: true, type: String, enum: ComponentPartKind })
  kind!: ComponentPartKind;
}

export type ComponentPartDocument = HydratedDocument<ComponentPart>;
export const ComponentPartSchema = SchemaFactory.createForClass(ComponentPart);
