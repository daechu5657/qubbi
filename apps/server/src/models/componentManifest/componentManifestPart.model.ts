import * as Contract from "@qubbi/contract";
import { ApiProperty } from "@nestjs/swagger";
import { ComponentManifestStyleModel } from "./componentManifestStyle.model";

export class ComponentManifestPartModel {
  @ApiProperty({ type: String })
  tagName!: string;

  @ApiProperty({
    enumName: "ComponentPartKind",
    enum: Contract.Enums.ComponentPartKind,
  })
  kind!: Contract.Enums.ComponentPartKind;

  @ApiProperty({ type: Number })
  order!: number;

  @ApiProperty({ type: () => [ComponentManifestStyleModel] })
  styles!: ComponentManifestStyleModel[];

  @ApiProperty({ type: () => [ComponentManifestPartModel] })
  children!: ComponentManifestPartModel[];
}
