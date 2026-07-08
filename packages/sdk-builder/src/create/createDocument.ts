import { NestFactory } from "@nestjs/core";
import { NestiaSwaggerComposer } from "@nestia/sdk";
import { OpenApiV3_1 } from "@typia/interface";
import { IConfig } from "../types.js";

export async function createDocument({
  AppModule,
  config,
}: {
  AppModule: any;
  config: IConfig;
}) {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  try {
    const document = await NestiaSwaggerComposer.document(app, {
      ...config.swagger,
    });

    return document as OpenApiV3_1.IDocument;
  } catch (error) {
    throw error;
  } finally {
    await app.close();
  }
}
