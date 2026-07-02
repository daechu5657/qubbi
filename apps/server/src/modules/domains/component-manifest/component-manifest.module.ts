import { Module } from "@nestjs/common";
import { ComponentManifestService } from "./component-manifest.service";

@Module({
  providers: [ComponentManifestService],
  exports: [ComponentManifestService],
})
export class ComponentManifestModule {}
