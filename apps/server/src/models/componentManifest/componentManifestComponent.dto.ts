import { ApiProperty } from "@nestjs/swagger";
import { ComponentManifestPartDto } from "./componentManifestPart.dto";
import { ComponentManifestPropDto } from "./componentManifestProp.dto";
import { ComponentManifestVariantDto } from "./componentManifestVariant.dto";

export class ComponentManifestComponentDto {
  @ApiProperty({ type: String })
  name!: string;

  @ApiProperty({ type: String })
  label!: string;

  @ApiProperty({ type: () => [ComponentManifestVariantDto] })
  variants!: ComponentManifestVariantDto[];

  @ApiProperty({ type: () => [ComponentManifestPropDto] })
  props!: ComponentManifestPropDto[];

  @ApiProperty({ type: () => ComponentManifestPartDto })
  parts!: ComponentManifestPartDto;
}
