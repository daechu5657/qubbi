import { ApiProperty } from "@nestjs/swagger";
import { TestDocument } from "../../schemas/test.schema";

export class TestModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  deletedTime: Date;

  constructor(test: TestDocument) {
    this.id = test._id.toString();
    this.name = test.name;
    this.email = test.email;
    this.deletedTime = test.deletedTime;
  }
}
