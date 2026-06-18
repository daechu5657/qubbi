import { ApiProperty } from "@nestjs/swagger";
import { ComponentManifestComponentModel } from "./componentManifestComponent.model";

export class ComponentManifestUploadModel {
  @ApiProperty({ type: String })
  componentVersion!: string;

  @ApiProperty({ type: () => [ComponentManifestComponentModel] })
  components!: ComponentManifestComponentModel[];
}
