import { ApiProperty } from "@nestjs/swagger";

export class ExceptionResponseDto {
  @ApiProperty()
  source!: "server" | "mongoose" | "default";

  @ApiProperty()
  statusCode!: number;

  @ApiProperty()
  message!: string;

  @ApiProperty()
  path!: string;

  @ApiProperty()
  timestamp!: string;
}
