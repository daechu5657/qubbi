import type { INestiaConfig } from "@nestia/sdk";

export interface Config {
  appModule: string;
  appModuleExport: string;
  exportPackageName: string;
  swagger: INestiaConfig["swagger"];
}
