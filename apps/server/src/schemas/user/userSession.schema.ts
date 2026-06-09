import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, Schema as MongooseSchema } from "mongoose";

@Schema({ collection: "user_sessions" })
export class UserSession {
  _id!: Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  userId!: Types.ObjectId;

  @Prop({ required: true, type: String })
  refreshTokenHash!: string;

  @Prop({ required: true, type: Date })
  createdTime!: Date;

  @Prop({ required: true, type: Date })
  expiredTime!: Date;

  @Prop({ default: null, type: Date })
  revokedTime!: Date | null;
}

export type UserSessionDocument = HydratedDocument<UserSession>;
export const UserSessionSchema = SchemaFactory.createForClass(UserSession);
