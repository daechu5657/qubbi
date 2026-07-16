import { SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";
import { NestiaSwaggerComposer } from "@nestia/sdk";
import { ConfigLoader } from "@qubbi/sdk-cli";

export async function setupSwagger(app: INestApplication) {
  const document = await NestiaSwaggerComposer.document(app, {
    ...ConfigLoader.load().swagger,
  });

  SwaggerModule.setup("api", app, document as any);
}
