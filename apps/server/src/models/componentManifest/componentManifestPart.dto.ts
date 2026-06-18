import { ApiProperty } from "@nestjs/swagger";
import { ComponentPartKind } from "../../enums/componentPartKind";
import { ComponentManifestStyleDto } from "./componentManifestStyle.dto";

export class ComponentManifestPartDto {
  @ApiProperty({ type: String })
  tagName!: string;

  @ApiProperty({ enumName: "ComponentPartKind", enum: ComponentPartKind })
  kind!: ComponentPartKind;

  @ApiProperty({ type: Number })
  order!: number;

  @ApiProperty({ type: () => [ComponentManifestStyleDto] })
  styles!: ComponentManifestStyleDto[];

  @ApiProperty({ type: () => [ComponentManifestPartDto] })
  children!: ComponentManifestPartDto[];
}
