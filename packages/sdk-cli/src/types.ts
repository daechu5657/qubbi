import { INestiaConfig } from "@nestia/sdk";

export interface IConfig {
  appModule: string;
  appModuleExport: string;
  exportPackageName: string;
  swagger: INestiaConfig["swagger"];
}
