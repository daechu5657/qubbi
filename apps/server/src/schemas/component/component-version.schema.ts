import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({ collection: "component_versions" })
export class ComponentVersion {
  _id!: Types.ObjectId;

  @Prop({ required: true })
  version!: string;
}

export type ComponentVersionDocument = HydratedDocument<ComponentVersion>;
export const ComponentVersionSchema =
  SchemaFactory.createForClass(ComponentVersion);
