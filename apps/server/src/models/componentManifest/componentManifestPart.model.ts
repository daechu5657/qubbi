import { ApiProperty } from "@nestjs/swagger";
import { ComponentManifestStyleModel } from "./componentManifestStyle.model";
import { ComponentPartKind } from "../../enums";

export class ComponentManifestPartModel {
  @ApiProperty({ type: String })
  tagName!: string;

  @ApiProperty({
    enumName: "ComponentPartKind",
    enum: ComponentPartKind,
  })
  kind!: ComponentPartKind;

  @ApiProperty({ type: Number })
  order!: number;

  @ApiProperty({ type: () => [ComponentManifestStyleModel] })
  styles!: ComponentManifestStyleModel[];

  @ApiProperty({ type: () => [ComponentManifestPartModel] })
  children!: ComponentManifestPartModel[];
}
