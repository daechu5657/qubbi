import { Provider } from "@nestjs/common";
import { ComponentManifestService } from "./componentManifest/componentManifest.service";
import { ZipService } from "../common/services/zip.service";
import { ComponentManifestModelingService } from "./componentManifest/componentManifestModeling.service";

export const APP_SERVICES: Provider[] = [
  ComponentManifestService,
  ComponentManifestModelingService,
  ZipService,
];
