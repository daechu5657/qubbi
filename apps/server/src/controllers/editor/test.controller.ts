import {
  Body,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { CreateTestDto } from "../../models/test/create-test.dto";
import { ApiOkResponse } from "@nestjs/swagger";
import { UpdateTestDto } from "../../models/test/update-test.dto";
import { TestModel } from "../../models/test/test.model";
import { TestModelingService } from "../../services/test/test-modeling.service";
import { TestService } from "../../services/test/test.service";
import { EditorController } from "./base.controller";

@EditorController("test")
export class TestController {
  constructor(
    private readonly testService: TestService,
    private readonly testModelingService: TestModelingService,
  ) {}

  @Get("")
  @ApiOkResponse({
    type: TestModel,
    isArray: true,
  })
  async list() {
    const items = await this.testService.list();

    return this.testModelingService.list(items);
  }

  @Get(":id")
  @ApiOkResponse({
    type: TestModel,
  })
  async single(@Param("id") id: string) {
    const item = await this.testService.single(id);

    if (item == null) {
      throw new NotFoundException();
    }

    return this.testModelingService.single(item);
  }

  @Put("")
  @ApiOkResponse({
    type: TestModel,
  })
  async create(@Body() createTestDto: CreateTestDto) {
    const item = await this.testService.create(createTestDto);

    return this.testModelingService.single(item);
  }

  @Post("")
  @ApiOkResponse({
    type: TestModel,
  })
  async update(@Body() updateTestDto: UpdateTestDto) {
    const item = await this.testService.update(updateTestDto);

    return this.testModelingService.single(item);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    this.testService.delete(id);
  }
}
