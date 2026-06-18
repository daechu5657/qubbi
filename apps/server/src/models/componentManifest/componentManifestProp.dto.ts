import { ApiProperty } from "@nestjs/swagger";
import { ComponentPropType } from "../../enums/componentPropType";

export class ComponentManifestPropDto {
  @ApiProperty({ type: String })
  key!: string;

  @ApiProperty({ enumName: "ComponentPropType", enum: ComponentPropType })
  type!: ComponentPropType;

  @ApiProperty({ type: Boolean })
  required!: boolean;
}
