import { ApiProperty } from "@nestjs/swagger";
import { ComponentManifestComponentDto } from "./componentManifestComponent.dto";

export class ComponentManifestUploadDto {
  @ApiProperty({ type: String })
  componentVersion!: string;

  @ApiProperty({ type: () => [ComponentManifestComponentDto] })
  components!: ComponentManifestComponentDto[];
}
