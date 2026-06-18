import { ApiProperty } from "@nestjs/swagger";

export class ComponentManifestStyleDto {
  @ApiProperty({ type: String })
  variantKey!: string;

  @ApiProperty({ type: String })
  cssProperty!: keyof ElementCSSInlineStyle["style"];

  @ApiProperty({ type: String })
  rawValue!: string;
}
