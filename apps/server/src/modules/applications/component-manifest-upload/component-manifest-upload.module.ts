import { ZipModule } from "../../support/zip/zip.module";
import { ComponentManifestModule } from "../../domains/component-manifest/component-manifest.module";
import { Module } from "@nestjs/common";
import { ComponentManifestUploadService } from "./component-manifest-upload.service";

@Module({
  imports: [ZipModule, ComponentManifestModule],
  providers: [ComponentManifestUploadService],
  exports: [ComponentManifestUploadService],
})
export class ComponentManifestUploadModule {}
