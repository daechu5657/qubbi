import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({ collection: "user_sessions" })
export class UserSession {
  _id!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  userId!: Types.ObjectId;

  @Prop({ required: true })
  refreshTokenHash!: string;

  @Prop({ required: true })
  createdTime!: Date;

  @Prop({ required: true })
  expiredTime!: Date;

  @Prop({ type: Date || null })
  revokedTime?: Date | null;
}

export type UserDocument = HydratedDocument<UserSession>;
export const UserSchema = SchemaFactory.createForClass(UserSession);
