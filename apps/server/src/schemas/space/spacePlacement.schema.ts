import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, Schema as MongooseSchema } from "mongoose";
import { SpacePlacementKind } from "../../enums";

@Schema({ collection: "space_placements" })
export class SpacePlacement {
  _id!: Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  stableId!: Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  revisionId!: Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  projectId!: Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  spaceId!: Types.ObjectId;

  @Prop({ required: true, type: String, enum: SpacePlacementKind })
  kind!: SpacePlacementKind;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  targetId!: Types.ObjectId;

  @Prop({ default: null, type: MongooseSchema.Types.ObjectId })
  pageViewportId!: Types.ObjectId | null;

  @Prop({ required: true, type: Number })
  order!: number;

  @Prop({ required: true, type: Number })
  x!: number;

  @Prop({ required: true, type: Number })
  y!: number;

  @Prop({ required: true, type: Number })
  width!: number;

  @Prop({ required: true, type: Number })
  height!: number;

  @Prop({ required: true, type: Number })
  zIndex!: number;
}

export type SpacePlacementDocument = HydratedDocument<SpacePlacement>;
export const SpacePlacementSchema =
  SchemaFactory.createForClass(SpacePlacement);
