import { ComponentManifestUploadService } from "../../../applications/component-manifest-upload/component-manifest-upload.service";
import {
  EditorController,
  ComponentLabController,
} from "../../../../shared/decorators/controller.decorator";
import multer from "multer";
import { TypedBody, TypedFormData, TypedRoute } from "@nestia/core";
import { ComponentManifestModel } from "../../../domains/component-manifest/models/component-manifest.model";

@EditorController("component-manifest")
class EditorComponentManifestController {}

class ComponentManifestUploadForm {
  "bundle.zip"!: File;
}

@ComponentLabController("component-manifest")
class ComponentLabComponentManifestController {
  constructor(
    private readonly componentManifestUploadService: ComponentManifestUploadService,
  ) {}

  @TypedRoute.Post("upload")
  async upload(
    @TypedFormData.Body(() => multer())
    form: ComponentManifestUploadForm,
  ) {
    // const buffer = Buffer.from(await form["bundle.zip"].arrayBuffer());
    // await this.componentManifestUploadService.upload(buffer);
  }

  @TypedRoute.Post("test")
  async test(
    @TypedBody()
    body: ComponentManifestModel,
  ) {
    // const buffer = Buffer.from(await form["bundle.zip"].arrayBuffer());
    // await this.componentManifestUploadService.upload(buffer);
  }
}

export default [
  EditorComponentManifestController,
  ComponentLabComponentManifestController,
];
