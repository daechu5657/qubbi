import { ApiProperty } from "@nestjs/swagger";

export class ComponentManifestVariantDto {
  @ApiProperty({ type: String })
  key!: string;

  @ApiProperty({ type: Number })
  order!: number;
}
