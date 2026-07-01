import { Provider } from "@nestjs/common";
import { TestService } from "./test/test.service";
import { TestModelingService } from "./test/test-modeling.service";
import { ComponentManifestService } from "./componentManifest/componentManifest.service";
import { ZipService } from "../common/services/zip.service";
import { ComponentManifestModelingService } from "./componentManifest/componentManifestModeling.service";

export const APP_SERVICES: Provider[] = [
  TestService,
  TestModelingService,
  ComponentManifestService,
  ComponentManifestModelingService,
  ZipService,
];
