import { ApiProperty } from "@nestjs/swagger";
import { PageDocument } from "../../schemas/page/page.schema";
import { PageTreeModel } from "../pageTree/pageTree.model";
import { SpaceDocument } from "../../schemas/space/space.schema";

export class PageModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  stableId: string;

  @ApiProperty()
  spaceId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  order: number;

  @ApiProperty()
  rootPageTree: PageTreeModel | null;

  constructor({
    page,
    space,
    rootPageTreeModel,
  }: {
    page: PageDocument;
    space: SpaceDocument;
    rootPageTreeModel: PageTreeModel;
  }) {
    this.id = page._id.toString();
    this.stableId = page.stableId.toString();
    this.name = page.name;
    this.order = page.order;

    this.spaceId = space._id.toString();
    this.rootPageTree = rootPageTreeModel;
  }
}
