import { ApiProperty } from "@nestjs/swagger";
import { PageDocument } from "../../schemas/page/page.schema";
import { PageTreeModel } from "../pageTree/pageTree.model";

export class PageModel {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  stableId: string;

  @ApiProperty({ type: String })
  spaceId: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  order: number;

  @ApiProperty({ nullable: true, type: () => PageTreeModel })
  rootPageTree: PageTreeModel | null;

  constructor({
    page,
    rootPageTreeModel,
  }: {
    page: PageDocument;
    rootPageTreeModel: PageTreeModel;
  }) {
    this.id = page._id.toString();
    this.stableId = page.stableId.toString();
    this.name = page.name;
    this.order = page.order;

    this.spaceId = page.spaceId.toString();
    this.rootPageTree = rootPageTreeModel;
  }
}
