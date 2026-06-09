import { ApiProperty } from "@nestjs/swagger";
import { PageTreeDocument } from "../../schemas/pageTree/pageTree.schema";
import { PageTreeStyleOverrideModel } from "./pageTreeStyleOverride.model";

export class PageTreeModel {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  stableId: string;

  @ApiProperty({ type: String })
  pageId: string;

  @ApiProperty({ type: String })
  componentId: string;

  @ApiProperty({ nullable: true, type: String })
  componentVariantId: string | null;

  @ApiProperty({ nullable: true, type: String })
  parentId: string | null;

  @ApiProperty({ type: Number })
  order: number;

  @ApiProperty({ type: () => [PageTreeStyleOverrideModel] })
  styleOverrides: PageTreeStyleOverrideModel[];

  @ApiProperty({ type: () => [PageTreeModel] })
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
