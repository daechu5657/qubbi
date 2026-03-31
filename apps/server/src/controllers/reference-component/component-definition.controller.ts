import * as Contract from "@qubbi/contract";
import { Body, Put } from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";
import { ReferenceComponentController } from "./base.controller";
import { ComponentDefinitionService } from "../../../src/services/component-definition/component-definition.service";

@ReferenceComponentController("component-definition")
export class ComponentDefinitionController {
  constructor(
    private readonly componentDefinitionService: ComponentDefinitionService,
  ) {}

  @Put("")
  @ApiOkResponse({})
  async uploadComponentDefinitions(
    @Body() definitions: Contract.Definitions.ComponentDefinition[],
  ) {
    return this.componentDefinitionService.uploadDefinitions(
      "69b8f067426a3bdc33f9de67",
      // TODO: fix
      definitions,
    );
  }
}
