import { ComponentManifestModel } from "../../../domains/component-manifest/models/component-manifest.model";

export class ComponentManifestUploadModel {
  generatedAt!: Date;
  files!: string[];
  components!: ComponentManifestModel[];
}
