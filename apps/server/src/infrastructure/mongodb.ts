import { Module, Provider } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { getConnectionToken, MongooseModule } from "@nestjs/mongoose";
import { Connection, Model, Schema } from "mongoose";

export class MongoContext {
  constructor(private readonly connection: Connection) {}

  model<T>(name: string, schema: Schema<T>): Model<T> {
    return (
      (this.connection.models[name] as Model<T>) ??
      this.connection.model<T>(name, schema)
    );
  }
}

const MongoContextProvider: Provider = {
  provide: MongoContext,
  inject: [getConnectionToken()],
  useFactory: (connection: Connection) => new MongoContext(connection),
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>("MONGO_URI"),
      }),
    }),
  ],
  providers: [MongoContextProvider],
  exports: [MongoContextProvider],
})
export class MongoDbModule {}
