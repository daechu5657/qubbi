import { Injectable } from "@nestjs/common";
import { ZipService } from "../../support/zip/zip.service";
import { ComponentManifestService } from "../../domains/component-manifest/component-manifest.service";

@Injectable()
export class ComponentManifestUploadService {
  private readonly COMPONENT_MANIFEST_FILE_NAME = "componentManifest.json";

  constructor(
    private readonly zipService: ZipService,
    private readonly componentManifestService: ComponentManifestService,
  ) {}

  async upload(buffer: Buffer) {
    const extracted = await this.zipService.extract(buffer);

    await this.componentManifestService.validate();
    await this.componentManifestService.upload();
  }
}
