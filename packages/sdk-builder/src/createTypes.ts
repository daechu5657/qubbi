import * as path from "node:path";
import { writeFileSync } from "node:fs";
import { NestFactory } from "@nestjs/core";
import { NestiaSwaggerComposer } from "@nestia/sdk";
import { ConfigSchema } from "./cli.js";
import openapiTS, { astToString } from "openapi-typescript";
import { patchTypes } from "./patchTypes.js";

export async function createTypes({
  AppModule,
  config,
  generatePath,
}: {
  AppModule: any;
  config: ConfigSchema;
  generatePath: string;
}) {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  try {
    const document = await NestiaSwaggerComposer.document(app, {
      ...config.swagger,
    });

    const ast = await openapiTS(document as any, {
      exportType: true,
    });

    const raw = astToString(ast);

    const contents = patchTypes({
      sourceText: raw,
      serverRoot: process.cwd(),
      tsconfig: "./tsconfig.json",
    });

    const filePath = path.resolve(generatePath, "./src/generated.ts");

    writeFileSync(filePath, contents);
  } catch (error) {
    throw error;
  } finally {
    await app.close();
  }
}
