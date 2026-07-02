import { ApiProperty } from "@nestjs/swagger";
import { ComponentManifestPartModel } from "./componentManifestPart.model";
import { ComponentManifestPropModel } from "./componentManifestProp.model";
import { ComponentManifestVariantModel } from "./componentManifestVariant.model";
import { ComponentPlacementType } from "../../enums";

export class ComponentManifestComponentModel {
  @ApiProperty({ type: String })
  name!: string;

  @ApiProperty({
    enumName: "ComponentPlacementType",
    enum: ComponentPlacementType,
  })
  placementType!: ComponentPlacementType;

  @ApiProperty({ type: () => [ComponentManifestVariantModel] })
  variants!: ComponentManifestVariantModel[];

  @ApiProperty({ type: () => [ComponentManifestPropModel] })
  props!: ComponentManifestPropModel[];

  @ApiProperty({ type: () => [ComponentManifestPartModel] })
  parts!: ComponentManifestPartModel[];
}
