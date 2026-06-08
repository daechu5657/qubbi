import { ApiProperty } from "@nestjs/swagger";
import { PageTreeDocument } from "../../schemas/pageTree/pageTree.schema";
import { PageTreeStyleOverrideModel } from "./pageTreeStyleOverride.model";

export class PageTreeModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  stableId: string;

  @ApiProperty()
  pageId: string;

  @ApiProperty()
  componentId: string;

  @ApiProperty()
  componentVariantId: string | null;

  @ApiProperty()
  parentId: string | null;

  @ApiProperty()
  order: number;

  @ApiProperty()
  styleOverrides: PageTreeStyleOverrideModel[];

  @ApiProperty()
  children: PageTreeModel[];

  constructor({
    pageTree,
    styleOverrideModels,
    children,
  }: {
    pageTree: PageTreeDocument;
    styleOverrideModels: PageTreeStyleOverrideModel[];
    children: PageTreeModel[];
  }) {
    this.id = pageTree._id.toString();
    this.stableId = pageTree.stableId.toString();
    this.pageId = pageTree.pageId.toString();
    this.componentId = pageTree.componentId.toString();
    this.componentVariantId = pageTree.componentVariantId?.toString() ?? null;
    this.parentId = pageTree.parentId?.toString() ?? null;
    this.order = pageTree.order;

    this.styleOverrides = styleOverrideModels;
    this.children = children;
  }
}
