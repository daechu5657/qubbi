import { Post, UploadedFile } from "@nestjs/common";
import { ComponentManifestUploadService } from "../../../applications/component-manifest-upload/component-manifest-upload.service";
import { FileUpload } from "../../../../shared/decorators/file-upload.decorator";
import {
  EditorController,
  ComponentLabController,
} from "../../../../shared/decorators/controller.decorator";

@EditorController("component-manifest")
class EditorComponentManifestController {}

@ComponentLabController("component-manifest")
class ComponentLabComponentManifestController {
  constructor(
    private readonly componentManifestUploadService: ComponentManifestUploadService,
  ) {}

  @Post("upload")
  @FileUpload("bundle.zip")
  async upload(@UploadedFile() file: Express.Multer.File) {
    await this.componentManifestUploadService.upload(file.buffer);
  }
}

export default [
  EditorComponentManifestController,
  ComponentLabComponentManifestController,
];
