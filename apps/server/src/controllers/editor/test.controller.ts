import {
  Body,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { CreateTestModel } from "../../models/test/createTest.model";
import { ApiOkResponse } from "@nestjs/swagger";
import { UpdateTestModel } from "../../models/test/updateTest.model";
import { TestModel } from "../../models/test/test.model";
import { TestModelingService } from "../../services/test/test-modeling.service";
import { TestService } from "../../services/test/test.service";
import { EditorController } from "./base.controller";
import { ComponentStyleModel } from "../../models/component/componentStyle.model";
import { RevisionModel } from "../../models/revision/revision.model";

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
  async create(@Body() createTestModel: CreateTestModel) {
    const item = await this.testService.create(createTestModel);

    return this.testModelingService.single(item);
  }

  @Post("")
  @ApiOkResponse({
    type: TestModel,
  })
  async update(@Body() UpdateTestModel: UpdateTestModel) {
    const item = await this.testService.update(UpdateTestModel);

    return this.testModelingService.single(item);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    this.testService.delete(id);
  }

  @Delete("1")
  @ApiOkResponse({
    type: ComponentStyleModel,
  })
  test1(@Body() body: ComponentStyleModel) {
    return body;
  }
}
