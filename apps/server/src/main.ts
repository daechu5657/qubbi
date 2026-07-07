import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { setupSwagger } from "./bootstrap/setup-swagger";
import { GlobalExceptionFilter } from "./shared/filters/global-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = Number(config.get("SERVER_PORT") ?? 3000);

  app.enableCors();
  app.useGlobalFilters(new GlobalExceptionFilter());

  await setupSwagger(app);
  await app.listen(port);
}

bootstrap();
