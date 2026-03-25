import { writeFileSync } from "node:fs";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { createOpenApiDocument } from "../src/bootstrap/setup-openapi";

async function main() {
  const app = await NestFactory.create(AppModule);
  try {
    const document = createOpenApiDocument(app);

    writeFileSync("./openapi.json", JSON.stringify(document, null, 2));
  } finally {
    await app.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
