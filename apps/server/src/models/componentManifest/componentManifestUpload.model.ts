import { ApiProperty } from "@nestjs/swagger";
import { ComponentManifestComponentModel } from "./componentManifestComponent.model";

export class ComponentManifestUploadModel {
  @ApiProperty({ type: () => [Date] })
  generatedAt!: Date;

  @ApiProperty({ type: () => [String] })
  files!: string[];

  @ApiProperty({ type: () => [ComponentManifestComponentModel] })
  components!: ComponentManifestComponentModel[];
}
