import { Module } from "@nestjs/common";
import { ComponentManifestUploadModule } from "../../applications/component-manifest-upload/component-manifest-upload.module";
import ComponentManifestControllers from "./controllers/component-manifest.controller";

@Module({
  imports: [ComponentManifestUploadModule],
  controllers: [...ComponentManifestControllers],
})
export class ComponentManagementModule {}
