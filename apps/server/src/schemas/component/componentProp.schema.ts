import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, Schema as MongooseSchema } from "mongoose";
// import { ComponentPropType } from "../../enums/componentPropType";

@Schema({ collection: "component_props" })
export class ComponentProp {
  _id!: Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  componentId!: Types.ObjectId;

  @Prop({ required: true, trim: true, type: String })
  key!: string;

  // @Prop({ required: true, type: String, enum: ComponentPropType })
  // type!: string;

  @Prop({ required: true, type: Boolean })
  required!: boolean;
}

export type ComponentPropDocument = HydratedDocument<ComponentProp>;
export const ComponentPropSchema = SchemaFactory.createForClass(ComponentProp);
