import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, Schema as MongooseSchema } from "mongoose";

@Schema({ collection: "components" })
export class Component {
  _id!: Types.ObjectId;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
  })
  componentVersionId!: Types.ObjectId;

  @Prop({ required: true, trim: true, type: String })
  name!: string;

  @Prop({ required: true, trim: true, type: String })
  tagName!: string;
}

export type ComponentDocument = HydratedDocument<Component>;
export const ComponentSchema = SchemaFactory.createForClass(Component);
