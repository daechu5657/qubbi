import { Provider } from "@nestjs/common";
import { TestService } from "./test/test.service";
import { TestModelingService } from "./test/test-modeling.service";
import { ComponentDefinitionService } from "./component-definition/component-definition.service";

export const APP_SERVICES: Provider[] = [
  TestService,
  TestModelingService,
  ComponentDefinitionService,
];
