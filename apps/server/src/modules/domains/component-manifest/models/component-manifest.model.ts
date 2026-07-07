import { ComponentPlacementType } from "../enums/component-placement-type.enum";
import { ComponentManifestPartModel } from "./component-manifest-part.model";
import { ComponentManifestPropModel } from "./component-manifest-prop.model";
import { ComponentManifestVariantModel } from "./component-manifest-variant.model";

export class ComponentManifestModel {
  name!: string;
  placementType!: ComponentPlacementType;
  variants!: ComponentManifestVariantModel[];
  props!: ComponentManifestPropModel[];
  parts!: ComponentManifestPartModel[];
}
