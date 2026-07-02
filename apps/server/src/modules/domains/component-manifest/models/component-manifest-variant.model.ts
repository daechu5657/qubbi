import { ApiProperty } from "@nestjs/swagger";

export class ComponentManifestVariantModel {
  @ApiProperty({ type: String })
  key!: string;

  @ApiProperty({ type: Number })
  order!: number;
}
