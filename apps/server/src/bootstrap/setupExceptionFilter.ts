import { INestApplication } from "@nestjs/common";
import { GlobalExceptionFilter } from "../common/filters/globalException.filter";

export function setupExceptionFilter(app: INestApplication) {
  app.useGlobalFilters(new GlobalExceptionFilter());
}
