import { ApiProperty } from "@nestjs/swagger";
import { SpacePlacementKind } from "../../enums";
import { SpacePlacementDocument } from "../../schemas/space/spacePlacement.schema";

export class SpacePlacementModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  stableId: string;

  @ApiProperty()
  spaceId: string;

  @ApiProperty()
  kind: SpacePlacementKind;

  @ApiProperty()
  targetId: string;

  @ApiProperty()
  x: number;

  @ApiProperty()
  y: number;

  @ApiProperty()
  width: number;

  @ApiProperty()
  height: number;

  @ApiProperty()
  zIndex: number;

  @ApiProperty()
  order: number;

  constructor({ spacePlacement }: { spacePlacement: SpacePlacementDocument }) {
    this.id = spacePlacement._id.toString();
    this.stableId = spacePlacement.stableId.toString();
    this.spaceId = spacePlacement.spaceId.toString();
    this.kind = spacePlacement.kind;
    this.targetId = spacePlacement.targetId.toString();
    this.x = spacePlacement.x;
    this.y = spacePlacement.y;
    this.width = spacePlacement.width;
    this.height = spacePlacement.height;
    this.zIndex = spacePlacement.zIndex;
    this.order = spacePlacement.order;
  }
}
