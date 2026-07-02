import { ApiProperty } from "@nestjs/swagger";
import { ComponentManifestPartModel } from "./component-manifest-part.model";
import { ComponentManifestPropModel } from "./component-manifest-prop.model";
import { ComponentManifestVariantModel } from "./component-manifest-variant.model";
import { ComponentPlacementType } from "../enums/component-placement-type.enum";

export class ComponentManifestModel {
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
