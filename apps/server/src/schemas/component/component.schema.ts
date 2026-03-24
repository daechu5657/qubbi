import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({ collection: "components" })
export class Component {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  projectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  defaultVariantId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  tagName: string;

  @Prop({ required: true, default: () => new Date() })
  createdTime: Date;

  @Prop({ required: true, default: () => new Date() })
  updatedTime: Date;

  @Prop({ default: null })
  deletedTime!: Date;
}

export type ComponentDocument = HydratedDocument<Component>;
export const ComponentSchema = SchemaFactory.createForClass(Component);
