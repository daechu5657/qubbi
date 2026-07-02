import { ApiProperty } from "@nestjs/swagger";
import { ComponentManifestModel } from "../../../domains/component-manifest/models/component-manifest-component.model";

export class ComponentManifestUploadModel {
  @ApiProperty({ type: () => [Date] })
  generatedAt!: Date;

  @ApiProperty({ type: () => [String] })
  files!: string[];

  @ApiProperty({ type: () => [ComponentManifestModel] })
  components!: ComponentManifestModel[];
}
