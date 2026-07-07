import { ComponentManifestStyleModel } from "./component-manifest-style.model";
import { ComponentPartKind } from "../enums/component-part-kind.enum";

export class ComponentManifestPartModel {
  tagName!: string;
  kind!: ComponentPartKind;
  order!: number;
  styles!: ComponentManifestStyleModel[];
  children!: ComponentManifestPartModel[];
}
