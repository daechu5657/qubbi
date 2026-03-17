import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({ collection: "tests" })
export class Test {
  _id!: Types.ObjectId;

  @Prop({ required: true })
  name!: number;

  @Prop({ required: true })
  email!: string;

  @Prop({ default: null })
  deletedTime!: Date;
}

export type TestDocument = HydratedDocument<Test>;
export const TestSchema = SchemaFactory.createForClass(Test);
