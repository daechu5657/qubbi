import { Post, UploadedFile } from "@nestjs/common";
import { ComponentLabController } from "./base.controller";
import { ApiFileUpload } from "../../common/decorators/apiUpload.decorator";
import { ZipService } from "../../common/services/zip.service";
import { ComponentManifestService } from "../../services/componentManifest/componentManifest.service";
import { ComponentManifestModelingService } from "../../services/componentManifest/componentManifestModeling.service";

const COMPONENT_MANIFEST_FILE_NAME = "componentManifest.json";

@ComponentLabController("componentManifest")
export class ComponentManifestController {
  constructor(
    private readonly componentManifestService: ComponentManifestService,
    private readonly componentManifestModelingService: ComponentManifestModelingService,
    private readonly zipService: ZipService,
  ) {}

  @Post("upload")
  @ApiFileUpload("bundle.zip")
  async upload(@UploadedFile() file: Express.Multer.File) {
    const extractedData = await this.zipService.extract(file.buffer);

    const manifestBuffer = extractedData.get(COMPONENT_MANIFEST_FILE_NAME);
    const uploadModel =
      await this.componentManifestModelingService.modeling(manifestBuffer);

    await this.componentManifestService.validate();
    await this.componentManifestService.upload(uploadModel);
  }
}
