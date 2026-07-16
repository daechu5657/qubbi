import { NestiaSwaggerComposer } from "@nestia/sdk";
import { NestFactory } from "@nestjs/core";
import type { OpenApiV3_1 } from "@typia/interface";
import type { Config } from "../structures/Config.js";

export namespace DocumentComposer {
  export const compose = async ({
    AppModule,
    config,
  }: {
    AppModule: any;
    config: Config;
  }): Promise<OpenApiV3_1.IDocument> => {
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
  };
}
