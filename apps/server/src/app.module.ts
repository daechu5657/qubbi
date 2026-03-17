import { Module, ModuleMetadata } from "@nestjs/common";
import { TestController } from "./controllers/editor/test.controller";
import { MongoDbModule } from "./infrastructure/mongodb";
import { TestModelingService } from "./services/test/test-modeling.service";
import { TestService } from "./services/test/test.service";
import { ConfigModule } from "@nestjs/config";

const rootImports: ModuleMetadata["imports"] = [
  MongoDbModule,
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: [".env", "../../.env"],
  }),
];
const rootProviders: ModuleMetadata["providers"] = [
  TestService,
  TestModelingService,
];
const rootExports: ModuleMetadata["exports"] = [];
const rootControllers: ModuleMetadata["controllers"] = [TestController];

@Module({
  imports: rootImports,
  providers: rootProviders,
  exports: rootExports,
  controllers: rootControllers,
})
export class AppModule {}
