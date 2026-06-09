import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, Schema as MongooseSchema } from "mongoose";

@Schema({ collection: "users" })
export class User {
  _id!: Types.ObjectId;

  @Prop({ required: true, trim: true, type: String })
  loginId!: string;

  @Prop({ required: true, trim: true, type: String })
  name!: string;

  @Prop({ required: true, type: String })
  passwordHash!: string;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
