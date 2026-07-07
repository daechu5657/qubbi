import typia from "typia";
import { Injectable } from "@nestjs/common";
import { ZipService } from "../../support/zip/zip.service";
import { ComponentManifestService } from "../../domains/component-manifest/component-manifest.service";
import { ComponentManifestUploadModel } from "./models/component-manifest-upload.model";

@Injectable()
export class ComponentManifestUploadService {
  private readonly COMPONENT_MANIFEST_FILE_NAME = "componentManifest.json";

  constructor(
    private readonly zipService: ZipService,
    private readonly componentManifestService: ComponentManifestService,
  ) {}

  async upload(buffer: Buffer) {
    const extracted = await this.zipService.extract(buffer); // TODO: 타입
    const asd = extracted.data;
    // const { data, success } =
    //   typia.json.validateParse<ComponentManifestUploadModel>(jsonString);

    await this.componentManifestService.validate();
    await this.componentManifestService.upload();
  }
}
