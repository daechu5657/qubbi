import { Injectable } from "@nestjs/common";
import { TestModel } from "../..//models/test/test.model";
import { TestDocument } from "../../schemas/test/test.schema";

@Injectable()
export class TestModelingService {
  async single(item: TestDocument) {
    return new TestModel(item);
  }

  async list(items: TestDocument[]) {
    return items.map((item) => new TestModel(item));
  }
}
