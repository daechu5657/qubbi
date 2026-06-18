import * as Contract from "@qubbi/contract";
import { ApiProperty } from "@nestjs/swagger";
import { ComponentManifestStyleDto } from "./componentManifestStyle.dto";

export class ComponentManifestPartDto {
  @ApiProperty({ type: String })
  tagName!: string;

  @ApiProperty({
    enumName: "ComponentPartKind",
    enum: Contract.Enums.ComponentPartKind,
  })
  kind!: Contract.Enums.ComponentPartKind;

  @ApiProperty({ type: Number })
  order!: number;

  @ApiProperty({ type: () => [ComponentManifestStyleDto] })
  styles!: ComponentManifestStyleDto[];

  @ApiProperty({ type: () => [ComponentManifestPartDto] })
  children!: ComponentManifestPartDto[];
}
