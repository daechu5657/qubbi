import { ApiProperty } from "@nestjs/swagger";
import { SpaceDocument } from "../../schemas/space/space.schema";
import { PageModel } from "../page/page.model";
import { SpacePlacementModel } from "./spacePlacement.model";

export class SpaceModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  stableId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  order: number;

  @ApiProperty()
  pages: PageModel[];

  @ApiProperty()
  placements: SpacePlacementModel[];

  constructor({
    space,
    pageModels,
    spacePlacementModels,
  }: {
    space: SpaceDocument;
    pageModels: PageModel[];
    spacePlacementModels: SpacePlacementModel[];
  }) {
    this.id = space._id.toString();
    this.stableId = space.stableId.toString();
    this.name = space.name;
    this.order = space.order;

    this.pages = pageModels;
    this.placements = spacePlacementModels;
  }
}
