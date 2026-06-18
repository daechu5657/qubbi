import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsInt } from "class-validator";

export class UpdateTestModel {
  @ApiProperty()
  @IsString()
  readonly id: string;

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  readonly name: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly email: string;
}
