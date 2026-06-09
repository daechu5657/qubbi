import { ApiProperty } from "@nestjs/swagger";
import { SpacePlacementKind } from "../../enums";
import { SpacePlacementDocument } from "../../schemas/space/spacePlacement.schema";

export class SpacePlacementModel {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  stableId: string;

  @ApiProperty({ type: String })
  spaceId: string;

  @ApiProperty({ enumName: "SpacePlacementKind", enum: SpacePlacementKind })
  kind: SpacePlacementKind;

  @ApiProperty({ type: String })
  targetId: string;

  @ApiProperty({ nullable: true, type: String })
  pageViewportId: string | null;

  @ApiProperty({ type: Number })
  x: number;

  @ApiProperty({ type: Number })
  y: number;

  @ApiProperty({ type: Number })
  width: number;

  @ApiProperty({ type: Number })
  height: number;

  @ApiProperty({ type: Number })
  zIndex: number;

  @ApiProperty({ type: Number })
  order: number;

  constructor({ spacePlacement }: { spacePlacement: SpacePlacementDocument }) {
    this.id = spacePlacement._id.toString();
    this.stableId = spacePlacement.stableId.toString();
    this.spaceId = spacePlacement.spaceId.toString();
    this.kind = spacePlacement.kind;
    this.targetId = spacePlacement.targetId.toString();
    this.pageViewportId = spacePlacement.pageViewportId?.toString() ?? null;
    this.x = spacePlacement.x;
    this.y = spacePlacement.y;
    this.width = spacePlacement.width;
    this.height = spacePlacement.height;
    this.zIndex = spacePlacement.zIndex;
    this.order = spacePlacement.order;
  }
}
