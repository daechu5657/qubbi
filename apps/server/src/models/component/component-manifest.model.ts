import { ApiProperty } from "@nestjs/swagger";

export class ComponentManifestModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  projectId: string;

  @ApiProperty()
  defaultVariantId: string;

  @ApiProperty()
  variantIds: string;

  @ApiProperty()
  baseProps: string;

  @ApiProperty()
  tagName: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdTime: string;

  @ApiProperty()
  updatedTime: string;

  @ApiProperty()
  deletedTime: string;

  constructor() {}
}
