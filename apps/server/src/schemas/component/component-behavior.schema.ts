import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({ collection: "component_behaviors" })
export class ComponentBehavior {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  projectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  propId: Types.ObjectId;

  @Prop({ required: true })
  key: string;

  @Prop({ type: Date, default: () => new Date() })
  createdTime: Date;

  @Prop({ type: Date, default: () => new Date() })
  updatedTime: Date;

  @Prop({ type: Date, default: null })
  deletedTime: Date | null;
}

export type ComponentBehaviorDocument = HydratedDocument<ComponentBehavior>;
export const ComponentBehaviorSchema =
  SchemaFactory.createForClass(ComponentBehavior);
