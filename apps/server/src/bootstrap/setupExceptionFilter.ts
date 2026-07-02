import { INestApplication } from "@nestjs/common";
import { GlobalExceptionFilter } from "../shared/filters/global-exception.filter";

export function setupExceptionFilter(app: INestApplication) {
  app.useGlobalFilters(new GlobalExceptionFilter());
}
