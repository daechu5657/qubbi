import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";
import { ExceptionResponseDto } from "../common/models/exception-response.dto";

const EXTRA_MODELS = [ExceptionResponseDto];

export function createOpenApiDocument(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle("API")
    .setDescription("The API description")
    .setVersion("1.0")
    .build();

  return SwaggerModule.createDocument(app, config, {
    extraModels: EXTRA_MODELS,
  });
}

export function setupOpenapi(app: INestApplication) {
  const document = createOpenApiDocument(app);
  SwaggerModule.setup("api", app, document);
}
