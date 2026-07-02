import { Module } from "@nestjs/common";
import { MongoDBModule } from "./infrastructure/mongodb/mongodb.module";
import { ComponentManagementModule } from "./modules/services/component-management/component-management.module";

@Module({
  imports: [MongoDBModule, ComponentManagementModule],
  exports: [],
})
export class AppModule {}
