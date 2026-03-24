import { Module } from "@nestjs/common";
import { APP_SERVICES } from "./services";
import { APP_CONTROLLERS } from "./controllers";
import { APP_IMPORTS } from "./infrastructure";

@Module({
  imports: APP_IMPORTS,
  providers: [...APP_SERVICES],
  exports: [],
  controllers: [...APP_CONTROLLERS],
})
export class AppModule {}
