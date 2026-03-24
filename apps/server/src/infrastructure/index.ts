import { ModuleMetadata } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongoDbModule } from "./mongodb";

export const APP_IMPORTS: ModuleMetadata["imports"] = [
  MongoDbModule,
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: [".env", "../../.env"],
  }),
];
