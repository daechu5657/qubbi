import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { setupExceptionFilter } from "./bootstrap/setup-exception-filter";
import { setupOpenapi } from "./bootstrap/setup-openapi";
import { setupValidation } from "./bootstrap/setu-validation";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = app.get(ConfigService);
  const port = Number(config.get("SERVER_PORT") ?? 3000);

  setupOpenapi(app);
  setupValidation(app);
  setupExceptionFilter(app);

  await app.listen(port);
}

bootstrap();
