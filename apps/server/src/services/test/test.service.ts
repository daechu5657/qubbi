import { Injectable, NotFoundException } from "@nestjs/common";
import { BaseDatabaseService } from "../../common/base/baseDatabase.service";
import { CreateTestModel } from "../../models/test/createTest.model";
import { UpdateTestModel } from "../../models/test/updateTest.model";
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

  async create(CreateTestModel: CreateTestModel) {
    const item = new this.test(CreateTestModel);

    return item.save();
  }

  async update(UpdateTestModel: UpdateTestModel) {
    const item = await this.single(UpdateTestModel.id);

    await this.test.updateOne(
      { _id: item!.id },
      {
        name: UpdateTestModel.name,
        email: UpdateTestModel.email,
      },
    );

    return this.single(UpdateTestModel.id);
  }

  async delete(id: string) {
    const item = await this.single(id);

    await this.test.updateOne({ _id: item.id }, { deletedTime: new Date() });
  }
}
