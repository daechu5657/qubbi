import { Injectable, NotFoundException } from "@nestjs/common";
import { BaseDatabaseService } from "../../common/base/base-database.service";
import { CreateTestDto } from "../../models/test/create-test.dto";
import { UpdateTestDto } from "../../models/test/update-test.dto";
import { Test, TestSchema } from "../../schemas/test/test.schema";

@Injectable()
export class TestService extends BaseDatabaseService {
  private get test() {
    return this.mongoContext.model<Test>(Test.name, TestSchema);
  }

  async list() {
    return this.test.find().exec();
  }

  async single(id: string) {
    const item = await this.test.findById(id).exec();

    if (item === null) {
      throw new NotFoundException();
    }

    return item;
  }

  async create(createTestDto: CreateTestDto) {
    const item = new this.test(createTestDto);

    return item.save();
  }

  async update(updateTestDto: UpdateTestDto) {
    const item = await this.single(updateTestDto.id);

    await this.test.updateOne(
      { _id: item!.id },
      {
        name: updateTestDto.name,
        email: updateTestDto.email,
      },
    );

    return this.single(updateTestDto.id);
  }

  async delete(id: string) {
    const item = await this.single(id);

    await this.test.updateOne({ _id: item.id }, { deletedTime: new Date() });
  }
}
