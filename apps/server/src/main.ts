import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { GlobalExceptionFilter } from "./common/filters/global-exception.filter";
import { ExceptionResponseDto } from "./common/models/exception-response.dto";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle("API")
      .setDescription("The API description")
      .setVersion("1.0")
      .build(),
    {
      extraModels: [ExceptionResponseDto],
    },
  );
  SwaggerModule.setup("api", app, document);

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(Number(config.get("SERVER_PORT") ?? 3000));
}
bootstrap();
