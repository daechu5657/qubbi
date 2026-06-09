import * as fg from "fast-glob";
import * as path from "path";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";

function collectExtraModels() {
  const baseDir = path.resolve(__dirname, "../../").replace(/\\/g, "/");
  const patterns = [`${baseDir}/**/*.model.js`, `${baseDir}/**/*.dto.js`];
  const modelFiles = fg.sync(patterns, {
    ignore: ["**/node_modules/**"],
  });

  const extraModels: Function[] = [];
  for (const file of modelFiles) {
    try {
      const module = require(file);
      for (const exportedItem of Object.values(module)) {
        if (
          typeof exportedItem === "function" &&
          exportedItem.name &&
          (exportedItem.name.endsWith("Model") ||
            exportedItem.name.endsWith("Dto"))
        ) {
          extraModels.push(exportedItem);
        }
      }
    } catch (error) {
      console.warn(`[Swagger] Failed to load module: ${file}`, error);
    }
  }

  return extraModels;
}

export function createOpenApiDocument(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle("API")
    .setDescription("The API description")
    .setVersion("1.0")
    .build();

  const asd = collectExtraModels();
  console.log(asd.length);

  return SwaggerModule.createDocument(app, config, {
    extraModels: asd,
  });
}

export function setupOpenapi(app: INestApplication) {
  const document = createOpenApiDocument(app);
  SwaggerModule.setup("api", app, document);
}
