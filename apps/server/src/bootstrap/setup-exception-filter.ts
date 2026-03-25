import { INestApplication } from "@nestjs/common";
import { GlobalExceptionFilter } from "../../src/common/filters/global-exception.filter";

export function setupExceptionFilter(app: INestApplication) {
  app.useGlobalFilters(new GlobalExceptionFilter());
}
