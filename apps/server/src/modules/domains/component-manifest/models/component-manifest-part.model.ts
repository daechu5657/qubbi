import { ApiProperty } from "@nestjs/swagger";
import { ComponentManifestStyleModel } from "./component-manifest-style.model";
import { ComponentPartKind } from "../enums/component-part-kind.enum";

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
