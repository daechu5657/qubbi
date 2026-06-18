import * as Contract from "@qubbi/contract";
import { ApiProperty } from "@nestjs/swagger";

export class ComponentManifestPropDto {
  @ApiProperty({ type: String })
  key!: string;

  @ApiProperty({
    enumName: "ComponentPropType",
    enum: Contract.Enums.ComponentPropType,
  })
  type!: Contract.Enums.ComponentPropType;

  @ApiProperty({ type: Boolean })
  required!: boolean;
}
