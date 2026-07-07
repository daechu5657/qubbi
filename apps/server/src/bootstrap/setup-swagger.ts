import { SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";
import { NestiaSwaggerComposer } from "@nestia/sdk";
import { loadSwaggerConfig } from "@qubbi/sdk-builder";

export async function setupSwagger(app: INestApplication) {
  const document = await NestiaSwaggerComposer.document(app, {
    ...loadSwaggerConfig(),
  });

  SwaggerModule.setup("api", app, document as any);
}
