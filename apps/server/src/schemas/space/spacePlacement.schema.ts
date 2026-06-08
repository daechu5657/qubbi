import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { SpacePlacementKind } from "../../enums";

@Schema({ collection: "space_placements" })
export class SpacePlacement {
  _id!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  stableId!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  revisionId!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  projectId!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  spaceId!: Types.ObjectId;

  @Prop({ required: true, type: Number, enum: SpacePlacementKind })
  kind!: number;

  @Prop({ required: true, type: Types.ObjectId })
  targetId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId || null })
  pageViewportId!: Types.ObjectId | null;

  @Prop({ required: true })
  order!: number;

  @Prop({ required: true })
  x!: number;

  @Prop({ required: true })
  y!: number;

  @Prop({ required: true })
  width!: number;

  @Prop({ required: true })
  height!: number;

  @Prop({ required: true })
  zIndex!: number;
}

export type SpacePlacementDocument = HydratedDocument<SpacePlacement>;
export const SpacePlacementSchema =
  SchemaFactory.createForClass(SpacePlacement);
